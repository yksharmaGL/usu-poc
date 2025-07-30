import { Components } from '@formio/js';
const selectEditForm = Components.components.select.editForm;
import customSelectEditDisplay from './customSelect.edit.display';

export default function(...extend: any) {
  return selectEditForm([
    {
      key: 'display',
      components: customSelectEditDisplay
    }
  ], ...extend);
}
