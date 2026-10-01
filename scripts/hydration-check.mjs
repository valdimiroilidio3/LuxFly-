/**
 * Verificação de erros de runtime no cliente, sem browser.
 *
 * Carrega cada página num JSDOM com os scripts reais do bundle a executar,
 * com as APIs de browser em falta no JSDOM preenchidas (matchMedia,
 * IntersectionObserver, ResizeObserver, document.fonts, rAF), e recolhe
 * console.error, erros por lançar e rejeições não tratadas.
 *
 *   node scripts/hydration-check.mjs [baseUrl]
 */
import { JSDOM, VirtualConsole } from "jsdom";

const BASE = process.argv[2] ?? "http://localhost:3000";
const ROUTES = [
  "/",
  "/empresa",
  "/projetos",
  "/projetos/casa-lumen",
  "/servicos",
  "/contacto",
  "/termos",
  "/admin/login",
];

// Ruído conhecido do ambiente JSDOM — não são defeitos da aplicação.
const IGNORE = [
  /Could not parse CSS stylesheet/i,
  /Not implemented: HTMLCanvasElement/i,
  /Not implemented: window\.scrollTo/i,
  /Error: Not implemented: navigation/i,
  /CSS.*supports/i,
];

const isNoise = (msg) => IGNORE.some((r) => r.test(msg));
const short = (m) => String(m).replace(/\s+/g, " ").slice(0, 220);

function polyfill(win) {
  win.matchMedia = (query) => ({
    matches: /min-width:\s*(768|1024|1200)/.test(query) ? true : false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });

  class IO {
    constructor(cb) {
      this.cb = cb;
    }
    observe(el) {
      this.cb([{ isIntersecting: true, intersectionRatio: 1, target: el }], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  win.IntersectionObserver = IO;
  win.IntersectionObserverEntry = function () {};
  win.ResizeObserver = RO;

  if (!win.document.fonts) {
    Object.defineProperty(win.document, "fonts", {
      value: { ready: Promise.resolve(), check: () => true, load: () => Promise.resolve([]) },
      configurable: true,
    });
  }
  win.scrollTo = () => {};

  // Globais de plataforma que o JSDOM não expõe mas o Node tem.
  for (const key of [
    "ReadableStream", "WritableStream", "TransformStream", "ByteLengthQueuingStrategy",
    "CountQueuingStrategy", "TextEncoder", "TextDecoder", "TextDecoderStream",
    "fetch", "Headers", "Request", "Response", "AbortController", "AbortSignal",
    "queueMicrotask", "structuredClone", "MessageChannel", "BroadcastChannel",
  ]) {
    if (win[key] === undefined && globalThis[key] !== undefined) win[key] = globalThis[key];
  }

  // O JSDOM deixa document.currentScript a null quando avalia scripts externos
  // fora do tick de parsing; o runtime do Turbopack depende dele. Devolver o
  // último <script> conhecido torna a hidratação possível neste ambiente.
  const proto = win.Document.prototype;
  const original = Object.getOwnPropertyDescriptor(proto, "currentScript");
  Object.defineProperty(proto, "currentScript", {
    configurable: true,
    get() {
      const real = original?.get?.call(this) ?? null;
      if (real) return real;
      const scripts = this.querySelectorAll("script[src]");
      return scripts.length ? scripts[scripts.length - 1] : null;
    },
  });
  if (!win.structuredClone) win.structuredClone = (v) => JSON.parse(JSON.stringify(v));
}

async function check(route) {
  const url = `${BASE}${route}`;
  const res = await fetch(url);
  const html = await res.text();
  const errors = [];

  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (e) => {
    const m = `${e.message}${e.detail ? ` — ${e.detail}` : ""}`;
    if (!isNoise(m)) errors.push(`[jsdomError] ${short(m)}`);
  });
  virtualConsole.on("error", (...args) => {
    const m = args.map(String).join(" ");
    if (!isNoise(m)) errors.push(`[console.error] ${short(m)}`);
  });
  virtualConsole.on("warn", (...args) => {
    const m = args.map(String).join(" ");
    if (/hydrat|did not match|mismatch/i.test(m)) errors.push(`[hydration] ${short(m)}`);
  });

  const dom = new JSDOM(html, {
    url,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse: (win) => {
      polyfill(win);
      win.addEventListener("error", (e) => {
        const m = e.error?.message ?? e.message;
        if (!isNoise(String(m))) errors.push(`[script error] ${short(m)}`);
      });
    },
  });

  dom.window.addEventListener("error", (e) => {
    const m = e.error?.stack || e.message;
    if (!isNoise(String(m))) errors.push(`[window.onerror] ${short(m)}`);
  });
  dom.window.addEventListener("unhandledrejection", (e) => {
    errors.push(`[unhandledrejection] ${short(e.reason)}`);
  });

  const initialBody = dom.window.document.body.innerHTML;
  await new Promise((r) => setTimeout(r, 4500));

  // A hidratação correu? O React deve ter montado conteúdo interativo.
  const doc = dom.window.document;
  const hasContent = doc.querySelector("main, #conteudo, form, h1") !== null;
  // Prova de hidratação: estes nós só existem depois do React correr no cliente.
  const hydrated =
    doc.querySelector("[data-modus-hydrated]") !== null ||
    doc.querySelector("[style*='font-size']") !== null ||
    doc.body.innerHTML !== initialBody;
  dom.window.close();

  return { route, status: res.status, errors, hasContent, hydrated };
}

let failures = 0;
for (const route of ROUTES) {
  const r = await check(route);
  const flag = r.errors.length === 0 && r.hasContent && r.hydrated && r.status === 200 ? "PASS" : "FAIL";
  if (flag === "FAIL") failures++;
  console.log(`${flag}  ${r.route}  (HTTP ${r.status}, hidratado: ${r.hydrated ? "sim" : "NÃO"})`);
  for (const e of [...new Set(r.errors)].slice(0, 4)) console.log(`        ${short(e)}`);
}

console.log(failures === 0 ? "\nSem erros de runtime detetados." : `\n${failures} rota(s) com problemas.`);
process.exit(failures === 0 ? 0 : 1);
