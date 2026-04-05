"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-linen flex items-center justify-center">
        <span className="font-serif text-2xl text-walnut/30">MOBEL</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const goPrev = () =>
    setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const goNext = () =>
    setActiveIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-linen group">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productTitle}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="上一張"
            >
              <ChevronLeft className="h-5 w-5 text-charcoal" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="下一張"
            >
              <ChevronRight className="h-5 w-5 text-charcoal" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-charcoal/70 px-2.5 py-1 text-xs text-cream">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden bg-linen transition-all",
                index === activeIndex
                  ? "ring-2 ring-brass"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productTitle} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
