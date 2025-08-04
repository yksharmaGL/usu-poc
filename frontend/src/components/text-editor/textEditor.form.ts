'use client'
import { Components } from '@formio/js';

const textareaEditForm = (Components as any).components.textarea.editForm;
import TextEditorEditDisplay from './editForm/textEditor.edit.display';
import TextEditorEditData from './editForm/textEditor.edit.data';
import TextEditorEditValidation from './editForm/textEditor.edit.validation';

export default function(...extend: any[]) {
  return textareaEditForm([
    {
      key: 'display',
      components: TextEditorEditDisplay
    },
    {
      key: 'data',
      components: TextEditorEditData
    },
    {
      key: 'validation',
      components: TextEditorEditValidation
    }
  ], ...extend);
}
