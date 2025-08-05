import { Formio } from 'formiojs';

export function applyFormioTheme(theme) {
  if (!Formio?.Templates?.bootstrap) return;

  const base = Formio.Templates.bootstrap;
  const templates = { ...base };

  function addClassToTag(html, tagName, customClass) {
    const regex = new RegExp(`<${tagName}([^>]*)class="([^"]*)`, "i");
    if (regex.test(html)) {
      return html.replace(regex, `<${tagName}$1class="$2 ${customClass}"`);
    } else {
      const openTagRegex = new RegExp(`<${tagName}([^>]*)>`, "i");
      return html.replace(openTagRegex, `<${tagName}$1 class="${customClass}">`);
    }
  }

  templates.label = (ctx) => addClassToTag(base.label(ctx), "label", `formio-label-${theme}`);
  templates.input = (ctx) => addClassToTag(base.input(ctx), "input", `formio-input-${theme}`);
  templates.textarea = (ctx) => addClassToTag(base.textarea(ctx), "textarea", `formio-textarea-${theme}`);
  templates.select = (ctx) => addClassToTag(base.select(ctx), "select", `formio-select-${theme}`);
  templates.button = (ctx) => addClassToTag(base.button(ctx), "button", `formio-button-${theme}`);

  Formio.Templates["custom"] = templates;
  Formio.Templates.framework = "custom";
}
