export default [
  {
    type: 'checkbox',
    label: 'Required',
    key: 'validate.required',
    input: true,
    tooltip: 'Require a signature before form submission'
  },
  {
    type: 'textfield',
    label: 'Custom Error Message',
    key: 'validate.customMessage',
    input: true,
    placeholder: 'Signature is required',
    tooltip: 'Custom message to show when signature validation fails'
  },
  {
    type: 'textarea',
    label: 'Custom Validation',
    key: 'validate.custom',
    input: true,
    placeholder: 'valid = !input.isEmpty',
    tooltip: 'Custom JavaScript validation for signature',
    rows: 3
  }
];
