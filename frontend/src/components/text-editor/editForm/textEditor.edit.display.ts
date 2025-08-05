export default [
  {
    type: 'textfield',
    label: 'Placeholder',
    key: 'placeholder',
    input: true,
    placeholder: 'Type @ to mention users or # for hashtags...',
    tooltip: 'Placeholder text to show when editor is empty'
  },
  {
    type: 'fieldset',
    legend: 'Mention Settings',
    components: [
      {
        type: 'checkbox',
        label: 'Enable Mentions',
        key: 'mentionConfig.enableMentions',
        input: true,
        defaultValue: true,
        tooltip: 'Enable @mention and #hashtag functionality'
      },
      {
        type: 'checkbox',
        label: 'Enable User Mentions (@)',
        key: 'mentionConfig.enableUsers',
        input: true,
        defaultValue: true,
        conditional: {
          show: true,
          when: 'mentionConfig.enableMentions',
          eq: true
        },
        tooltip: 'Allow users to mention other users with @'
      },
      {
        type: 'checkbox',
        label: 'Enable Hashtags (#)',
        key: 'mentionConfig.enableHashtags',
        input: true,
        defaultValue: false,
        conditional: {
          show: true,
          when: 'mentionConfig.enableMentions',
          eq: true
        },
        tooltip: 'Allow users to add hashtags with #'
      },
      {
        type: 'textfield',
        label: 'Users API URL',
        key: 'mentionConfig.usersApiUrl',
        input: true,
        placeholder: '/api/users/search',
        conditional: {
          show: true,
          when: 'mentionConfig.enableUsers',
          eq: true
        },
        tooltip: 'API endpoint for searching users'
      },
      {
        type: 'textfield',
        label: 'Hashtags API URL',
        key: 'mentionConfig.hashtagsApiUrl',
        input: true,
        placeholder: '/api/hashtags/search',
        conditional: {
          show: true,
          when: 'mentionConfig.enableHashtags',
          eq: true
        },
        tooltip: 'API endpoint for searching hashtags'
      },
      {
        type: 'number',
        label: 'Search Delay (ms)',
        key: 'mentionConfig.searchDelay',
        input: true,
        defaultValue: 300,
        conditional: {
          show: true,
          when: 'mentionConfig.enableMentions',
          eq: true
        },
        tooltip: 'Delay before triggering search API call'
      },
      {
        type: 'number',
        label: 'Max Results',
        key: 'mentionConfig.maxResults',
        input: true,
        defaultValue: 10,
        conditional: {
          show: true,
          when: 'mentionConfig.enableMentions',
          eq: true
        },
        tooltip: 'Maximum number of results to show'
      }
    ]
  },
  {
    type: 'checkbox',
    label: 'Enable Word Count',
    key: 'enableWordCount',
    input: true,
    defaultValue: true,
    tooltip: 'Show word count below the editor'
  },
  {
    type: 'checkbox',
    label: 'Enable Character Count',
    key: 'enableCharacterCount',
    input: true,
    defaultValue: false,
    tooltip: 'Show character count below the editor'
  }
];
