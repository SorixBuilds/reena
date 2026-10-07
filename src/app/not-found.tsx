"use client";

import { useState } from "react";
import ReenaWave from "@/components/ReenaWave";
import { Btn } from "@/components/UI";
import { IconArrow } from "@/components/Icons";

export default function NotFound() {
  const [alive, setAlive] = useState(false);

  return (
    <section className="relative flex min-h-[86svh] items-center overflow-hidden bg-night pt-[84px]">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        onMouseEnter={() => setAlive(true)}
        onMouseLeave={() => setAlive(false)}
      >
        <ReenaWave
          key={String(alive)}
          mode={alive ? "calm" : "flat"}
          height={180}
          amplitude={30}
          cycles={2.4}
          strokeWidth={2}
          opacity={alive ? 0.7 : 0.35}
        />
      </div>

      <div className="shell relative">
        <div
          className="max-w-[560px]"
          onPointerEnter={() => setAlive(true)}
          onPointerLeave={() => setAlive(false)}
          onClick={() => setAlive((a) => !a)}
        >
          <div className="mono-label text-steel">ERROR 404</div>
          <h1 className="h-display mt-4 text-ice">Power cut.</h1>
          <p className="body-lg mt-5 max-w-[34ch] text-steel">
            This page isn&rsquo;t here. Let&rsquo;s get you back.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Btn href="/" tone="red">
              Back to home
              <IconArrow width={17} height={17} className="transition-transform group-hover:translate-x-1" />
            </Btn>
            <Btn href="/products/" tone="glass">
              See products
            </Btn>
          </div>
          <p className="mono-label mt-10 text-[9.5px] text-steel/50">
            Tap the line to bring the power back
          </p>
        </div>
      </div>
    </section>
  );
}
