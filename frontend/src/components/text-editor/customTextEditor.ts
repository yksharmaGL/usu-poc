import { Components } from 'formiojs';
import editForm from './textEditor.form';

const FieldComponent = (Components as any).components.field;

export default class TextEditorComponent extends FieldComponent {
    private quill!: any;
    private container!: HTMLDivElement;

    static schema(...extend: any[]) {
        return FieldComponent.schema({
            type: 'textEditor',
            label: 'Rich Text Editor',
            key: 'textEditor',
            input: true,
            tableView: false,
            persistent: true,
            placeholder: 'Type @ to mention…',
            rows: 6,
            mentionConfig: {
                usersApiUrl: '/api/users/search',
                minChars: 1,
                maxResults: 5
            }
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Rich Text Editor',
            group: 'advanced',
            icon: 'fa fa-edit',
            weight: 85,
            documentation: '/developers/custom-components#text-editor',
            schema: TextEditorComponent.schema()
        };
    }

    static editForm = editForm;

    attach(element: HTMLElement) {
        super.attach(element);

        // Hide default textarea
        const input = this.refs.input as HTMLTextAreaElement;
        if (input) input.style.display = 'none';

        // Create div for Quill
        this.container = document.createElement('div');
        this.container.style.height = `${this.component.rows * 20}px`;
        element.appendChild(this.container);

        // Initialize Quill+mentions
        this.initEditor();

        return element;
    }

    private async initEditor() {
        const Quill = await this.loadQuill();
        const Mention = await this.loadMention();
        if (Mention) {
            Quill.register('modules/mention', Mention);
        }

        this.quill = new Quill(this.container, {
            theme: 'snow',
            placeholder: this.component.placeholder,
            modules: {
                toolbar: [['bold', 'italic'], ['link'], ['clean']],
                mention: {
                    mentionDenotationChars: ['@'],
                    source: this.mentionSource.bind(this)
                }
            }
        });

        if (this.dataValue) {
            this.quill.root.innerHTML = this.dataValue;
        }

        this.quill.on('text-change', () => {
            this.setValue(this.quill.root.innerHTML, {});  // Add empty flags object
        });
    }

    private async loadQuill(): Promise<any> {
        if ((window as any).Quill) return (window as any).Quill;
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
        document.head.appendChild(css);
        await new Promise<void>((res, rej) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
            s.onload = () => res();
            s.onerror = () => rej();
            document.head.appendChild(s);
        });
        return (window as any).Quill;
    }

    private async loadMention(): Promise<any> {
        if ((window as any).QuillMention) return (window as any).QuillMention;
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/quill-mention@4.0.0/dist/quill.mention.min.css';
        document.head.appendChild(css);
        await new Promise<void>((res, rej) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/quill-mention@4.0.0/dist/quill.mention.min.js';
            s.onload = () => res();
            s.onerror = () => rej();
            document.head.appendChild(s);
        });
        return (window as any).QuillMention;
    }

    private async mentionSource(searchTerm: string, renderList: Function) {
        const cfg = this.component.mentionConfig;
        if (searchTerm.length < cfg.minChars) {
            return renderList([], searchTerm);
        }
        try {
            const res = await fetch(
                `${cfg.usersApiUrl}?q=${encodeURIComponent(searchTerm)}&limit=${cfg.maxResults}`
            );
            const json = await res.json();
            const list = (json.users || json).map((u: any) => ({
                id: u.id,
                value: `${u.firstName} ${u.lastName}`
            }));
            renderList(list, searchTerm);
        } catch {
            renderList([], searchTerm);
        }
    }

    getValue() {
        return this.quill?.root.innerHTML || '';
    }

    setValue(value: any, flags?: any) {
        const changed = super.setValue(value, flags);
        if (this.quill && this.quill.root.innerHTML !== value) {
            this.quill.root.innerHTML = value;
        }
        return changed;
    }
}

