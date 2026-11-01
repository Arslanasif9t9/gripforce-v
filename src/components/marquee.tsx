const WORDS = ["Train Hard", "Grip Strong", "Premium Quality", "Build Your Grip", "Own Your Strength"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="marquee overflow-hidden border-y border-primary/30 bg-surface py-3" aria-hidden>
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {row.map((w, i) => (
              <span key={`${copy}-${i}`} className="flex items-center font-display text-xl uppercase tracking-[0.2em]">
                <span className="px-6">{w}</span>
                <span className="text-primary">⚡</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
