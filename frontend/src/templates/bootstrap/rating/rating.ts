export default function rating(ctx: any) {
  const {
    icon = 'bi bi-star',
    color = 'gold',
    iconSize = '2rem',
    numberOfIcons = 5,
    filledIcons = 0
  } = ctx;

  return `
    <div ref="rating">
      ${Array.from({ length: numberOfIcons }).map((_, i) => `
        <i 
          ref="icon"
          class="${icon} ${i < filledIcons ? 'filled' : ''}"
          style="color: ${i < filledIcons ? color : '#ccc'}; font-size: ${iconSize}; margin-right: 4px; cursor: pointer;"
        ></i>
      `).join('')}
    </div>
  `;
}
