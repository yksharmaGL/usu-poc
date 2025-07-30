import { Components } from '@formio/js';
const fieldEditForm = (Components as any).components.field.editForm;
import DataTableEditDisplay from './editForm/dataTable.edit.display';
import DataTableEditData from './editForm/dataTable.edit.data';
import DataTableEditValidation from './editForm/dataTable.edit.validation';

export default function(...extend: any[]) {
  return fieldEditForm([
    {
      key: 'display',
      components: DataTableEditDisplay
    },
    {
      key: 'data',
      components: DataTableEditData
    },
    {
      key: 'validation',
      components: DataTableEditValidation
    }
  ], ...extend);
}
