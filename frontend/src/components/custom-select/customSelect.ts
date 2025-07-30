import { Components } from '@formio/js';

// Extend from the base Select component to inherit all functionality
const SelectComponent = Components.components.select;

export default class CustomSelect extends SelectComponent {
  static schema(...extend: any) {
    return SelectComponent.schema({
      type: 'customSelect',
      label: 'Custom Select',
      key: 'customSelect',
      // Add custom properties specific to your select
      customOptions: {
        theme: 'custom',
        showIcons: true,
        multipleColumns: false
      },
      // Custom styling options
      customClass: 'custom-select-wrapper',
      // Override select-specific properties
      widget: 'choicesjs', // or 'html5'
      searchEnabled: true,
      template: '<span>{{ item.label }}</span>',
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Custom Select',
      group: 'basic',
      icon: 'fa fa-list-ul',
      weight: 71,
      documentation: '/developers/custom-components#custom-select',
      schema: CustomSelect.schema()
    };
  }

  constructor(component: any, options: any, data: any) {
    super(component, options, data);
    this.customSelectOptions = this.component.customOptions || {};
  }

  // Override render method to use custom template
  render() {
    const info = this.inputInfo;
    info.attr = info.attr || {};
    info.multiple = this.component.multiple;
    
    return super.render(this.renderTemplate('customSelect', {
      input: info,
      selectOptions: '',
      customOptions: this.customSelectOptions,
      showIcons: this.customSelectOptions.showIcons,
      theme: this.customSelectOptions.theme || 'default',
      index: null,
    }));
  }

  // Override choicesOptions to add custom styling
  choicesOptions() {
    const baseOptions = super.choicesOptions();
    
    return {
      ...baseOptions,
      classNames: {
        ...baseOptions.classNames,
        containerOuter: [...baseOptions.classNames.containerOuter, 'custom-select-container'],
        dropdown: ['choices__list--dropdown', 'custom-dropdown'],
      },
      // Add custom choice rendering
      callbackOnCreateTemplates: (template: any) => {
        return {
          item: (classNames: any, data: any) => {
            return template(`
              <div class="${classNames.item} custom-select-item" data-item data-id="${data.id}" data-value="${data.value}">
                ${this.customSelectOptions.showIcons ? '<i class="fa fa-check custom-select-icon"></i>' : ''}
                ${data.label}
              </div>
            `);
          },
          choice: (classNames: any, data: any) => {
            return template(`
              <div class="${classNames.item} ${classNames.itemChoice} custom-select-choice" data-select-text="${this.component.placeholder || 'Press to select'}" data-choice data-id="${data.id}" data-value="${data.value}">
                ${this.customSelectOptions.showIcons ? '<i class="fa fa-circle-o custom-choice-icon"></i>' : ''}
                ${data.label}
              </div>
            `);
          }
        };
      }
    };
  }

  // Custom method for additional functionality
  addCustomOption(value: any, label: any, icon = null) {
    const option: any = {
      value: this.getOptionValue(value),
      label: label,
      icon: icon
    };

    if (this.customSelectOptions.showIcons && icon) {
      option.customData = { icon };
    }

    this.addOption(option.value, option.label);
  }

  // Override setValue to handle custom data
  setValue(value: any, flags = {}) {
    const changed = super.setValue(value, flags);
    
    // Emit custom event for Next.js integration
    if (changed && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('customSelectChange', {
        detail: {
          component: this,
          value: value,
          key: this.component.key
        }
      }));
    }
    
    return changed;
  }

  // Add validation specific to custom select
  validateValueAvailability(setting: any, value: any) {
    const isValid = super.validateValueAvailability(setting, value);
    
    // Add custom validation logic here
    if (this.customSelectOptions.requireCustomValidation) {
      // Custom validation logic
      return isValid && this.customValidateValue(value);
    }
    
    return isValid;
  }

  customValidateValue(value: any) {
    // Implement custom validation logic
    return true;
  }
}
