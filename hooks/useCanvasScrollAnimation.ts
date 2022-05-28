import { useEffect, MutableRefObject } from "react";

import { FrameMap } from "./useCanvasAnimationState";

type UseCanvasScrollAnimationArgs = {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  frameCount: number;
  frameMap: FrameMap;
  initialFrameNumber: number;
};

function drawImageScaled(
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D | null
) {
  if (!ctx) return;

  var canvas = ctx.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width * hRatio, img.height * vRatio);
}

export function useCanvasScrollAnimation(
  {
    frameCount,
    canvasRef,
    frameMap,
    initialFrameNumber
  }: UseCanvasScrollAnimationArgs,
  animate: boolean
) {
  const listener = () => {
    const html = document.documentElement;

    const { top, height } = canvasRef.current.getBoundingClientRect();

    const topRelativeToDoc = top + window.scrollY;

    // How many pixel have been scrolled from the top
    const scrollTop = html.scrollTop;

    // From position in pixels the animation should start (AKA animation visible)
    const fromScroll = topRelativeToDoc - height;

    // To position in pixels the animation should stop
    const toScroll = fromScroll + window.innerHeight + height;

    // Animation out of boundaries, we are not animating anymore
    if (scrollTop <= fromScroll || scrollTop >= toScroll) {
      return;
    }

    /**
     * Doing this we interpolate a scroll position to a frame
     * The animation start and stop when the element enter / leave the window.
     * */
    const scrollFraction = scrollTop / toScroll;
    const frameIndex =
      Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount)) +
      initialFrameNumber -
      1;

    requestAnimationFrame(() => {
      const context = canvasRef.current.getContext("2d");

      const imgRef =
        frameMap.get(frameIndex + 1) || frameMap.get(initialFrameNumber);

      if (!imgRef) {
        return;
      }

      // Clear canvas before drawing on it
      context?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw frame on canvas
      drawImageScaled(imgRef, context);
    });
  };

  useEffect(() => {
    animate && window.addEventListener("scroll", listener);

    return () => {
      animate && window.removeEventListener("scroll", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);
}
