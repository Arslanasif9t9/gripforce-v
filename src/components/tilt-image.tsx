import { useRef, useState, type ReactNode } from "react";

/**
 * Perspective tilt: the image rotates toward the cursor with a moving glare,
 * so a flat product photo feels like a 3D object turning from every angle.
 * Disabled on touch devices (no hover cursor there).
 */
export function TiltImage({
  src,
  alt,
  className = "",
  maxDeg = 10,
}: {
  src: string;
  alt: string;
  className?: string;
  maxDeg?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * maxDeg * 2,
      ry: (px - 0.5) * maxDeg * 2,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };

  const onLeave = () => setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));

  return (
    <div ref={frame} className={`tilt-frame ${className}`} style={{ perspective: "1100px" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        className="size-full transition-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.03 : 1})`,
          transitionDuration: tilt.active ? "60ms" : "450ms",
          willChange: "transform",
        }}
      >
        {src ? <img src={src} alt={alt} className="size-full object-cover" /> : null}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: tilt.active
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(163,255,18,0.16), transparent 45%)`
              : "none",
            transition: "opacity 300ms",
          }}
        />
      </div>
    </div>
  );
}

/** Generic perspective wrapper for custom children (e.g. bundle collage). */
export function TiltBox({ children, className = "", maxDeg = 8 }: { children: ReactNode; className?: string; maxDeg?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * maxDeg * 2, ry: (px - 0.5) * maxDeg * 2, gx: px * 100, gy: py * 100, active: true });
  };

  const onLeave = () => setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));

  return (
    <div className={`tilt-frame ${className}`} style={{ perspective: "1100px" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        className="relative size-full transition-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.02 : 1})`,
          transitionDuration: tilt.active ? "60ms" : "450ms",
          willChange: "transform",
        }}
      >
        {children}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: tilt.active
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(163,255,18,0.14), transparent 50%)`
              : "none",
          }}
        />
      </div>
    </div>
  );
}
