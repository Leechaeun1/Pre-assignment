export default function Skeleton({ lines = 10 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-6 w-full rounded bg-gray-200" />
      ))}
    </div>
  );
}
