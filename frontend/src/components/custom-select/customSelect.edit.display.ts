export default [
  {
    key: 'labelPosition',
    ignore: true
  },
  {
    key: 'placeholder',
    ignore: true
  },
  {
    type: 'textfield',
    label: 'Placeholder',
    key: 'placeholder',
    input: true,
    tooltip: 'Custom placeholder text for the select component'
  },
  {
    type: 'select',
    label: 'Custom Theme',
    key: 'customOptions.theme',
    input: true,
    data: {
      values: [
        { label: 'Default', value: 'default' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Danger', value: 'danger' }
      ]
    },
    defaultValue: 'default'
  },
  {
    type: 'checkbox',
    label: 'Show Icons',
    key: 'customOptions.showIcons',
    input: true,
    tooltip: 'Show icons next to select options'
  },
  {
    type: 'checkbox',
    label: 'Multiple Columns',
    key: 'customOptions.multipleColumns',
    input: true,
    tooltip: 'Display options in multiple columns'
  },
  {
    type: 'number',
    label: 'Column Count',
    key: 'customOptions.columnCount',
    input: true,
    defaultValue: 2,
    conditional: {
      show: true,
      when: 'customOptions.multipleColumns',
      eq: true
    }
  }
];
