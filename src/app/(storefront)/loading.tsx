export default function StorefrontLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse space-y-8">
      <div className="h-10 w-48 rounded-lg bg-muted" />
      <div className="h-4 w-96 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-72 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
