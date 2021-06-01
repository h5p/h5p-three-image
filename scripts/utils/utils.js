// @ts-check

/**
 * 
 * @returns {string}
 */
export function createUUID() {
  const numberOfDigits = 6;

  return Math.floor(Math.random() * 10 * numberOfDigits).toString(36).padStart(numberOfDigits, "0");
}

/**
 * Determine whether or not the interaction should be rendered in 3d
 * 
 * @param {Interaction} interaction
 * @return {boolean}
 */
export function renderIn3d(interaction) {
  return interaction.label && interaction.label.showAsHotspot;
}