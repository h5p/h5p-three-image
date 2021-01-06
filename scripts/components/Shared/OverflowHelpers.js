/** 
 * Helper class with various methods for checking if a DOM element overflows
 * another.
 * */
export class OverflowHelper {

  /**
   * Create an instance of OverflowHelper.
   * @param {HTMLElement} el DOM element we are checking whether overflows 
   * @param {HTMLElement} containerEl DOM element container
   * @param {{x: number, y: number}} initialCoordinates The initial coordinates for the element
   *  
   */
  constructor(elHeight, topPosition, leftPosition, containerHeight, containerWidth) {
    this.height = elHeight;

    this.topPosition = topPosition;
    this.leftPosition = leftPosition;

    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;

  }

  /**
   * Check whether the DOM element is overflowing the container's top edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsTop(offset) {
    console.log(this.height, offset, this.topPosition)
    return this.height  + offset  > this.topPosition;
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
 * @param  {String} position
 * @param  {Number} height
 * @param  {Number} width
 * @param  {Number} topPosition
 * @param  {Number} leftPosition
 * @param  {Number} wrapperHeight
 * @param  {Number} wrapperWidth
 * @returns {Object} {expandirection, alignment}
 */
export function willOverflow(position, height, topPosition, leftPosition, wrapperHeight, wrapperWidth) {
  const overflowHelper = new OverflowHelper(height, width, topPosition, leftPosition, wrapperHeight, wrapperWidth);
  let expandDirection = null;
  let alignment = null;

  if (position === 'left' || position === 'right') {
    if (overflowHelper.overflowsBottom()) {
      expandDirection = 'up';
    }
  }
  else if (position === 'top') {
    if(overflowHelper.overflowsTop()) {
      alignment = 'bottom';
    }
  }
  else if (position === 'bottom') {
    if(overflowHelper.overflowsBottom()) {
      alignment = 'top';
    }
  }

  return {expandDirection: expandDirection, alignment: alignment};
}
