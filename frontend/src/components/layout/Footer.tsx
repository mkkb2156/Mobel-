import Link from "next/link";

const footerLinks = {
  shop: [
    { href: "/products", label: "所有商品" },
    { href: "/designers", label: "設計師" },
    { href: "/categories/seating", label: "座椅" },
    { href: "/categories/tables", label: "桌几" },
    { href: "/categories/lighting", label: "燈具" },
  ],
  info: [
    { href: "/about", label: "關於我們" },
    { href: "/how-it-works", label: "購買流程" },
    { href: "/shipping-calculator", label: "運費計算" },
  ],
  account: [
    { href: "/account", label: "我的帳戶" },
    { href: "/account/orders", label: "訂單查詢" },
    { href: "/account/wishlist", label: "收藏清單" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-linen bg-charcoal text-linen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wider text-cream">
              MOBEL
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-linen/70">
              精選歐洲古董家具，為您的空間增添獨特韻味。來自歐洲各地的經典設計師作品，直送台灣。
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
              選購
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-linen/70 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
              資訊
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-linen/70 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
              帳戶
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-linen/70 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-linen/20 pt-8 text-center text-xs text-linen/50">
          <p>&copy; {new Date().getFullYear()} MOBEL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
