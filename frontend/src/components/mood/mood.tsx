import React from 'react';
import { Components } from 'formiojs';
import { createRoot, Root } from 'react-dom/client';
export function withDefaults(base: Record<string, any>, ...extend: Record<string, any>[]) {
  return Object.assign({}, base, ...extend);
}
/**
 * React UI for Mood Selector
 */
const MoodSelector = ({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const moods = ['😄', '😐', '😢'];
  const labels = ['happy', 'neutral', 'sad'];

  return (
    <div style={{ fontSize: '2rem', display: 'flex', gap: '1rem' }}>
      {moods.map((mood, index) => (
        <span
          key={mood}
          onClick={() => onChange(labels[index])}
          style={{
            cursor: 'pointer',
            borderBottom: value === labels[index] ? '2px solid blue' : 'none'
          }}
        >
          {mood}
        </span>
      ))}
    </div>
  );
};

/**
 * Form.io Custom Component: Mood Selector
 */
export default class MoodComponent extends Components.components.field {
  private reactRoot?: Root;

   static schema(...extend: any[]): any {
    return Components.components.field.schema({
      type: 'mood',
      label: 'Mood Selector',
      key: 'mood',
      input: true,
      defaultValue: 'neutral',
      ...extend[0]
    });
  }

  static get builderInfo() {
    return {
      title: 'Mood Selector',
      icon: 'smile',
      group: 'basic',
      weight: 90,
      schema: MoodComponent.schema()
    };
  }

  render(): string {
    return super.render(
      this.renderTemplate('input', {
        label: this.component.label, // ✅ Shows dynamic label
        input: `
          <div ref="input">
            <span style="font-size: 2rem;">🙂</span>
            <small style="display: block; color: #666;">(Mood will appear here)</small>
          </div>
        `
      })
    );
  }

  attach(element: HTMLElement): any {
    super.attach(element);

    const container = element.querySelector('[ref="input"]') as HTMLElement | null;

    if (container) {
      this.reactRoot = createRoot(container);
      this.reactRoot.render(
        <MoodSelector
          value={this.getValue()}
          onChange={(val) => this.setValue(val, { modified: true })}
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

  getValue(): string {
    return super.getValue() ?? 'neutral';
  }

  setValue(value: string, flags?: any): boolean {
    return super.setValue(value, flags);
  }
}
