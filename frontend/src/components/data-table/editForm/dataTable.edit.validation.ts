export default [
  {
    type: 'checkbox',
    label: 'Required',
    key: 'validate.required',
    input: true,
    tooltip: 'A required field must be filled in before the form can be submitted.'
  },
  {
    type: 'textfield',
    label: 'Custom Error Message',
    key: 'validate.customMessage',
    input: true,
    placeholder: 'Enter custom error message',
    tooltip: 'Custom error message to display when validation fails'
  },
  {
    type: 'textarea',
    label: 'Custom Validation',
    key: 'validate.custom',
    input: true,
    placeholder: 'valid = (input.length > 5)',
    tooltip: 'Custom JavaScript validation code. Must return true for valid values.',
    rows: 5
  },
  {
    type: 'number',
    label: 'Minimum Selected Rows',
    key: 'validate.minSelectedRows',
    input: true,
    placeholder: '0',
    tooltip: 'Minimum number of rows that must be selected',
    conditional: {
      show: true,
      when: 'display.selectable',
      eq: true
    }
  },
  {
    type: 'number',
    label: 'Maximum Selected Rows',
    key: 'validate.maxSelectedRows',
    input: true,
    placeholder: 'No limit',
    tooltip: 'Maximum number of rows that can be selected',
    conditional: {
      show: true,
      when: 'display.selectable',
      eq: true
    }
  },
  {
    type: 'checkbox',
    label: 'Validate Selection Required',
    key: 'validate.selectionRequired',
    input: true,
    tooltip: 'Require at least one row to be selected',
    conditional: {
      show: true,
      when: 'display.selectable',
      eq: true
    }
  }
];
