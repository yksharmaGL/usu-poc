
import React from 'react'
import { Components } from "formiojs";
import { createRoot } from 'react-dom/client';
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

export default class RatingComponent extends Components.components.field {

    static schema(...extend: any): any {
        return Components.components.field.schema({
            type: "rating",
            label: "Rating",
            key: "rating",
            inputType: "number",
             defaultValue: 0,
            ...extend
        })
    }

    static get builderInfo() {
        return {
            title: 'Rating',
            group: 'basic',
            icon: 'star',
            weight: 90,
            schema: RatingComponent.schema(),
        };
    }

    attach(element: any) {
        super.attach(element);
        const ratingContainer = element.querySelector(`[ref="input"]`);
        if (ratingContainer) {
            const root = createRoot(ratingContainer);
            root.render(
                <Rating
                    style={{ maxWidth: 180 }}
                    value={this.dataValue || 0}
                    onChange={(newValue: any) => this.setValue(newValue, { modified: true })}
                />
            );
        }
        return element
    }

    render() {
        return super.render(this.renderTemplate('input', {
            input: `<div ref="input"></div>`
        }))
    }
}
