export default function WishlistPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">收藏清單</h2>
      <p className="mt-2 text-sm text-walnut/70">您收藏的歐洲古董家具</p>

      <div className="mt-8 border border-dashed border-linen p-12 text-center">
        <p className="text-walnut/60">收藏清單為空</p>
        <p className="mt-2 text-sm text-walnut/40">瀏覽商品時點擊愛心圖示即可加入收藏</p>
      </div>
    </div>
  );
}
