import Link from 'next/link';

/** Landing page — simple, clean, Apple-style aesthetic */
export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-lg font-bold tracking-tight">Linkks</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm px-4 py-2">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          One link.
          <br />
          <span className="text-brand-600">All your content.</span>
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Build a beautiful smart page with modular content blocks. Share links, products,
          portfolios, and more — all from a single URL.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary text-base px-6 py-3">
            Create Your Page
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '◻️',
              title: 'Content Blocks',
              desc: 'Links, text, social icons, contact cards, products, testimonials, resume, and portfolio pieces.',
            },
            {
              icon: '📱',
              title: 'QR Codes',
              desc: 'Generate a QR code for your page. Share it on print materials, cards, or screens.',
            },
            {
              icon: '📊',
              title: 'Analytics',
              desc: 'Track page views, link clicks, and QR scans. Know what resonates with your audience.',
            },
          ].map((f) => (
            <div key={f.title} className="card text-center">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight">Built for individuals and businesses</h2>
        <p className="mt-2 text-sm text-gray-500">
          Choose your persona during setup. Individuals get portfolio and resume blocks.
          Businesses get product and testimonial blocks.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="card py-8">
            <span className="text-4xl">👤</span>
            <p className="mt-2 text-sm font-semibold">Individual</p>
          </div>
          <div className="card py-8">
            <span className="text-4xl">🏢</span>
            <p className="mt-2 text-sm font-semibold">Business</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        Linkks &mdash; Your smart page, one link.
      </footer>
    </div>
  );
}
