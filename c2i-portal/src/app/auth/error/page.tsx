import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="font-mono text-xs tracking-widest text-danger uppercase">
          Authentication error
        </div>
        <h1 className="text-2xl font-medium tracking-tight">Couldn&apos;t sign you in</h1>
        <p className="text-sm text-fg-muted">
          Verify your account has been added to one of the C2I tier groups in Entra ID.
          Contact the portal admin if this persists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-bg-overlay transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
