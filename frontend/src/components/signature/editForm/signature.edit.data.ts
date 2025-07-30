export default [
  {
    type: 'select',
    label: 'Provider',
    key: 'signatureOptions.provider',
    input: true,
    data: {
      values: [
        { label: 'Default', value: 'default' },
        { label: 'Box Sign', value: 'box' }
      ]
    },
    defaultValue: 'default',
    tooltip: 'Signature provider to use'
  },
  {
    type: 'number',
    label: 'Velocity Filter Weight',
    key: 'signatureOptions.velocityFilterWeight',
    input: true,
    step: 0.1,
    placeholder: 0.7,
    tooltip: 'Weight for velocity-based stroke width calculation'
  },
  {
    type: 'number',
    label: 'Minimum Distance',
    key: 'signatureOptions.minDistance',
    input: true,
    placeholder: 5,
    tooltip: 'Minimum distance between points'
  },
  {
    type: 'number',
    label: 'Throttle',
    key: 'signatureOptions.throttle',
    input: true,
    placeholder: 16,
    tooltip: 'Throttle drawing events (ms)'
  },
  {
    type: 'number',
    label: 'Dot Size',
    key: 'signatureOptions.dotSize',
    input: true,
    step: 0.1,
    placeholder: 1,
    tooltip: 'Size of dots when drawing'
  }
];
