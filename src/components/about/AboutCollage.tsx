import { cn } from "@/lib/utils"

type Note = {
  text: string
  place?: "above" | "below"
  /** Horizontal centre of the label as a % of the figure, to steer it clear of the hanging hat. */
  x?: number
  /** Fixed width in em, so a long label wraps onto two lines instead of overlapping its neighbours. */
  width?: number
}

type HitBox = {
  left: number
  top: number
  width: number
  height: number
}

type CollageItem = {
  src: string
  left: number
  top: number
  width: number
  className?: string
  shadow?: boolean
  layer?: number
  hit?: HitBox
  note?: Note
}

const items: CollageItem[] = [
  {
    src: "polaroid.png",
    left: 24.4,
    top: 23.4,
    width: 14.6,
    note: { text: "little me", x: 30 },
  },
  { src: "passport-stamps.png", left: 37.6, top: 25.6, width: 5.8 },
  {
    src: "hcmc-stamp.png",
    left: 40.5,
    top: 26.4,
    width: 14.2,
    note: { text: "live in Ho Chi Minh city, Viet Nam", x: 50, width: 8 },
  },
  { src: "flag.png", left: 50.6, top: 29, width: 4.6, layer: 40 },
  {
    src: "passport.png",
    left: 46.9,
    top: 15.1,
    width: 26.8,
    note: { text: "love travelling", x: 75 },
  },
  {
    src: "photo-strip.png",
    left: 51.9,
    top: 13.8,
    width: 38.8,
    layer: 15,
    hit: { left: 0.4, top: 0.09, width: 0.36, height: 0.73 },
  },
  { src: "receipt.png", left: 23.3, top: 44.8, width: 8.7 },
  { src: "star.png", left: 37.4, top: 46.2, width: 5.7 },
  { src: "cassette.png", left: 33.8, top: 38.7, width: 32.9 },
  {
    src: "camera.png",
    left: 27.8,
    top: 63.4,
    width: 16.2,
    note: { text: "y2k era" },
  },
  {
    src: "miffy.png",
    left: 50.6,
    top: 53.2,
    width: 12.4,
    note: { text: "fav animal" },
  },
  { src: "earphones.png", left: 59.4, top: 42.4, width: 33.4 },
  { src: "non-la.png", left: 38, top: -2.1, width: 23.5, shadow: false },
]

const imageSize: Record<string, [number, number]> = {
  "polaroid.png": [334, 412],
  "hcmc-stamp.png": [219, 291],
  "passport.png": [425, 425],
  "camera.png": [274, 218],
  "miffy.png": [210, 274],
}

const figureHeightRatio = 574 / 377

const board = { left: 19.3, top: 19.9, width: 61.5 }
const boardTop = board.top / 100
const boardBottom = boardTop + (board.width / 100) * (651 / 990) * figureHeightRatio
const noteGap = 0.015

function notePlacement(item: CollageItem) {
  const [imgW, imgH] = imageSize[item.src]
  const height = (item.width / 100) * (imgH / imgW) * figureHeightRatio
  const top = item.top / 100
  const above = (item.note?.place ?? (top + height / 2 < 0.5 ? "above" : "below")) === "above"
  const center = item.note?.x ?? item.left + item.width / 2
  const left = `${((center - item.left) / item.width) * 100}%`
  const width = item.note?.width ? `${item.note.width}em` : undefined

  if (above) {
    const bottom = ((top + height - (boardTop - noteGap)) / height) * 100
    return { left, width, transform: "translateX(-50%)", bottom: `${bottom}%` }
  }
  const noteTop = ((boardBottom + noteGap - top) / height) * 100
  return { left, width, transform: "translateX(-50%)", top: `${noteTop}%` }
}

const jump =
  "origin-center cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none group-hover:-translate-y-[10%] group-hover:-rotate-[5deg] group-focus-within:-translate-y-[10%] group-focus-within:-rotate-[5deg]"

export function AboutCollage({ className }: { className?: string }) {
  return (
    <div className={className}>
      <figure
        className="relative aspect-[574/377] w-full select-none"
        aria-label="Corkboard collage with childhood photos, a Vietnamese passport, a nón lá hat, a cassette labeled Life Goes On, a camera, and a stuffed rabbit — a visual portrait of Tram Nguyen."
      >
        <img
          src="/images/about/checker.webp"
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-fill opacity-70"
          draggable={false}
        />
        <span className="pointer-events-none absolute bottom-[100.5%] left-[49.7%] h-16 w-px bg-foreground/70 md:h-24" aria-hidden />
        <img
          src="/images/about/corkboard.jpg"
          alt=""
          className="pointer-events-none absolute shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
          style={{ left: `${board.left}%`, top: `${board.top}%`, width: `${board.width}%` }}
          draggable={false}
        />
        {items.map((item) => (
          <div
            key={item.src}
            className={cn("group absolute hover:z-30 focus-within:z-30", item.hit && "pointer-events-none")}
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: `${item.width}%`,
              zIndex: item.layer,
            }}
            tabIndex={item.note ? 0 : undefined}
            aria-label={item.note?.text}
          >
            <img
              src={`/images/about/${item.src}`}
              alt=""
              className={cn(
                "h-auto w-full",
                item.shadow !== false && "drop-shadow-[0_3px_4px_rgba(0,0,0,0.18)]",
                item.className,
                jump,
              )}
              draggable={false}
            />
            {item.hit ? (
              <span
                className="pointer-events-auto absolute cursor-pointer"
                style={{
                  left: `${item.hit.left * 100}%`,
                  top: `${item.hit.top * 100}%`,
                  width: `${item.hit.width * 100}%`,
                  height: `${item.hit.height * 100}%`,
                }}
              />
            ) : null}
            {item.note ? (
              <span
                className="pointer-events-none absolute z-40 w-max text-center font-script text-base leading-tight text-primary opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 md:text-xl"
                style={notePlacement(item)}
              >
                {item.note.text}
              </span>
            ) : null}
          </div>
        ))}
      </figure>
      <p className="mt-16 text-center font-script text-2xl text-primary md:mt-20 md:text-[2rem]">
        Tram Nguyen, 2000, Viet Nam
      </p>
    </div>
  )
}
