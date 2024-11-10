import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Storm Shield</h3>
            <p className="text-slate-300">
              Providing the Power to Weather Any Storm!
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-300 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-300 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="text-slate-300">
              <p>Houston, TX</p>
              <p className="mt-2">support@stormshield.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}