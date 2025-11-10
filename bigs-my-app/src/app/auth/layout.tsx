export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
      <h1 className="mb-8 text-center text-4xl font-bold">Log In</h1>
      <div className="w-full max-w-md rounded-lg bg-black/[0.07] p-8 ">
        {children}
      </div>
    </div>
  );
}
