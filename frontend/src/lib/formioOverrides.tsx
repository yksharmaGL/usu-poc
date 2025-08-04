// src/lib/formioOverrides.ts

import _ from 'lodash';

// Define the structure for Formio and Templates for minimal typing
type FormioType = typeof import('formiojs').Formio;
type TemplatesType = Record<string, any>;

let Formio: FormioType | null = null;
let baseTemplates: TemplatesType | null = null;

/**
 * Utility function to safely add a custom class to a tag within an HTML string.
 */
function addClassToTag(html: string, tagName: string, customClass: string): string {
  const regex = new RegExp(`<${tagName}([^>]*)class="([^"]*)"`, 'i');
  if (regex.test(html)) {
    return html.replace(regex, `<${tagName}$1class="$2 ${customClass}"`);
  } else {
    const openTagRegex = new RegExp(`<${tagName}([^>]*)>`, 'i');
    return html.replace(openTagRegex, `<${tagName}$1 class="${customClass}">`);
  }
}

/**
 * Apply theme overrides to Form.io templates based on the selected theme.
 * Should be called only in the browser (client-side).
 */
export function applyFormioOverrides(theme: string): void {
  console.log("===============> trying ");
  if (typeof window === 'undefined') return;

  if (!Formio || !baseTemplates) {
    const formioModule = require('formiojs');
    Formio = formioModule.Formio;
    baseTemplates = Formio.Templates.bootstrap;
  }

  if (!Formio || !baseTemplates) return;

  if (Formio.Templates.framework === 'custom') return;

  const templates = _.cloneDeep(baseTemplates);

  templates.label = (ctx: any) => addClassToTag(baseTemplates!.label(ctx), 'label', `formio-label-${theme}`);
  templates.input = (ctx: any) => addClassToTag(baseTemplates!.input(ctx), 'input', `formio-input-${theme}`);
  templates.textarea = (ctx: any) => addClassToTag(baseTemplates!.textarea(ctx), 'textarea', `formio-textarea-${theme}`);
  templates.select = (ctx: any) => addClassToTag(baseTemplates!.select(ctx), 'select', `formio-select-${theme}`);
  templates.button = (ctx: any) => addClassToTag(baseTemplates!.button(ctx), 'button', `formio-button-${theme}`);

  Formio.Templates['custom'] = templates;
  Formio.options.template = 'custom';
    console.log("===============> trying " + Formio.options.template);
}
