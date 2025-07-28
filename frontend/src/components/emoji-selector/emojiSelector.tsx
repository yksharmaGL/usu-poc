import React from 'react';
import { Components } from 'formiojs';
import { createRoot, Root } from 'react-dom/client';
import './emoji.css'; // Optional: your emoji styles

const emojiList = ['😀', '😎', '🥳', '😢', '🤯'];

export default class EmojiSelectorComponent extends Components.components.field {
  private reactRoot?: Root;

  static schema(...extend: any[]): any {
    return Components.components.field.schema({
      type: 'emojiselect',
      label: 'Emoji Selector',
      key: 'emoji',
      inputType: 'string',
      input: true,
      defaultValue: '',
      ...extend[0]
    });
  }

  static get builderInfo() {
    return {
      title: 'Emoji Selector',
      group: 'basic',
      icon: 'smile',
      weight: 95,
      schema: EmojiSelectorComponent.schema()
    };
  }

  render(): string {
    return super.render(
      this.renderTemplate('input', {
        input: `<div ref="input" class="emoji-selector-preview">😊 Emoji loading...</div>`
      })
    );
  }

  attach(element: HTMLElement): any {
    super.attach(element);

    const container = element.querySelector('[ref="input"]') as HTMLElement | null;
    if (container) {
      this.reactRoot = createRoot(container);
      this.reactRoot.render(
        <div className="emoji-selector">
          {emojiList.map((emoji) => (
            <button
              key={emoji}
              className={`emoji-btn ${this.getValue() === emoji ? 'selected' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                void this.setValue(emoji, { modified: true });
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
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
    return super.getValue() ?? '';
  }

  setValue(value: string, flags: any): boolean {
    return super.setValue(value, flags);
  }
}
