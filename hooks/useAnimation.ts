import { MutableRefObject, useEffect } from "react";
import { useCanvasScrollAnimation } from "./useCanvasScrollAnimation";

import sequenceData from "./sequence.json";

type UseCanvasAnimationArgs = {
  divRef: MutableRefObject<HTMLDivElement>;
};

export function useAnimation({ divRef }: UseCanvasAnimationArgs) {
  /**
   * This draw the first frame
   */
  useEffect(() => {
    divRef.current.innerHTML = sequenceData[0];
  }, []);

  /**
   * Handles the animation on scroll
   */
  useCanvasScrollAnimation({ divRef, sequenceData });
}
