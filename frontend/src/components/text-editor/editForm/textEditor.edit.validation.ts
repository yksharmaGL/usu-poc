export default [
  {
    type: 'checkbox',
    label: 'Required',
    key: 'validate.required',
    input: true,
    tooltip: 'A required text editor must have content before the form can be submitted.'
  },
  {
    type: 'textfield',
    label: 'Custom Error Message',
    key: 'validate.customMessage',
    input: true,
    placeholder: 'Rich text content is required',
    tooltip: 'Error message to display when validation fails'
  },
  {
    type: 'number',
    label: 'Minimum Word Count',
    key: 'validate.minWords',
    input: true,
    placeholder: '0',
    tooltip: 'Minimum number of words required'
  },
  {
    type: 'number',
    label: 'Maximum Word Count',
    key: 'validate.maxWords',
    input: true,
    placeholder: '0 (unlimited)',
    tooltip: 'Maximum number of words allowed'
  }
];
