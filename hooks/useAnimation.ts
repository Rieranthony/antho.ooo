import { MutableRefObject, useEffect, useState } from "react";
import { useCanvasScrollAnimation } from "./useCanvasScrollAnimation";

import frameData from "./sequence.json";

type UseCanvasAnimationArgs = {
  divRef: MutableRefObject<HTMLDivElement>;
};

export function useAnimation({ divRef }: UseCanvasAnimationArgs) {
  /**
   * This draw the first frame
   */
  useEffect(() => {
    divRef.current.innerHTML = frameData[0];
  }, []);

  /**
   * Handles the animation on scroll
   */
  useCanvasScrollAnimation({
    divRef,
    onChangeFrameToIndex: (scrollFraction) => {
      const frameCount = frameData.length;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
      );

      divRef.current.innerHTML = frameData[frameIndex];
    }
  });
}
