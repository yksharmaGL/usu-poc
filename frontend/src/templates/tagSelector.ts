

export default function tagSelector(ctx: any) {
  const {
    label = "Tags",
    value = [],
    options = [],
    placeholder = "Type or select...",
    allowNew = true,
    maxTags = 8,
    readOnly = false
  } = ctx;

  const availableOptions = options.filter(
    (tag: any) => !value.includes(tag)
  );

  return `
    <div ref="tags">
      <label>${label}</label>
      <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
        ${value.map((tag: any, idx: any) => `
            <span class="chip" style="background: #eef; border-radius: 12px; padding: 4px 10px; margin-right:4px; display: inline-flex; align-items: center;">
              ${tag}
              ${!readOnly ? `<button ref="remove" style="border:none;background:transparent;margin-left:6px;cursor:pointer;">&times;</button>` : ''}
            </span>
        `).join('')}
        ${!readOnly && (!maxTags || value.length < maxTags) ? `
          <input ref="input" type="text" style="border:none;outline:none;padding:4px 6px;min-width:80px;" placeholder="${placeholder}" list="datalist-${label}">
        ` : ''}
      </div>
      ${availableOptions.length ? `
        <div ref="dropdown" style="max-height:80px;overflow:auto;border:1px solid #ccc;border-radius:4px;padding:4px;margin-top:4px;">
          ${availableOptions.map((tag: any) => `
            <div ref="option" data-tag="${tag}" style="padding:3px 8px;cursor:pointer;">${tag}</div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
