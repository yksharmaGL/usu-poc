
import { Formio, Components} from "@formio/js";
import components from "../components";
import rating from "@src/templates/bootstrap/rating/rating";
import customSelectTmpl from '@src/templates/bootstrap/customSelect';
import tagSelector from "@src/templates/tagSelector";
import dataTableTemplate from "@src/templates/bootstrap/data-table";
import signatureTmpl from '@src/templates/bootstrap/signature';


type TemplateGroup = {
  [templateName: string]: {
    form: unknown; // string | ((ctx:any)=>string)
  };
};

declare module '@formio/js' {
  /* Extend Formio.use typings if needed */
  interface FormioStatic {
    use: (plugin: {
      components?: typeof Components.components;
      templates?: { bootstrap: TemplateGroup };
    }) => void;
  }
}

export default function registerCustomComponents() {
    if (typeof window === 'undefined') {
        return;
    }
    (Formio as any).use({
        components,
        templates: {
            bootstrap: {
                rating: { form: rating },
                tagSelector: { form: tagSelector },
                customSelect: customSelectTmpl,
                dataTable: dataTableTemplate,
                signature:signatureTmpl
            }
        }
    });
}
