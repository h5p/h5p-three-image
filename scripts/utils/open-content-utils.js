// @ts-check

/**
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} is3DScene
 * @param {boolean} isHorizontalDrag
 * @param {DOMRect} elementRect
 * @param {number} startMousePos
 * @param {number} startMidPoint
 * @returns {number}
 */
export const scaleOpenContentElement = (
  clientX,
  clientY,
  is3DScene,
  isHorizontalDrag,
  elementRect,
  startMousePos,
  startMidPoint
) => {
  if (!elementRect) {
    return;
  }
  /** @type {number} */
  let newSize;

  if (is3DScene) {
    // We record the currentMouseposition for everytime the mouse moves
    const currentMousePosition = isHorizontalDrag ? clientX : clientY;

    /* divStartWidth is the start mouse position subtracted by the midpoint, technically this
    half the size of the actual div, this is used for keeping the original widtrh of the div
    everytime we drag */
    const divStartWidth = startMousePos - startMidPoint;
    newSize = (currentMousePosition - divStartWidth) * 2;
  } else {
    const { x: elementX, y: elementY } = elementRect;

    // We record the currentMouseposition for everytime the mouse moves
    const currentMousePosition = isHorizontalDrag
      ? clientX - elementX
      : clientY - elementY;

    newSize = currentMousePosition;
  }

  return newSize;
};
