import { motion } from "motion/react"

import type { ServiceDocument } from "@/data/services"
import { FOLDER_COVER_H, FOLDER_FILE_H } from "@/components/services/folderLayout"
import { cn } from "@/lib/utils"

const PAPER = "#f4f1ea"
const INK = "#1a1a1a"
const TAB_H = 28

const flyEase = [0.22, 1, 0.36, 1] as const

type Pose = { x: number; y: number; rotate: number }

function FolderTab({
  title,
  align,
  active,
  compact,
}: {
  title: string
  align: "left" | "right"
  active: boolean
  compact: boolean
}) {
  const fill = active ? INK : PAPER

  const label = (
    <div
      className={cn(
        "flex h-[28px] items-center border-t border-[#1a1a1a]",
        align === "left" ? "rounded-tl-[2px] border-l pr-1 pl-3" : "rounded-tr-[2px] border-r pr-3 pl-1",
        compact ? "text-[10px] tracking-[0.07em]" : "text-[11px] tracking-[0.11em]",
      )}
      style={{ background: fill, color: active ? PAPER : INK }}
    >
      <h3 className="font-medium whitespace-nowrap uppercase leading-none">{title}</h3>
    </div>
  )

  const slant = (
    <svg
      width="12"
      height={TAB_H}
      viewBox="0 0 12 28"
      aria-hidden
      className={cn("block shrink-0", align === "left" ? "-ml-px" : "-mr-px")}
    >
      <path d={align === "left" ? "M0 0 L12 28 L0 28 Z" : "M12 0 L0 28 L12 28 Z"} fill={fill} />
      <path
        d={align === "left" ? "M0.4 0.5 L11.2 27.5" : "M11.6 0.5 L0.8 27.5"}
        fill="none"
        stroke={INK}
        strokeWidth="1.25"
      />
    </svg>
  )

  return (
    <div
      className={cn(
        "absolute top-0 z-[2] flex h-[28px] max-w-[92%]",
        align === "left" ? "left-[6%]" : "right-[6%]",
      )}
    >
      {align === "left" ? (
        <>
          {label}
          {slant}
        </>
      ) : (
        <>
          {slant}
          {label}
        </>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px z-[3] h-[3px]"
        style={{ background: fill }}
      />
    </div>
  )
}

export function FolderFile({
  paper,
  stackIndex,
  pose,
  hidden,
  aligned,
  active,
  reduceMotion,
  tabAlign,
  onEngage,
  onHover,
  cardRef,
}: {
  paper: ServiceDocument
  stackIndex: number
  pose: Pose
  hidden: boolean
  aligned: boolean
  active: boolean
  reduceMotion: boolean
  tabAlign: "left" | "right"
  onEngage: () => void
  onHover: (index: number) => void
  cardRef: (node: HTMLElement | null) => void
}) {
  return (
    <motion.article
      ref={cardRef}
      data-paper={stackIndex}
      initial={false}
      animate={{
        x: aligned ? 0 : pose.x,
        y: aligned ? 0 : pose.y,
        rotate: aligned ? 0 : pose.rotate,
        opacity: hidden ? 0 : 1,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : aligned
            ? { duration: 0.5, ease: flyEase }
            : hidden
              ? { duration: 0 }
              : { duration: 0.65, ease: flyEase }
      }
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return
        onEngage()
        onHover(stackIndex)
      }}
      style={{
        position: aligned ? "relative" : "absolute",
        left: 0,
        bottom: aligned ? undefined : 0,
        width: "100%",
        height: aligned ? undefined : FOLDER_FILE_H,
        zIndex: stackIndex + 1,
        transformOrigin: "50% 100%",
      }}
      className={cn("text-left", aligned && "mb-4")}
    >
      <FolderTab title={paper.title} align={tabAlign} active={active} compact={!aligned} />
      <div
        className={cn(
          "border border-[#1a1a1a] bg-[#f4f1ea]",
          aligned ? "mt-[27px] rounded-[2px] px-5 pt-4 pb-5" : "absolute inset-x-0 top-[27px] bottom-0",
        )}
      >
        {aligned ? (
          <>
            <p className="text-[11px] leading-none tracking-[0.16em] text-[#1a1a1a]">{paper.index}</p>
            <p className="mt-3 text-[14px] leading-[1.55] text-[#1a1a1a]">{paper.description}</p>
          </>
        ) : (
          <p className="sr-only">
            {paper.index}. {paper.description}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export function FolderCover({
  label,
  count,
  peeked,
  risen,
  reduceMotion,
}: {
  label: string
  count: number
  peeked: boolean
  risen: boolean
  reduceMotion: boolean
}) {
  const files = String(count).padStart(2, "0")

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{
        y: !peeked ? FOLDER_COVER_H : risen ? 0 : FOLDER_COVER_H - 36,
        opacity: peeked ? 1 : 0,
      }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: flyEase }}
      className="absolute bottom-0 left-0 z-[8] w-full"
      style={{ height: FOLDER_COVER_H }}
    >
      <div className="flex h-full items-center justify-center rounded-[2px] border border-[#1a1a1a] bg-[#f4f1ea]">
        <p className="text-[11px] font-medium tracking-[0.2em] text-[#1a1a1a] uppercase">
          {label} / {files} Files
        </p>
      </div>
    </motion.div>
  )
}
