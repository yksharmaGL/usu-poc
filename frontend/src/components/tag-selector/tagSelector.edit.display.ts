export default [
  {
    type: 'textfield',
    key: 'options',
    label: 'Tag Options (comma-separated)',
    input: true,
    tooltip: 'List options, separated by commas'
  },
  {
    type: 'checkbox',
    key: 'allowNew',
    label: 'Allow New Tags',
    input: true
  },
  {
    type: 'number',
    key: 'maxTags',
    label: 'Max Tags',
    input: true
  }
];
