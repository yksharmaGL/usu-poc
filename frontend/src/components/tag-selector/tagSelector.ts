'use client'
import { Formio } from "@formio/js";
const Field = Formio.Components.components.field;
import editForm from './tagSelector.form';

export default class TagSelector extends Field {
    static schema(...extend: any) {
        return Field.schema({
            type: 'tagSelector',
            label: 'Tags',
            key: 'tags',
            input: true,
            options: ['JavaScript', 'React', 'Node.js', 'DevOps'],
            allowNew: true,
            maxTags: 8,
            placeholder: 'Type or select tags...'
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Tag Selector',
            icon: 'tag',
            group: 'advanced',
            schema: TagSelector.schema()
        };
    }

    static editForm = editForm;

    constructor(component: any, options: any, data: any) {
        super(component, options, data);
        let _this: any = this;
        if (typeof _this.component.options === 'string') {
            _this.component.options = _this.component.options
                .split(',')
                .map((opt: string) => opt.trim())
                .filter((opt: string) => opt.length > 0);
        }

        _this.value = _this.dataValue || [];
    }


    render() {
        let _this: any = this;
        return super.render(_this.renderTemplate('tagSelector', {
            label: _this.component.label,
            value: _this.value,
            options: _this.component.options || [],
            placeholder: _this.component.placeholder,
            allowNew: _this.component.allowNew,
            maxTags: _this.component.maxTags,
            readOnly: _this.component.disabled
        }));
    }

    attach(element: any) {
        let _this: any = this;
        _this.loadRefs(element, { input: 'single', chip: 'multiple', remove: 'multiple', dropdown: 'single', option: 'multiple' });

        if (_this.refs.input) {
            _this.refs.input.addEventListener('input', () => {
                _this.triggerRedraw();
            });

            _this.refs.input.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
                    e.preventDefault();
                    _this.addTag(_this.refs.input.value.trim());
                    _this.refs.input.value = '';
                    _this.triggerRedraw();
                }
            });
        }

        if (_this.refs.remove && _this.refs.remove.length) {
            Array.from(_this.refs.remove).forEach((button: any, idx: number) => {
                button.addEventListener('click', () => {
                    _this.value.splice(idx, 1);
                    _this.setValue(_this.value);
                    _this.triggerRedraw();
                });
            });
        }

        if (_this.refs.option && _this.refs.option.length) {
            Array.from(_this.refs.option).forEach((optionEl: any) => {
                optionEl.addEventListener('click', () => {
                    const tag = optionEl.getAttribute('data-tag');
                    if (tag) {
                        this.addTag(tag);
                        this.triggerRedraw();
                    }
                });
            });
        }

        return super.attach(element);
    }

    addTag(tag: string) {
        let _this: any = this;
        if (!tag) return;
        if (_this.value.includes(tag)) return;
        if (_this.component.maxTags && _this.value.length >= _this.component.maxTags) return;
        if (!_this.component.allowNew && !(_this.component.options || []).includes(tag)) return;

        _this.value.push(tag);
        _this.setValue(_this.value);
    }

    triggerRedraw() {
        let _this: any = this;
        _this.redraw();
    }

    getValue() {
        let _this: any = this;
        return _this.value;
    }

    setValue(val: any) {
        let _this: any = this;
        _this.value = Array.isArray(val) ? val : [];
        return super.setValue(_this.value);
    }
}
