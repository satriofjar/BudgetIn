export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background p-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--chart-income) 12%, transparent), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--chart-investment) 14%, transparent), transparent 45%)",
        }}
      />
      {children}
    </div>
  );
}
