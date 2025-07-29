import { Formio } from "@formio/js";
import components from "../components";
import rating from "@src/templates/bootstrap/rating/rating";

export default function registerCustomComponents() {
  (Formio as any).use({
    components,
    templates: {
      bootstrap: {
        rating: { form: rating }
      }
    }
  });
}
