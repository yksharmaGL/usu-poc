// templates/form.js

// This function returns the HTML for your rating component star row.
export default function(ctx: any) {
  // Destructure all needed context variables with sensible defaults
  const {
    component: {
      label = 'Rating',
      icon = 'bi bi-star',
      color = 'gold',
      iconSize = '2rem',
      numberOfIcons = 5,
      // Other possible component properties
    } = {},
    filledIcons = 0
  } = ctx;

  // Build HTML
  return `
    <div ref="rating" style="user-select: none;">
      ${label ? `<label>${label}</label><br/>` : ''}
      ${Array.from({ length: numberOfIcons }).map((_, i) => `
        <i 
          ref="icon"
          class="${icon}${i < filledIcons ? '-fill' : ''}" 
          style="color: ${i < filledIcons ? color : '#ccc'}; font-size: ${iconSize}; margin-right: 4px; cursor: pointer;"
        ></i>
      `).join('')}
    </div>
  `;
}
