"use client";

import { wordImage } from "@/lib/word-images";
import { cn } from "@/lib/utils";

/**
 * The picture for a word. When we have an illustration it is shown; otherwise we
 * fall back to the emoji the content already carries, so nothing ever breaks.
 *
 * Illustrations come from OpenMoji (CC BY-SA 4.0), stored in /public/words.
 */
export function WordImage({
  word,
  emoji,
  size = 64,
  className,
}: {
  word?: string | null;
  emoji?: string;
  size?: number;
  className?: string;
}) {
  const src = wordImage(word);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={word ?? ""}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={cn("select-none object-contain", className)}
        style={{ width: size, height: size }}
        draggable={false}
      />
    );
  }

  if (!emoji) return null;
  return (
    <span className={cn("select-none leading-none", className)} style={{ fontSize: size * 0.95 }} aria-hidden>
      {emoji}
    </span>
  );
}
