import { getGlobalStyleSheets } from "./getGlobalStyleSheets";

export default function addGlobalStylesToShadowRoot(shadowRoot) {
    shadowRoot.adoptedStyleSheets.push(
    ...getGlobalStyleSheets()
  );
}