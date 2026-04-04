import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "註冊",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center font-serif text-3xl font-bold text-charcoal">建立帳戶</h1>
        <p className="mt-2 text-center text-sm text-walnut/70">
          加入 MOBEL，探索歐洲古董家具之美
        </p>

        <form className="mt-8 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-walnut">姓名</label>
            <input
              id="name"
              type="text"
              placeholder="您的姓名"
              className="w-full border border-linen bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-walnut/50 focus:border-brass focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-walnut">電子郵件</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-linen bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-walnut/50 focus:border-brass focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-walnut">密碼</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-linen bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-walnut/50 focus:border-brass focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brass py-2.5 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-brass-dark"
          >
            註冊
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-walnut/70">
          已有帳戶？{" "}
          <Link href="/auth/login" className="font-medium text-brass hover:text-brass-dark">
            立即登入
          </Link>
        </p>
      </div>
    </div>
  );
}
