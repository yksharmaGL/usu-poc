export default [
    {
        type: 'number',
        label: 'Minimum Length',
        key: 'minLength',
        input: true,
        placeholder: '0',
        defaultValue: 0,
        tooltip: 'Minimum number of characters required (based on text content, not HTML)'
    },
    {
        type: 'number',
        label: 'Maximum Length',
        key: 'maxLength',
        input: true,
        placeholder: '0 (unlimited)',
        defaultValue: 0,
        tooltip: 'Maximum number of characters allowed (based on text content, not HTML). Use 0 for unlimited.'
    },
    {
        type: 'textEditor',
        key: 'textEditor',
        wysiwyg: true,
        wysiwygConfig: {
            modules: {
                mention: { mentionDenotationChars: ['@'], source: null }
            }
        },
        mentionConfig: {
            usersApiUrl: '/api/users/search',
            minChars: 1,
            maxResults: 5,
            debounce: 300
        },
        placeholder: 'Type @ to mention…'
    }

];
