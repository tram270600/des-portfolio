/** Collapsed file: tab plus a thin folder edge. */
export const FOLDER_FILE_H = 40
export const FOLDER_STEP = 34
/** How far the front file tucks behind the sleeve. */
export const FOLDER_TUCK = 5
export const FOLDER_COVER_H = 112

export function folderStackY(index: number, count: number) {
  const fromFront = count - 1 - index
  return -(FOLDER_COVER_H - FOLDER_TUCK) - fromFront * FOLDER_STEP
}
