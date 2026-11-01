# Grip Force — Homepage & Product Page Redesign (Phase 1, frontend focus)

## What changes
One big frontend upgrade: real product photos everywhere, a cursor-reactive 3D hero, heavy-but-clean motion design, Swiper product rails, a redesigned desktop layout, and a custom scrollbar. Mobile stays first-class (75% of your audience) and desktop gets equal attention.

## 1. Real catalog — 16 products with your photos
- Your ZIP holds 17 branded images = **16 unique products** (Ab Roller has 2 angles → its gallery gets both).
- Replace the ~90 placeholder products with exactly these 16; trim collections to the ones that actually have products:
  - **Hand & Grip**: Adjustable Hand Gripper, Finger Trainer
  - **Strength Training**: Weightlifting Belt, Wrist Wraps, Lifting Straps, Dumbbells, Kettlebell
  - **Gym Gloves**: Gym Gloves
  - **Home Workout**: Push-Up Bars, Ab Roller, Speed Jump Rope, Exercise Mat
  - **Resistance Bands**: Resistance Bands Set
  - **Bags**: Gym Duffel Bag
  - **Hydration**: Insulated Water Bottle, Protein Shaker
  - **Recovery & Mobility**: Foam Roller
  - **Bundles**: Home Starter Kit (honest kit of Push-Up Bars + Bands + Jump Rope + Mat, image = collage of those real product cards; Yoga collection dropped — no products)
- Every image uploaded to CDN (lovable-assets, clean slugs like `weightlifting-belt.jpg`). Product descriptions written from the feature text printed on your own cards — nothing invented, no fake reviews/countdowns.

## 2. Homepage — sections (fewer but each one hits)
1. **Hero (3D, cursor-reactive)** — no static photo. Left: bold headline, tagline, CTA buttons, trust line. Right: a real 3D scene (react-three-fiber) — a CC0 low-poly dumbbell/kettlebell model that tilts and turns as the cursor moves, floating neon ring + subtle particles, matte-black floor, neon rim light. On phones: smooth auto-rotate + gentle gyro/tilt response. Scroll-down indicator.
2. **Neon marquee strip** — "TRAIN HARD. GRIP STRONG." scrolling ticker, pauses on hover.
3. **Shop by Category** — 8 compact animated tiles (image zoom + neon border sweep on hover).
4. **Featured Products** — full-width **Swiper rail**, 1 row, left/right neon arrows + drag, autoplay off, progress dots.
5. **Home Workout Collection** — light-grey section, Swiper rail (visual contrast break).
6. **Gym Essentials** — Swiper rail, dark section.
7. **Starter Kit banner** — full-width bundle spotlight with collage + CTA.
8. **Why Grip Force** — 4 cards with scroll-reveal stagger.
9. **FAQ** — compact accordion (top 5).
10. **Newsletter** — one clean CTA band.
11. **Footer** — policy links, socials, and the credit line: **"Developed by Arslanasif9t9"** linking to www.linkedin.com/in/arslan9t9.
- Layout rhythm: alternating dark / light-grey bands, generous side padding (container with real left/right space on desktop — the current "no margin" issue is fixed).

## 3. Motion & effects (the "maza")
- **Scroll progress**: default browser scrollbar removed everywhere; a slim 3px neon-green progress bar at the top of the page + thin custom-styled scrollbar as fallback.
- **Scroll reveals**: sections and cards animate in (fade/slide/clip) with stagger, via framer-motion.
- **Sticky header**: transparent over hero, becomes blurred dark bar on scroll; mobile menu slides in.
- **Product cards**: hover lift + image zoom + neon glow edge + "Add" slides up on desktop; tap-friendly on mobile.
- **CTA buttons**: neon shimmer sweep + magnetic hover pull (subtle).
- **Product page — 3D hover**: the product image tilts in true perspective (rotateX/rotateY follows the cursor) with a moving glare/depth layer, so the product feels like it turns from every angle; pinch-zoom/fullscreen viewer on mobile; Ab Roller shows both angles as gallery thumbs. (Your photos are flat images, so this is perspective-tilt — the honest way to get the "3D move" feel; a real rotatable model needs photo turnaround shots later.)
- **Section headings**: split-line reveal animation.
- Background texture: subtle grain + radial neon glows, no flat emptiness.

## 4. Libraries
- `three`, `@react-three/fiber@^9`, `@react-three/drei@^10`, `@types/three` — 3D hero.
- `framer-motion` — reveals, header, buttons.
- `swiper` — all product rails, arrows + keyboard + touch.
- Hero 3D loads client-side only (dynamic import behind ClientOnly) with a static styled fallback, so SEO and first paint stay fast.

## 5. Performance & mobile
- CDN-hosted images, lazy loading, sized cards; 3D scene capped (low-poly model, clamped pixel ratio, pauses when off-screen) so phones stay smooth.
- Swiper = native touch swiping; mobile gets one-column rails, big tap targets; effects that need a cursor degrade gracefully (no jitter).
- 3D model fallback: if no good CC0 dumbbell/kettlebell is found, hand-built stylized 3D gym gear (still modeled, never a floating product photo).

## 6. Red-team pass (issues caught and handled)
- *3D hero heavy on phones* → low-poly GLB, dpr clamp, pause when hidden, auto-rotate instead of heavy interaction.
- *Tilt effect looking gimmicky* → small rotation angles + glare, disabled on touch.
- *Hiding scrollbar hurting usability* → top progress bar + custom slim scrollbar, never the default one.
- *Too many sections slowing the page* → cut from 8+ grids to 3 Swiper rails; fewer, stronger sections.
- *Bundle without a photo* → collage of real member products; clearly labeled as a kit.
- *Desktop felt cramped/empty* → fixed container side space, alternating bands, larger hero height.
- *Duplicate Ab Roller images* → used as its 2-image gallery.

## 7. What stays out of scope
Still Phase 1: no backend/admin/real checkout (Phase 2), prices stay placeholder USD until Shopify sync (Phase 3). Policy pages, search, cart keep working as they are.

## 8. Verify
- Playwright pass on desktop + mobile viewports: hero 3D renders and reacts, rails swipe, scrollbar never shows default style, footer credit visible.
- Build-error log clean; images all load (no 404s).
