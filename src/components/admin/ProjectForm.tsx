"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProject, type FormState } from "@/app/actions";
import { Labeled, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Project } from "@/lib/types";

const initial: FormState = { status: "idle" };

const IMAGE_LIBRARY = [
  "/images/proj-lumen.webp",
  "/images/proj-norte.webp",
  "/images/proj-aurea.webp",
  "/images/proj-vela.webp",
  "/images/detail-macro.webp",
];

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action] = useActionState(saveProject, initial);
  const [cover, setCover] = useState(project?.cover ?? IMAGE_LIBRARY[0]);

  return (
    <form action={action} className="grid max-w-[1100px] grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-3">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="space-y-6 lg:col-span-2">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
          <Labeled label="Número" error={state.errors?.index}>
            <input name="index" defaultValue={project?.index ?? ""} placeholder="05" required className={inputClass} />
          </Labeled>
          <Labeled label="Ano" error={state.errors?.year}>
            <input name="year" defaultValue={project?.year ?? String(new Date().getFullYear())} required className={inputClass} />
          </Labeled>
        </div>

        <Labeled label="Título" error={state.errors?.title}>
          <input name="title" defaultValue={project?.title ?? ""} placeholder="Casa LUMEN" required className={inputClass} />
        </Labeled>

        <Labeled label="Slug (URL)" hint="Usado em /projetos/[slug]. Deixe em branco para gerar a partir do título." error={state.errors?.slug}>
          <input name="slug" defaultValue={project?.slug ?? ""} placeholder="casa-lumen" required className={inputClass} />
        </Labeled>

        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
          <Labeled label="Tipologia" error={state.errors?.category}>
            <input name="category" defaultValue={project?.category ?? ""} placeholder="Moradia contemporânea" required className={inputClass} />
          </Labeled>
          <Labeled label="Localização" error={state.errors?.location}>
            <input name="location" defaultValue={project?.location ?? ""} placeholder="Coimbra" required className={inputClass} />
          </Labeled>
          <Labeled label="Área" error={state.errors?.area}>
            <input name="area" defaultValue={project?.area ?? ""} placeholder="320 m²" className={inputClass} />
          </Labeled>
          <Labeled label="Estado da obra">
            <select name="status" defaultValue={project?.status ?? "Em obra"} className={inputClass}>
              {["Em estudo", "Em obra", "Concluído"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Labeled>
        </div>

        <Labeled label="Resumo" hint="Uma ou duas frases — aparece na listagem e nas metatags." error={state.errors?.excerpt}>
          <textarea name="excerpt" rows={3} defaultValue={project?.excerpt ?? ""} className={`${inputClass} resize-none`} />
        </Labeled>

        <Labeled label="Descrição" hint="Um parágrafo por linha.">
          <textarea
            name="description"
            rows={8}
            defaultValue={project?.description.join("\n") ?? ""}
            className={`${inputClass} resize-y`}
          />
        </Labeled>

        <Labeled label="Galeria" hint="Um caminho de imagem por linha. A primeira imagem da galeria é substituída pela capa na página de projeto.">
          <textarea
            name="gallery"
            rows={4}
            defaultValue={project?.gallery.join("\n") ?? IMAGE_LIBRARY[0]}
            className={`${inputClass} resize-y font-mono text-[12.5px]`}
          />
        </Labeled>
      </div>

      <aside className="space-y-6">
        <Labeled label="Imagem de capa" hint="Caminho local ou URL público (Supabase Storage).">
          <input
            name="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            required
            className={`${inputClass} font-mono text-[12.5px]`}
          />
        </Labeled>

        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[rgba(10,10,10,0.12)] bg-bone-3">
          {cover ? (
            <Image src={cover} alt="Pré-visualização da capa" fill sizes="320px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[12px] text-ink/35">
              Sem imagem
            </span>
          )}
        </div>

        <div>
          <span className="eyebrow text-ink/45">Biblioteca</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {IMAGE_LIBRARY.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setCover(src)}
                aria-label={`Usar imagem ${src}`}
                className={`relative aspect-square overflow-hidden rounded-md border transition-colors ${
                  cover === src ? "border-ink" : "border-transparent hover:border-ink/30"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <Labeled label="Composição na grelha" hint="Define o peso do projeto na grelha editorial da homepage.">
          <select name="span" defaultValue={project?.span ?? "regular"} className={inputClass}>
            <option value="wide">Larga (destaque)</option>
            <option value="tall">Vertical</option>
            <option value="regular">Regular</option>
            <option value="offset">Deslocada</option>
          </select>
        </Labeled>

        <div className="space-y-3 rounded-xl border border-[rgba(10,10,10,0.12)] p-4">
          <label className="flex items-center gap-3 text-[13.5px]">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="h-4 w-4 accent-[#0a0a0a]" />
            Publicado no site
          </label>
          <label className="flex items-center gap-3 text-[13.5px]">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 accent-[#0a0a0a]" />
            Destacar na homepage
          </label>
        </div>

        {state.status === "error" && state.message && (
          <p role="alert" className="text-[13px] text-[#b23b2e]">
            {state.message}
          </p>
        )}

        <div className="flex items-center gap-3">
          <SubmitButton>{project ? "Guardar alterações" : "Criar projeto"}</SubmitButton>
          <Link href="/admin/projetos" className="text-[13px] text-ink/50 hover:text-ink">
            Cancelar
          </Link>
        </div>
      </aside>
    </form>
  );
}
