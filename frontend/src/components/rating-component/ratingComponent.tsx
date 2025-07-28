import React from 'react';
import { Components } from 'formiojs';
import { createRoot, Root } from 'react-dom/client';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

export default class RatingComponent extends Components.components.field {
    private reactRoot?: Root;

    static schema(...extend: any[]): any {
        return Components.components.field.schema({
            type: 'rating',
            label: 'Rating',
            key: 'rating',
            inputType: 'number',
            defaultValue: 0,
            input: true,
            ...extend[0]
        });
    }

    static get builderInfo() {
        return {
            title: 'Rating',
            group: 'basic',
            icon: 'star',
            weight: 90,
            schema: RatingComponent.schema()
        };
    }

    render(): string {
        return super.render(
            this.renderTemplate('input', {
                input: `<div ref="input"></div>`
            })
        );
    }

    attach(element: HTMLElement): any {
        super.attach(element);

        const container = element.querySelector('[ref="input"]') as HTMLElement | null;
        if (container) {
            this.reactRoot = createRoot(container);
            this.reactRoot.render(
                <Rating
                    style={{ maxWidth: 180 }}
                    value={this.getValue() || 0}
                    onChange={(newValue: number) => {
                        void this.setValue(newValue, { modified: true });
                    }}
                />
            );
        }

        return element;
    }

    detach(): void {
        if (this.reactRoot) {
            this.reactRoot.unmount();
        }
        super.detach();
    }

    getValue(): number {
        return super.getValue() ?? 0;
    }
    
    setValue(value: number, flags: any): boolean {
        return super.setValue(value, flags);
    }
}
