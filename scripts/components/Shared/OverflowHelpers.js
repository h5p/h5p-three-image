/** 
 * Helper class with various methods for checking if a DOM element overflows
 * another.
 * */
export class OverflowHelper {

  /**
   * Create an instance of OverflowHelper.
   * @param  {number} elHeight
   * @param  {number} topPosition
   * @param  {number} leftPosition
   * @param  {number} containerHeight
   * @param  {number} containerWidth 
   */
  constructor(elHeight, topPosition, leftPosition, containerHeight) {
    this.height = elHeight;

    this.topPosition = topPosition;
    this.leftPosition = leftPosition;

    this.containerHeight = containerHeight;

  }

  /**
   * Check whether the DOM element is overflowing the container's top edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsTop() {
    return this.height > this.topPosition;
  }


  /**
   * Check whether the DOM element is overflowing the container's bottom edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsBottom() {
    return this.height + this.topPosition >
      this.containerHeight;
  }
}

/**
 * Calculate correct alignment and expand direction for an element
 * @param  {string} position
 * @param  {number} height
 * @param  {number} topPosition
 * @param  {number} leftPosition
 * @param  {number} wrapperHeight
 * @returns {object} {expandirection, alignment}
 */
export function willOverflow(position, height, topPosition, leftPosition, wrapperHeight) {
  const overflowHelper = new OverflowHelper(height, topPosition, leftPosition, wrapperHeight);
  let expandDirection = null;
  let alignment = null;

  switch (position) {
    case 'left':
    case 'right':
      if (overflowHelper.overflowsBottom()) {
        expandDirection = 'up';
      }
      break;
    case 'top':
      if (overflowHelper.overflowsTop()) {
        alignment = 'bottom';
      }
      break;
    case 'bottom':
      if (overflowHelper.overflowsBottom()) {
        alignment = 'top';
      }
      break;
  }

  return { expandDirection: expandDirection, alignment: alignment };
}
