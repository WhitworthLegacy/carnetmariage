export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(216,167,177,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(167,139,250,0.08) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}
