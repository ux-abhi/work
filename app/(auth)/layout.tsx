// Prevent static pre-rendering (Supabase client requires env vars at runtime)
export const dynamic = 'force-dynamic';

/** Auth layout — centered card on a clean background */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
