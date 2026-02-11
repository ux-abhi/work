import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            LinkCard
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-16">
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in">
            Your Digital Identity,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              One Link Away
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 animate-fade-in-delay-1">
            Create a beautiful link-in-bio page, generate QR codes, and add your profile
            to Apple Wallet. Share everything you are with a single link.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-delay-2">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-8 py-3 text-lg font-medium text-black hover:bg-gray-200"
            >
              Create Your LinkCard
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-zinc-700 px-8 py-3 text-lg font-medium hover:bg-zinc-900"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-zinc-800 bg-zinc-950 py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything You Need
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                title="Link Management"
                description="Add unlimited links, social profiles, and custom content. Drag and drop to reorder."
                icon="🔗"
              />
              <FeatureCard
                title="QR Code Generation"
                description="Generate beautiful QR codes for your profile. Download as PNG for print or digital use."
                icon="📱"
              />
              <FeatureCard
                title="Apple Wallet"
                description="Add your LinkCard to Apple Wallet for quick access. Share with a tap."
                icon="💳"
              />
              <FeatureCard
                title="Beautiful Themes"
                description="Choose from professionally designed themes. Dark, Modern, Vintage, and Corporate."
                icon="🎨"
              />
              <FeatureCard
                title="Click Analytics"
                description="Track every click. See which links perform best and where your audience comes from."
                icon="📊"
              />
              <FeatureCard
                title="Mobile-First"
                description="Optimized for mobile with a beautiful Apple-inspired design aesthetic."
                icon="✨"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-800 py-24">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-gray-400">
              Join thousands of creators and businesses using LinkCard.
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-medium text-black hover:bg-gray-200"
            >
              Create Your Free LinkCard
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800 py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} LinkCard. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
