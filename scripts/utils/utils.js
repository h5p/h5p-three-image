// @ts-check

/**
 * Determine whether or not the interaction should be rendered in 3d
 * 
 * @param {Interaction} interaction
 * @return {boolean}
 */
export function renderIn3d(interaction) {
  return interaction.label && interaction.label.showAsHotspot;
}