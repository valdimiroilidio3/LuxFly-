export default function Loading() {
  return (
    <div className="shell min-h-[100svh] pt-[160px]" aria-busy="true" aria-label="A carregar">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton mt-8 h-[14vw] w-full max-w-[900px] rounded-sm" />
      <div className="skeleton mt-6 h-4 w-[44ch] max-w-full rounded-full" />
      <div className="skeleton mt-3 h-4 w-[32ch] max-w-full rounded-full" />
      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="skeleton aspect-[4/3] w-full" />
        <div className="skeleton aspect-[4/3] w-full md:mt-16" />
      </div>
    </div>
  );
}
