export default function AddressesPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">地址管理</h2>
      <p className="mt-2 text-sm text-walnut/70">管理您的收貨地址</p>

      <div className="mt-8 border border-dashed border-linen p-12 text-center">
        <p className="text-walnut/60">尚未新增地址</p>
        <button className="mt-4 bg-brass px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-brass-dark">
          新增地址
        </button>
      </div>
    </div>
  );
}
