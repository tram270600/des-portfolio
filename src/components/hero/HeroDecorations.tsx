import type { CSSProperties } from "react";

// `--u` is one Figma pixel. The decorations span 1527×787 Figma px and must
// keep a 4rem gutter from the viewport edges while fitting its height; capping
// `--u` keeps them hugging the content on very wide screens.
const rootStyle = {
  "--u": "clamp(0.6px, min((100vw - 8rem) / 1527, 100svh / 787), 1.25px)",
} as CSSProperties;

const u = (px: number) => `calc(${px} * var(--u))`;

export function HeroDecorations() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none xl:block"
      style={{ ...rootStyle, width: u(1527), height: u(787) }}
      aria-hidden
    >
      <div
        className="absolute flex aspect-square items-center justify-center"
        style={{ top: u(229.7), right: u(18.33), width: u(319.03) }}
      >
        <img
          src="/images/hero-cassette.png"
          alt=""
          className="aspect-square w-[77.845%] rotate-[20.28deg] object-cover"
        />
      </div>

      <div
        className="absolute flex aspect-[297.53/308.82] items-center justify-center"
        style={{ top: u(151), left: u(29), width: u(297.53) }}
      >
        <div className="relative aspect-[254/268] w-[85.37%] -rotate-[10.22deg] overflow-hidden">
          <img
            src="/images/hero-walkman.png"
            alt=""
            className="absolute top-[-8.21%] left-[-11.42%] h-[116.42%] w-[122.83%] max-w-none"
          />
        </div>
      </div>

      <div
        className="absolute flex aspect-square items-center justify-center"
        style={{ top: u(350), left: 0, width: u(403.78) }}
      >
        <img
          src="/images/hero-computer.png"
          alt=""
          className="aspect-square w-[88.166%] -rotate-[8.32deg] object-cover opacity-60"
        />
      </div>

      <img
        src="/images/hero-famicom.png"
        alt=""
        className="absolute aspect-[397/297] object-cover"
        style={{ top: u(426), right: 0, width: u(397) }}
      />
    </div>
  );
}
