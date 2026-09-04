export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-noche/10" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded-lg bg-noche/8" />
      <div className="h-56 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}
