import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { SetFrameFn } from "./useCanvasAnimationState";

function preLoadImg(url: string) {
  const img = document.createElement("img") as HTMLImageElement;
  img.src = url;
  return img;
}

type LoadSequenceFramesArgs = {
  getFramePath: (frame: number) => string;
  fromFrame: number;
  toFrame: number;
  setFrame: SetFrameFn;
  load: boolean;
  onSequenceLoaded: () => void;
};

/**
 * Note we don't use promises here
 * Promise.all would block the rendering of the animation until every single frame is loaded
 */

export function useLoadSequenceFrames({
  getFramePath,
  fromFrame,
  toFrame,
  setFrame,
  load,
  onSequenceLoaded
}: LoadSequenceFramesArgs) {
  const asyncLoadSequences = useCallback(async () => {
    const promises = Array.from(
      { length: toFrame - fromFrame },
      (_, index) => fromFrame + index + 1
    );

    promises.map((currentFrame) => {
      const promise = new Promise<void>(function (resolve) {
        const img = preLoadImg(getFramePath(currentFrame));

        img.onload = function () {
          setFrame(currentFrame, img);
          resolve();
        };
      });

      return promise;
    });

    await Promise.all(promises);

    onSequenceLoaded();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!load) {
      return;
    }

    // Doesn't need to be awaited
    asyncLoadSequences();
  }, [load, asyncLoadSequences]);
}

export function useLoadAndDrawInitialFrame({
  canvasRef,
  getFramePath,
  frame,
  setFrame
}: {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  frame: number;
  getFramePath: (frame: number) => string;
  setFrame: SetFrameFn;
}) {
  const [initialFrameDrew, setInitialFrameDrew] = useState<boolean>(false);

  useEffect(() => {
    const img = preLoadImg(getFramePath(frame));

    img.addEventListener("load", () => {
      const context = canvasRef.current.getContext("2d");

      // Draw frame on canvas
      context?.drawImage(img, 0, 0);

      // Mark first frame as drew, this will start the loading of the other frames
      setInitialFrameDrew(true);

      setFrame(frame, img);
    });
  }, [frame, canvasRef, getFramePath, setFrame]);

  return initialFrameDrew;
}

export function useLoadFrames() {}
