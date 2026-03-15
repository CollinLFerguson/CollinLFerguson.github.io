import { getGlobalStyleSheets } from "./getGlobalStyleSheets.js";

export default function addGlobalStylesToShadowRoot(shadowRoot) {
    shadowRoot.adoptedStyleSheets.push(
    ...getGlobalStyleSheets()
  );
}