import { useState } from 'react'

export type FrameMap = Map<number, HTMLImageElement>
export type SetFrameFn = (k: number, imgEl: HTMLImageElement) => void
export type UseCanvasAnimationStateOutput = [FrameMap, SetFrameFn]

export function useCanvasAnimationState(): UseCanvasAnimationStateOutput {
  const [frameMap, setFrameMap] = useState<FrameMap>(new Map())

  // We keep the same ref to the map, so react does not re-render
  const _setFrameMap = (k: number, imgEl: HTMLImageElement) =>
    setFrameMap((currentMap) => currentMap.set(k, imgEl))

  return [frameMap, _setFrameMap]
}
