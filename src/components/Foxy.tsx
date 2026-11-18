type Mood = "happy" | "cheer" | "oops" | "think";

/**
 * فاکسی — the mascot. Pure SVG: no image asset to license, scales crisply,
 * and its mood is driven by the learner's performance.
 */
export function Foxy({ size = 96, mood = "happy", className }: { size?: number; mood?: Mood; className?: string }) {
  const earBack = "#D95F04";
  const fur = "#F97316";
  const furLight = "#FDBA74";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="فاکسی"
    >
      {/* ears */}
      <path d="M24 46 L17 12 L49 30 Z" fill={earBack} />
      <path d="M26 40 L23 21 L42 31 Z" fill={furLight} />
      <path d="M96 46 L103 12 L71 30 Z" fill={earBack} />
      <path d="M94 40 L97 21 L78 31 Z" fill={furLight} />

      {/* head */}
      <path
        d="M60 24 C87 24 101 42 101 66 C101 93 82 109 60 109 C38 109 19 93 19 66 C19 42 33 24 60 24 Z"
        fill={fur}
      />
      {/* forehead blaze */}
      <path d="M60 24 C68 34 68 44 60 52 C52 44 52 34 60 24 Z" fill={furLight} opacity="0.7" />

      {/* muzzle */}
      <ellipse cx="60" cy="84" rx="27" ry="21" fill="#FFF8F0" />

      {/* eyes */}
      {mood === "cheer" ? (
        <>
          <path d="M38 66 q8 -9 16 0" stroke="#3F1D0B" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M66 66 q8 -9 16 0" stroke="#3F1D0B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "oops" ? (
        <>
          <path d="M38 60 l16 10" stroke="#3F1D0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M82 60 l-16 10" stroke="#3F1D0B" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="45" cy="64" r="6.5" fill="#3F1D0B" />
          <circle cx="75" cy="64" r="6.5" fill="#3F1D0B" />
          <circle cx="47" cy="62" r="2.2" fill="#FFF8F0" />
          <circle cx="77" cy="62" r="2.2" fill="#FFF8F0" />
        </>
      )}

      {/* nose + mouth */}
      <ellipse cx="60" cy="76" rx="6.5" ry="5" fill="#3F1D0B" />
      {mood === "oops" ? (
        <path d="M52 90 q8 -6 16 0" stroke="#3F1D0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M60 81 v5 M60 86 q-7 6 -12 0 M60 86 q7 6 12 0" stroke="#3F1D0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {/* cheeks */}
      <ellipse cx="32" cy="80" rx="7" ry="4.5" fill="#FB7185" opacity="0.55" />
      <ellipse cx="88" cy="80" rx="7" ry="4.5" fill="#FB7185" opacity="0.55" />

      {mood === "think" && (
        <g fill="#FBBF24">
          <circle cx="104" cy="34" r="4" />
          <circle cx="112" cy="24" r="2.5" />
          <circle cx="96" cy="42" r="2" />
        </g>
      )}
    </svg>
  );
}
