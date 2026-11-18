"use client";

import { mixedRuns } from "@/lib/utils";

/**
 * Renders Persian copy that contains English words.
 *
 * The bidi algorithm re-orders Latin runs inside an RTL paragraph, which is what
 * made lines like «a مثل cat، e مثل bed» look scrambled. Every Latin run is
 * isolated in a <bdi> so its own direction stays intact and the Persian flow is
 * untouched.
 */
export function BiText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {mixedRuns(text).map((run, index) =>
        run.latin ? (
          <bdi key={index} dir="ltr" className="en">
            {run.text}
          </bdi>
        ) : (
          <span key={index}>{run.text}</span>
        ),
      )}
    </span>
  );
}
