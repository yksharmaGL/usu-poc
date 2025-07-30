export default [
  {
    type: 'textfield',
    label: 'Footer Label',
    key: 'footerLabel',
    input: true,
    placeholder: 'Sign above',
    tooltip: 'Text to display below the signature pad'
  },
  {
    type: 'textfield',
    label: 'Background Color',
    key: 'backgroundColor',
    input: true,
    placeholder: 'rgb(245,245,235)',
    tooltip: 'Background color of the signature pad canvas'
  },
  {
    type: 'textfield',
    label: 'Pen Color',
    key: 'penColor',
    input: true,
    placeholder: 'black',
    tooltip: 'Color of the signature pen stroke'
  },
  {
    type: 'textfield',
    label: 'Width',
    key: 'width',
    input: true,
    placeholder: '100%',
    tooltip: 'Width of the signature pad (CSS units)'
  },
  {
    type: 'textfield',
    label: 'Height',
    key: 'height',
    input: true,
    placeholder: '150px',
    tooltip: 'Height of the signature pad (CSS units)'
  },
  {
    type: 'number',
    label: 'Minimum Width',
    key: 'minWidth',
    input: true,
    step: 0.1,
    placeholder: 0.5,
    tooltip: 'Minimum width of signature strokes'
  },
  {
    type: 'number',
    label: 'Maximum Width',
    key: 'maxWidth',
    input: true,
    step: 0.1,
    placeholder: 2.5,
    tooltip: 'Maximum width of signature strokes'
  },
  {
    type: 'checkbox',
    label: 'Show Footer',
    key: 'showFooter',
    input: true,
    defaultValue: true,
    tooltip: 'Display footer label below signature pad'
  },
  {
    type: 'checkbox',
    label: 'Clear on Resize',
    key: 'clearOnResize',
    input: true,
    tooltip: 'Clear signature when window is resized'
  }
];
