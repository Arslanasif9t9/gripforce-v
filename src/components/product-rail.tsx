import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

/** Horizontal product rail: 1 row, left/right arrows, drag + keyboard, progress dots. */
export function ProductRail({ products, tone = "dark" }: { products: Product[]; tone?: "dark" | "light" }) {
  return (
    <div className="gf-rail relative" data-tone={tone}>
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={{
          480: { slidesPerView: 2.15 },
          768: { slidesPerView: 3.15 },
          1024: { slidesPerView: 4 },
        }}
        navigation
        keyboard={{ enabled: true }}
        grabCursor
        className="!py-2"
      >
        {products.map((p) => (
          <SwiperSlide key={p.slug} className="h-auto">
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
