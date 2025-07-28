export default [
  // Rating-specific settings
  {
    type: 'number',
    key: 'numberOfIcons',
    label: 'Number of Icons',
    input: true,
    tooltip: 'The number of icons displayed in the form.'
  },
  {
    type: 'textfield',
    key: 'icon',
    label: 'Icon Class (e.g., bi bi-star)',
    input: true,
    tooltip: 'The Bootstrap or FontAwesome class used for icons.'
  },
  {
    type: 'textfield',
    key: 'color',
    label: 'Icon Color',
    input: true,
    tooltip: 'The CSS color value for icons.'
  },
  {
    type: 'textfield',
    key: 'iconSize',
    label: 'Icon Size',
    input: true,
    tooltip: 'The font size or width of the icons (e.g., 2rem, 24px).'
  },
  {
    type: 'textfield',
    key: 'label',
    label: 'Label',
    input: true,
    tooltip: 'The label for this component.'
  },
  {
    type: 'textfield',
    key: 'key',
    label: 'Field Key',
    input: true,
    tooltip: 'The field key used in data submission.'
  },
  {
    type: 'checkbox',
    key: 'disabled',
    label: 'Disabled',
    input: true,
    tooltip: 'Disable the component in the form.'
  },
  {
    type: 'checkbox',
    key: 'required',
    label: 'Required',
    input: true,
    tooltip: 'Make the field required.'
  },
  {
    type: 'textfield',
    key: 'defaultValue',
    label: 'Default Rating',
    input: true,
    tooltip: 'Default value when the form loads.'
  },
  {
    type: 'textfield',
    key: 'customClass',
    label: 'Custom CSS Class',
    input: true,
    tooltip: 'Add a custom class to this component.'
  },
  {
    type: 'textarea',
    key: 'tooltip',
    label: 'Tooltip Text',
    input: true,
    tooltip: 'Tooltip shown on hover.'
  },
  {
    type: 'checkbox',
    key: 'hidden',
    label: 'Hidden',
    input: true,
    tooltip: 'Hide this component from the UI.'
  },
  {
    type: 'checkbox',
    key: 'multiple',
    label: 'Allow Multiple',
    input: true,
    tooltip: 'Allow users to rate multiple times (not typical for rating but shows capability).'
  },
  {
    type: 'textfield',
    key: 'customProperty',
    label: 'Custom Property (for dev use)',
    input: true,
    tooltip: 'You can use this in custom logic or rendering.'
  },
  // Ignore unwanted inherited fields
  {
    key: 'placeholder',
    ignore: true
  },
  {
    key: 'prefix',
    ignore: true
  },
  {
    key: 'suffix',
    ignore: true
  }
];
