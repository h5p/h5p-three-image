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
  constructor(elHeight, elWidth, topPosition, leftPosition, containerHeight, containerWidth, buttonHeight) {
    this.height = elHeight;
    this.width = elWidth;

    this.topPosition = topPosition;
    this.leftPosition = leftPosition;


    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;

    this.buttonHeight = buttonHeight;
  }

  /**
   * Check whether the DOM element is overflowing the container's top edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsTop() {
    return this.height > this.topPosition;
  }

  /** TODO need to be tested
   * Check whether the DOM element is overflowing the container's right edge
   * @returns {boolean} true if overflowing, false if not
   */

  overflowsRight() {
    return this.width + this.leftPosition >
      this.containerWidth;
  }

  /**
   * Check whether the DOM element is overflowing the container's bottom edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsBottom() {
    return this.height + this.topPosition + this.buttonHeight >
      this.containerHeight;
  }

  /**
   * TODO need to be tested
   * Check whether the DOM element is overflowing the container's left edge
   * @returns {boolean} true if overflowing, false if not
   */
  overflowsLeft() {
    return this.width < this.leftPosition;
  }

  /**
   * Check whether the DOM element would be overflowing the container's top edge
   * if it were vertically centered at the initial coordinates.
   * @returns {boolean} true if overflowing, false if not
   */
  /* wouldOverflowTopIfCentered() {
    return (this.elInitialY - (this.elRect.height / 2)) < 0;
  } */

  /**
   * Check whether the DOM element would be overflowing the container's right edge
   * if it were positioned at the initial coordinates.
   * @returns {boolean} true if overflowing, false if not
   */
  /* wouldOverflowRightIfRightAligned() {
    return (this.elInitialX + this.elRect.width) > this.containerRect.width;
  } */

  /**
   * Check whether the DOM element would be overflowing the container's left edge
   * if it were positioned at the initial coordinates, but flipped along its x-axis.
   * (if its right edge was positioned at the initial x coordinate)
   * @returns {boolean} true if overflowing, false if not
   */
  /* wouldOverflowLeftIfLeftAligned() {
    return (this.elInitialX - this.elRect.width) < 0;
  } */

  /**
   * Check whether the DOM element is currently sized to fit within the container,
   * meaning neither its height nor its width is greater than the container's.
   * @return {boolean} true 
   */
  /* fitsWithin() {
    return this.elRect.width <= this.containerRect.width &&
      this.elRect.height <= this.containerRect.height;
  } */
}

/**
 * Calculate an appropriate placement for a DOM element so that
 * it does not overflow its container.
 * 
 * @param {HTMLElement} el DOM element that we are checking the position of
 * @param {HTMLElement} containerEl Container element whose boundaries we want to stay within
 * @param {{x: number, y: number}} initialCoordinates Initial x and y coordinates for the tip
 * @return {string} Value indicating appropriate placement
 */
export function willOverflow(position, height, width, topPosition, leftPosition, wrapperHeight, wrapperWidth, buttonHeight) {
  const overflowHelper = new OverflowHelper(height, width, topPosition, leftPosition, wrapperHeight, wrapperWidth, buttonHeight);
  let expandDirection = null;
  if (position === 'left' || position === 'right') {
    if (overflowHelper.overflowsBottom()) {
      expandDirection = 'up';
    }
  }

  return {expandDirection};
}
