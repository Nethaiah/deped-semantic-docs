export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(8,120,48,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(28,64,46,0.08),transparent_30%)]" />
      <div className="absolute left-1/2 top-0 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

      <div className="relative flex min-h-screen flex-col px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
