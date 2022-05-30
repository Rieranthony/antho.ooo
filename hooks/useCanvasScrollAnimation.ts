import { useEffect, MutableRefObject } from "react";
import { useMediaQuery } from "./useWindowSize";

type UseCanvasScrollAnimationArgs = {
  divRef: MutableRefObject<HTMLDivElement>;
  onChangeFrameToIndex: (scrollFraction: number) => void;
};

export function useCanvasScrollAnimation({
  divRef,
  onChangeFrameToIndex
}: UseCanvasScrollAnimationArgs) {
  const isMobile = useMediaQuery(600);

  const listener = () => {
    if (isMobile) {
      return;
    }

    const html = document.documentElement;

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

    requestAnimationFrame(() => {
      onChangeFrameToIndex(scrollFraction);
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
