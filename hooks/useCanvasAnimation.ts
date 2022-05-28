import { MutableRefObject, useEffect, useState } from "react";
import { useCanvasAnimationState } from "./useCanvasAnimationState";
import { useCanvasScrollAnimation } from "./useCanvasScrollAnimation";
import {
  useLoadAndDrawInitialFrame,
  useLoadSequenceFrames
} from "./usePreloadFrames";

type UseCanvasAnimationArgs = {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  baseUrl: string;
  baseFileName: string;
  initialFrameNumber: number;
  frameCount: number;
  /**
   * If false the first frame only will be displayed
   */
  animate?: boolean;
  /**
   * This define is which order the loading of the sequences is being done
   * The lower is this number a higher is the priority
   */
  priority: number;
  align?: "left" | "right";
};

/**
 * This hooks assumes many things
 * 1 - Your files are in JPG format
 * 2 - Your files structure is:
 *      "/baseUrl/{"sm" || "lg"}/{baseFileName}_{frameNumber}.jpg"
 */

export function useCanvasAnimation({
  canvasRef,
  baseUrl,
  baseFileName,
  initialFrameNumber,
  frameCount,
  animate = true
}: UseCanvasAnimationArgs) {
  const [animationReady, setAnimationReady] = useState<boolean>(false);
  const [frameMap, setFrame] = useCanvasAnimationState();

  const getFramePath = (frame: number) => {
    return `${baseUrl}/${baseFileName}${frame}.jpg`;
  };

  const initialFrame = initialFrameNumber;

  /**
   * This load and draw the first frame ASAP
   */
  const initialFrameDrew = useLoadAndDrawInitialFrame({
    canvasRef,
    setFrame,
    frame: initialFrame,
    getFramePath
  });

  /**
   * This loads the other frames of the sequence
   */
  useLoadSequenceFrames({
    setFrame,
    getFramePath,
    fromFrame: initialFrameNumber,
    toFrame: initialFrameNumber + frameCount,
    // This allows us to load the sequence in the right order
    load: animate,
    // Once loaded the priority number increases and the other sequences can load
    onSequenceLoaded: () => {
      setAnimationReady(true);
    }
  });

  /**
   * Handles the animation on scroll
   */
  useCanvasScrollAnimation(
    {
      initialFrameNumber,
      frameCount,
      frameMap,
      canvasRef
    },
    animate && animationReady
  );

  return {
    initialFrameDrew,
    animationReady
  };
}
