/* eslint-disable */
'use client'
import { Formio } from "@formio/js";
import editForm from './Rating.form'

const Field = Formio.Components.components.field;

export default class Rating extends Field {
  static editForm = editForm

  static schema(...extend: any) {
    return Field.schema({
      title: 'Rating',
      type: 'rating',
      label: 'rating',
      key: 'rating',
      icon: 'bi bi-star',
      iconSize: '2rem',
      color: 'blue',
      numberOfIcons: 5,
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Rating',
      icon: 'star',
      group: 'basic',
      documentation: '/userguide/#rating',
      weight: 0,
      schema: Rating.schema()
    };
  }

  constructor(component: any, options: any, data: any) {
    super(component, options, data);
  }

 render(): string {
   console.log('[Rating Component] render() called');
  let _this: any = this;
  const templateFn = _this.renderTemplate?.bind(this);
  console.log("templateFn", console.log(Formio.Templates.current.rating?.toString()));
  if (typeof templateFn !== 'function') {
    console.warn('Template function missing for: rating');
    return super.render('<div>Template not found</div>');
  }

  return super.render(templateFn('rating', {
    numberOfIcons: _this.component.numberOfIcons,
    filledIcons: Number(_this.dataValue?.split('/')[0])
  }));
}


  attachIcon(icons: any, index: any) {
    let _this: any = this;
    const icon = icons.item(index);
    icon.addEventListener('click', () => {
      if (!_this.component.disabled) {
        _this.setValue(`${index + 1}/${_this.component.numberOfIcons}`);
      }
    })
  }

  attachIcons() {
    let _this: any = this;
    const icons = _this.refs.icon;
    for (let i = 0; i < icons.length; i++) {
      _this.attachIcon(icons, i);
    }
  }

  attach(element: any) {
    let _this: any = this;
    _this.loadRefs(element, {
      rating: 'single',
      icon: 'multiple'
    });
    _this.attachIcons();
    return super.attach(element);
  }

  get defaultSchema() {
    return Rating.schema();
  }

  setValue(value: any) {
    let _this: any = this;
    const changed = super.setValue(value);
    _this.redraw();
    return changed;
  }
}
