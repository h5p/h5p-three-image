import { defaultAppContext } from "./config/contexts";
import { H5PContext } from "../scripts/context/H5PContext";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  decorators: [
    (Story) => (
      <H5PContext.Provider value={defaultAppContext}>
        <Story />
      </H5PContext.Provider>
    ),
  ],
};
