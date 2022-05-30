import { useEffect, MutableRefObject } from "react";

type UseCanvasScrollAnimationArgs = {
  divRef: MutableRefObject<HTMLDivElement>;
  sequenceData: string[];
};

export function useCanvasScrollAnimation({
  divRef,
  sequenceData
}: UseCanvasScrollAnimationArgs) {
  const listener = () => {
    const html = document.documentElement;
    const frameCount = sequenceData.length;
    const initialFrameNumber = 1;

    const { top, height } = divRef.current.getBoundingClientRect();

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
      divRef.current.innerHTML = sequenceData[frameIndex];
    });
  };

  useEffect(() => {
    if (window.screen.width > 600) {
      window.addEventListener("scroll", listener);
    }

    return () => {
      window.removeEventListener("scroll", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
