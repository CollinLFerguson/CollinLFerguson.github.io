let globalSheets = null;

export function getGlobalStyleSheets(refresh_flag=false) {
  if (globalSheets === null || refresh_flag === true) {
    globalSheets = Array.from(document.styleSheets)
      .map(x => {
        const sheet = new CSSStyleSheet();
        const css = Array.from(x.cssRules).map(rule => rule.cssText).join(' ');
        sheet.replaceSync(css);
        return sheet;
      });
  }

  return globalSheets;
}