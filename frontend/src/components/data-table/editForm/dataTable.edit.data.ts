export default [
  {
    type: 'checkbox',
    label: 'Enable Data Fetching',
    key: 'fetch.enabled',
    input: true,
    tooltip: 'Enable fetching data from external sources'
  },
  {
    type: 'select',
    label: 'Data Source Type',
    key: 'fetch.sourceType',
    input: true,
    data: {
      values: [
        { label: 'URL', value: 'url' },
        { label: 'Resource', value: 'resource' }
      ]
    },
    conditional: {
      show: true,
      when: 'fetch.enabled',
      eq: true
    }
  },
  {
    type: 'textfield',
    label: 'Data Source URL',
    key: 'fetch.url',
    input: true,
    placeholder: 'https://api.example.com/data',
    tooltip: 'URL to fetch data from. Supports form data interpolation with {{ data.fieldName }}',
    conditional: {
      show: true,
      when: 'fetch.sourceType',
      eq: 'url'
    }
  },
  {
    type: 'select',
    label: 'HTTP Method',
    key: 'fetch.method',
    input: true,
    data: {
      values: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' }
      ]
    },
    defaultValue: 'GET',
    conditional: {
      show: true,
      when: 'fetch.sourceType',
      eq: 'url'
    }
  },
  {
    type: 'datagrid',
    label: 'Request Headers',
    key: 'fetch.headers',
    input: true,
    components: [
      {
        type: 'textfield',
        label: 'Header Name',
        key: 'key',
        input: true
      },
      {
        type: 'textfield',
        label: 'Header Value',
        key: 'value',
        input: true
      }
    ],
    conditional: {
      show: true,
      when: 'fetch.sourceType',
      eq: 'url'
    }
  },
  {
    type: 'checkbox',
    label: 'Form.io Authentication',
    key: 'fetch.authenticate',
    input: true,
    tooltip: 'Include Form.io authentication headers with the request',
    conditional: {
      show: true,
      when: 'fetch.sourceType',
      eq: 'url'
    }
  },
  {
    type: 'checkbox',
    label: 'Enable Caching',
    key: 'fetch.cache',
    input: true,
    defaultValue: true,
    tooltip: 'Cache request results to improve performance',
    conditional: {
      show: true,
      when: 'fetch.enabled',
      eq: true
    }
  },
  {
    type: 'textarea',
    label: 'Transform Data Function',
    key: 'fetch.transformData',
    input: true,
    placeholder: 'return data.results; // Transform the received data',
    tooltip: 'JavaScript function to transform the received data. The data parameter contains the response.',
    conditional: {
      show: true,
      when: 'fetch.enabled',
      eq: true
    }
  },
  {
    type: 'checkbox',
    label: 'Submit Selected Rows',
    key: 'selection.submitSelectedRows',
    input: true,
    tooltip: 'When enabled, only selected row data will be submitted with the form'
  }
];
