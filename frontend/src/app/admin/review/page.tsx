export default function AdminReviewPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">審核中心</h1>
      <p className="mt-2 text-sm text-walnut/70">審核待上架的商品資訊與翻譯</p>

      <div className="mt-8 border border-dashed border-linen p-12 text-center">
        <p className="text-walnut/60">目前沒有待審核的商品</p>
      </div>
    </div>
  );
}
