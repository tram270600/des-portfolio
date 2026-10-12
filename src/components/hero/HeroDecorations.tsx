import type { CSSProperties } from "react";

import { ComputerScreen } from "@/components/hero/ComputerScreen";
import { HeroFloat } from "@/components/hero/HeroFloat";
import { HeroSectionLabel } from "@/components/hero/HeroSectionLabel";

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
    >
      <HeroFloat
        className="absolute aspect-square"
        innerClassName="flex items-center justify-center"
        style={{ top: u(229.7), right: u(18.33), width: u(319.03) }}
        duration="9.2s"
        delay="-1.4s"
        reveal={false}
        x="11px"
        y="-14px"
        rotate="1.4deg"
        swing="8deg"
        caption={
          <HeroSectionLabel
            index="3"
            label="About"
            href="#about"
            className="pointer-events-auto absolute bottom-full left-1/2 top-[5%] z-10 mb-1 -translate-x-1/2"
          />
        }
      >
        <a
          href="#about"
          aria-label="03. About"
          className="pointer-events-auto block w-[77.845%] rotate-[20.28deg] cursor-pointer"
        >
          <img
            src="/images/hero-cassette.png"
            alt=""
            className="aspect-square w-full object-cover"
          />
        </a>
      </HeroFloat>

      <HeroFloat
        className="absolute aspect-[297.53/308.82]"
        innerClassName="flex items-center justify-center"
        style={{ top: u(151), left: u(29), width: u(297.53) }}
        duration="8.1s"
        delay="-3.2s"
        reveal={false}
        x="-12px"
        y="-10px"
        rotate="-1.6deg"
        swing="7deg"
        caption={
          <HeroSectionLabel
            index="2"
            label="Experience"
            href="#experience"
            className="pointer-events-auto absolute bottom-full left-[6%] z-10 mb-6"
          />
        }
      >
        <a
          href="#experience"
          aria-label="02. Experience"
          className="pointer-events-auto relative block aspect-[254/268] w-[85.37%] -rotate-[10.22deg] cursor-pointer overflow-hidden"
        >
          <img
            src="/images/hero-walkman.png"
            alt=""
            className="absolute top-[-8.21%] left-[-11.42%] h-[116.42%] w-[122.83%] max-w-none"
          />
        </a>
      </HeroFloat>

      <HeroFloat
        className="absolute aspect-square"
        innerClassName="flex items-center justify-center"
        style={{ top: u(350), left: 0, width: u(403.78) }}
        duration="10.4s"
        delay="-0.7s"
        reveal={false}
        x="9px"
        y="-16px"
        rotate="1deg"
        swing="6deg"
        caption={
          <HeroSectionLabel
            index="1"
            label="Works"
            href="#works"
            className="pointer-events-auto absolute top-[90%] left-[70%] z-10"
          />
        }
      >
        <a
          href="#works"
          aria-label="01. Works"
          className="pointer-events-auto relative block w-[88.166%] -rotate-[8.32deg] cursor-pointer"
        >
          <img
            src="/images/hero-computer.png"
            alt=""
            className="aspect-square w-full object-cover opacity-60"
          />
          <ComputerScreen />
        </a>
      </HeroFloat>

      <HeroFloat
        className="absolute aspect-[397/297]"
        style={{ top: u(426), right: 0, width: u(397) }}
        duration="7.6s"
        delay="-4.4s"
        reveal={false}
        x="-10px"
        y="-12px"
        rotate="1.8deg"
        swing="9deg"
        caption={
          <HeroSectionLabel
            index="4"
            label="Playground"
            href="#playground"
            className="pointer-events-auto absolute top-full left-1/2 z-10 mt-1 -translate-x-1/2"
          />
        }
      >
        <a
          href="#playground"
          aria-label="04. Playground"
          className="pointer-events-auto block size-full cursor-pointer"
        >
          <img
            src="/images/hero-famicom.png"
            alt=""
            className="size-full object-cover"
          />
        </a>
      </HeroFloat>

    </div>
  );
}
