import {Formio} from "@formio/js";

const baseEditForm = Formio.Components.baseEditForm
import RatingEditDisplay from "./editForm/Rating.edit.display";
export default function (...extend: any){
    return baseEditForm([
        {
            key: 'display',
            components: RatingEditDisplay
        },
        {
            key: 'layout',
            ignore: true
        }
    ], ... extend)
}
