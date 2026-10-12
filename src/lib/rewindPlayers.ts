export const PLAYERS = [
  { name: "Apple iPod", year: "2001", label: "2001 – Apple iPod", file: "Apple iPod.png", aspect: 854 / 588 },
  { name: "Digital MP3 Players", year: "1998", label: "1998 – Digital MP3 Players", file: "Digital MP3 Players.png", aspect: 1 },
  { name: "Compact Disc", year: "1982", label: "1982 – The Compact Disc (CD)", file: "Compact Disc (CD).png", aspect: 405 / 270 },
  { name: "Compact Cassette", year: "1963", label: "1963 – The Compact Cassette", file: "Compact Cassette.png", aspect: 1302 / 780 },
  { name: "Gramophone", year: "1887", label: "1887 – The Gramophone", file: "Gramophone.png", aspect: 698 / 974 },
  { name: "Phonograph", year: "1877", label: "1877 – The Phonograph", file: "Phonograph.png", aspect: 838 / 956 },
] as const

export const ORBIT = Math.PI * 2

const cutouts = new Map<string, Promise<string>>()

export function playerSrc(file: string) {
  return `/images/services/speakerVersion/${encodeURIComponent(file)}`
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function smoothstep(value: number) {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export function revealAt(era: number, progress: number) {
  if (era === 0) return 1
  const span = PLAYERS.length - 1
  const start = (era - 1) / span
  const end = era / span
  return smoothstep((progress - start) / (end - start))
}

export function handAngles(progress: number, reduce: boolean) {
  const date = new Date()
  const seconds = date.getSeconds() + (reduce ? 0 : date.getMilliseconds() / 1000)
  const minutes = date.getMinutes() + seconds / 60
  const hours = (date.getHours() % 12) + minutes / 60
  return {
    second: seconds * 6 - progress * 720,
    minute: minutes * 6 - progress * 360,
    hour: hours * 30 - progress * 120,
  }
}

function isBackground(data: Uint8ClampedArray, offset: number) {
  const red = data[offset]
  const green = data[offset + 1]
  const blue = data[offset + 2]
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  return max < 30 && max - min < 16
}

function knockOutBackground(image: HTMLImageElement) {
  const scale = Math.min(1, 520 / image.naturalWidth)
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) return canvas

  context.drawImage(image, 0, 0, width, height)
  const frame = context.getImageData(0, 0, width, height)
  const data = frame.data
  const seen = new Uint8Array(width * height)
  const stack: number[] = []

  for (let x = 0; x < width; x += 1) stack.push(x, (height - 1) * width + x)
  for (let y = 0; y < height; y += 1) stack.push(y * width, y * width + width - 1)

  while (stack.length > 0) {
    const index = stack.pop()
    if (index === undefined || index < 0 || index >= width * height || seen[index]) continue
    if (!isBackground(data, index * 4)) continue
    seen[index] = 1
    data[index * 4 + 3] = 0
    const x = index % width
    if (x > 0) stack.push(index - 1)
    if (x < width - 1) stack.push(index + 1)
    if (index >= width) stack.push(index - width)
    if (index < width * (height - 1)) stack.push(index + width)
  }

  const alpha = new Uint8Array(width * height)
  for (let index = 0; index < alpha.length; index += 1) alpha[index] = data[index * 4 + 3]

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x
      if (alpha[index] === 0) continue
      const edge =
        alpha[index - 1] === 0 ||
        alpha[index + 1] === 0 ||
        alpha[index - width] === 0 ||
        alpha[index + width] === 0
      if (!edge) continue
      const offset = index * 4
      const max = Math.max(data[offset], data[offset + 1], data[offset + 2])
      const min = Math.min(data[offset], data[offset + 1], data[offset + 2])
      if (max < 90 && max - min < 30) data[offset + 3] = Math.round((max / 90) * data[offset + 3])
    }
  }

  context.putImageData(frame, 0, 0)
  return canvas
}

export function loadCutout(src: string) {
  const cached = cutouts.get(src)
  if (cached) return cached

  const pending = new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = knockOutBackground(image)
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("cutout"))
          return
        }
        resolve(URL.createObjectURL(blob))
      })
    }
    image.onerror = () => reject(new Error("image"))
    image.src = src
  })
  cutouts.set(src, pending)
  return pending
}

export function wrapAngle(delta: number) {
  if (delta > Math.PI) return delta - Math.PI * 2
  if (delta < -Math.PI) return delta + Math.PI * 2
  return delta
}
