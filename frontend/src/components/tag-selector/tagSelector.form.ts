export default function () {
    return [
        {
            key: 'display',
            components: [
                {
                    type: 'textfield',
                    key: 'label',
                    label: 'Label',
                    input: true,
                    defaultValue: 'Tags',
                    description: 'The label displayed for the Tag Selector component.'
                },
                {
                    type: 'textfield',
                    key: 'placeholder',
                    label: 'Placeholder',
                    input: true,
                    defaultValue: 'Type or select tags...',
                    description: 'Placeholder text displayed in the tag input box.'
                }
            ]
        },
        {
            key: 'data',
            components: [
                {
                    type: 'textfield',
                    key: 'options',
                    label: 'Tag Options (comma-separated)',
                    input: true,
                    defaultValue: 'JavaScript,React,Node.js,DevOps',
                    description: 'Comma separated list of tags that users can select from.'
                },
                {
                    type: 'checkbox',
                    key: 'allowNew',
                    label: 'Allow Creation of New Tags',
                    input: true,
                    defaultValue: true,
                    description: 'Allow users to add tags not in the predefined list.'
                },
                {
                    type: 'number',
                    key: 'maxTags',
                    label: 'Maximum Tags Allowed',
                    input: true,
                    defaultValue: 8,
                    description: 'Maximum number of tags a user can select or create.'
                }
            ]
        }
    ]
};
