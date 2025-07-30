import { Components } from '@formio/js';
const fieldEditForm = (Components as any).components.field.editForm;
import SignatureEditDisplay from './editForm/signature.edit.display';
import SignatureEditData from './editForm/signature.edit.data';
import SignatureEditValidation from './editForm/signature.edit.validation';

export default function(...extend: any[]) {
  return fieldEditForm([
    {
      key: 'display',
      components: SignatureEditDisplay
    },
    {
      key: 'data',
      components: SignatureEditData
    },
    {
      key: 'validation',
      components: SignatureEditValidation
    }
  ], ...extend);
}
