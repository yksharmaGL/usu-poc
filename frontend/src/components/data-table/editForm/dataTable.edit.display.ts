export default [
  {
    type: 'datagrid',
    label: 'Table Columns',
    key: 'display.columns',
    input: true,
    reorder: true,
    components: [
      {
        type: 'textfield',
        label: 'Field Key',
        key: 'key',
        input: true,
        validate: {
          required: true
        }
      },
      {
        type: 'textfield',
        label: 'Column Label',
        key: 'label',
        input: true,
        validate: {
          required: true
        }
      },
      {
        type: 'checkbox',
        label: 'Sortable',
        key: 'sortable',
        input: true,
        defaultValue: true
      },
      {
        type: 'checkbox',
        label: 'Filterable',
        key: 'filterable',
        input: true
      },
      {
        type: 'textfield',
        label: 'Width',
        key: 'width',
        input: true,
        placeholder: '100px or 20%'
      },
      {
        type: 'select',
        label: 'Text Alignment',
        key: 'align',
        input: true,
        data: {
          values: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        defaultValue: 'left'
      }
    ]
  },
  {
    type: 'number',
    label: 'Items Per Page',
    key: 'display.itemsPerPage',
    input: true,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 1000
    }
  },
  {
    type: 'checkbox',
    label: 'Enable Search',
    key: 'display.searchable',
    input: true,
    defaultValue: true
  },
  {
    type: 'checkbox',
    label: 'Enable Sorting',
    key: 'display.sortable',
    input: true,
    defaultValue: true
  },
  {
    type: 'checkbox',
    label: 'Enable Filtering',
    key: 'display.filterable',
    input: true,
    defaultValue: true
  },
  {
    type: 'checkbox',
    label: 'Enable Pagination',
    key: 'display.pagination',
    input: true,
    defaultValue: true
  },
  {
    type: 'checkbox',
    label: 'Enable Row Selection',
    key: 'display.selectable',
    input: true,
    defaultValue: true
  },
  {
    type: 'checkbox',
    label: 'Multiple Selection',
    key: 'display.multiSelect',
    input: true,
    defaultValue: true,
    conditional: {
      show: true,
      when: 'display.selectable',
      eq: true
    }
  },
  {
    type: 'checkbox',
    label: 'Select All Option',
    key: 'selection.selectAllEnabled',
    input: true,
    defaultValue: true,
    conditional: {
      show: true,
      when: 'display.multiSelect',
      eq: true
    }
  },
  {
    type: 'textfield',
    label: 'Selection Key Field',
    key: 'selection.selectionKey',
    input: true,
    defaultValue: '_id',
    tooltip: 'Field to use as unique identifier for row selection',
    conditional: {
      show: true,
      when: 'display.selectable',
      eq: true
    }
  }
];
