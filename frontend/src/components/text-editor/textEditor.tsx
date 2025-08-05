import { Components } from '@formio/js';
import editForm from './textEditor.form';

const TextareaComponent = (Components as any).components.textarea;

export default class TextEditorComponent extends TextareaComponent {
  
  static schema(...extend: any[]) {
    return TextareaComponent.schema({
      type: 'textEditor',
      label: 'Rich Text Editor',
      key: 'textEditor',
      input: true,
      tableView: false,
      persistent: true,
      
      // Enable WYSIWYG with Quill
      wysiwyg: true,
      
      // Basic Quill configuration
      wysiwygConfig: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        },
        mention: {}
      },
      
      // API Configuration for mentions (serializable data only)
      mentionConfig: {
        usersApiUrl: '/api/users/search',
        hashtagsApiUrl: '/api/hashtags/search',
        searchDelay: 300,
        maxResults: 10,
        minChars: 1,
        enableMentions: true,
        enableUsers: true,
        enableHashtags: false
      },
      
      placeholder: 'Type @ to mention users...',
      rows: 8,
      enableSpellcheck: true,
      enableWordCount: true,
      enableCharacterCount: false
      
    }, ...extend);
  }

  // FIXED: Use static getter instead of static property
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

  constructor(component: any, options: any, data: any) {
    super(component, options, data);
    
    if (this.component.wysiwyg === undefined) {
      this.component.wysiwyg = true;
    }
  }

  get defaultSchema() {
    return TextEditorComponent.schema();
  }

  get emptyValue() {
    return '';
  }

  // Override the widget creation to add mention support
  createWidget() {
    const widget = super.createWidget();
    
    // Only setup mentions in runtime mode, not in builder
    if (!this.options?.builder && this.component.mentionConfig?.enableMentions) {
      setTimeout(() => {
        this.setupMentions();
      }, 1000);
    }
    
    return widget;
  }

  async setupMentions(): Promise<void> {
    try {
      // Load CSS from CDN
      if (!document.getElementById('quill-mention-css')) {
        const link = document.createElement('link');
        link.id = 'quill-mention-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/quill-mention@4.0.0/dist/quill.mention.min.css';
        document.head.appendChild(link);
      }

      // Load JS from CDN
      if (!document.getElementById('quill-mention-js')) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'quill-mention-js';
          script.src = 'https://cdn.jsdelivr.net/npm/quill-mention@4.0.0/dist/quill.mention.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load quill-mention from CDN'));
          document.head.appendChild(script);
        });
      }

      const quill = (this as any).quill;
      if (!quill) {
        console.warn('Quill instance not found');
        return;
      }

      const mentionConfig = {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: this.getMentionChars(),
        source: this.createMentionSource(),
        showDenotationChar: true,
        blotName: 'mention',
        dataAttributes: ['id','value','denotationChar','link','target','email','avatar'],
        renderItem: this.createRenderItem(),
        onSelect: this.createOnSelect()
      };

      // Add mention module
      if (!quill.getModule('mention')) {
        quill.addModule('mention', mentionConfig);
      }

      console.log('Mentions setup completed');
      
    } catch (error) {
      console.error('Failed to setup mentions:', error);
    }
  }

  getMentionChars(): string[] {
    const chars = [];
    const config = this.component.mentionConfig || {};
    
    if (config.enableUsers !== false) chars.push('@');
    if (config.enableHashtags) chars.push('#');
    
    return chars;
  }

  createMentionSource() {
    return async (searchTerm: string, renderList: any, mentionChar: string) => {
      try {
        let results = [];
        
        if (mentionChar === '@' && this.component.mentionConfig?.enableUsers !== false) {
          results = await this.searchUsers(searchTerm);
        } else if (mentionChar === '#' && this.component.mentionConfig?.enableHashtags) {
          results = await this.searchHashtags(searchTerm);
        }
        
        renderList(results, searchTerm);
      } catch (error) {
        console.error('Error fetching mentions:', error);
        renderList([], searchTerm);
      }
    };
  }

  createRenderItem() {
    return (item: any, searchTerm: string) => {
      return `
        <div class="mention-item">
          <div class="mention-item-content">
            ${item.avatar 
              ? `<img src="${item.avatar}" alt="${item.value}" class="mention-avatar">` 
              : `<div class="mention-avatar-placeholder">${item.value.charAt(0).toUpperCase()}</div>`
            }
            <div class="mention-details">
              <div class="mention-name">${item.value}</div>
              ${item.email ? `<div class="mention-email">${item.email}</div>` : ''}
              ${item.department ? `<div class="mention-department">${item.department}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    };
  }

  createOnSelect() {
    return (item: any, insertItem: any) => {
      console.log('Mention selected:', item);
      insertItem(item);
      
      this.emit('mentionSelected', {
        mention: item,
        component: this.component
      });
    };
  }

  async searchUsers(searchTerm: string): Promise<any[]> {
    const config = this.component.mentionConfig || {};
    const apiUrl = config.usersApiUrl || '/api/users/search';
    const maxResults = config.maxResults || 10;
    
    try {
      const response = await fetch(`${apiUrl}?q=${encodeURIComponent(searchTerm)}&limit=${maxResults}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return (data.users || data).map((user: any) => ({
        id: user.id || user.userId,
        value: user.displayName || user.name || `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: user.avatar || user.profilePicture,
        department: user.department || user.team,
        link: user.profileUrl || `mailto:${user.email}`,
        target: '_blank'
      }));
      
    } catch (error) {
      console.error('Error searching users:', error);
      
      // Fallback to mock data for development
      return this.getMockUsers().filter(user => 
        user.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  async searchHashtags(searchTerm: string): Promise<any[]> {
    const config = this.component.mentionConfig || {};
    const apiUrl = config.hashtagsApiUrl || '/api/hashtags/search';
    const maxResults = config.maxResults || 10;
    
    try {
      const response = await fetch(`${apiUrl}?q=${encodeURIComponent(searchTerm)}&limit=${maxResults}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return (data.hashtags || data).map((hashtag: any) => ({
        id: hashtag.id || hashtag.name,
        value: hashtag.name || hashtag.value,
        description: hashtag.description,
        count: hashtag.count || hashtag.usageCount,
        category: hashtag.category
      }));
      
    } catch (error) {
      console.error('Error searching hashtags:', error);
      
      return this.getMockHashtags().filter(hashtag => 
        hashtag.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  getMockUsers(): any[] {
    return [
      {
        id: 1,
        value: 'John Doe',
        email: 'john.doe@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        department: 'Engineering'
      },
      {
        id: 2,
        value: 'Jane Smith',
        email: 'jane.smith@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        department: 'Design'
      },
      {
        id: 3,
        value: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        department: 'Marketing'
      },
      {
        id: 4,
        value: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        department: 'Sales'
      }
    ];
  }

  getMockHashtags(): any[] {
    return [
      { id: 1, value: 'urgent', description: 'High priority items', count: 45 },
      { id: 2, value: 'feature-request', description: 'New feature suggestions', count: 23 },
      { id: 3, value: 'bug-report', description: 'Bug reports and issues', count: 67 },
      { id: 4, value: 'improvement', description: 'Enhancement suggestions', count: 34 }
    ];
  }

  attach(element: HTMLElement) {
    const result = super.attach(element);
    
    // Add mention styles
    this.addMentionStyles();
    
    // Add word count if enabled
    if (this.component.enableWordCount || this.component.enableCharacterCount) {
      setTimeout(() => this.addWordCountDisplay(), 1000);
    }
    
    return result;
  }

  addMentionStyles(): void {
    if (document.getElementById('mention-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'mention-styles';
    style.innerHTML = `
      .mention-item {
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
      }
      
      .mention-item:hover {
        background-color: #f5f5f5;
      }
      
      .mention-item-content {
        display: flex;
        align-items: center;
      }
      
      .mention-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
      }
      
      .mention-avatar-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #007bff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      }
      
      .mention-details {
        flex: 1;
      }
      
      .mention-name {
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }
      
      .mention-email {
        font-size: 12px;
        color: #666;
      }
      
      .mention-department {
        font-size: 11px;
        color: #999;
        font-style: italic;
      }
      
      .ql-mention-list-container {
        width: 300px !important;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .ql-mention-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      .ql-mention-list-item.selected {
        background-color: #e3f2fd !important;
      }
      
      .ql-mention-list-item {
        cursor: pointer;
      }
      
      span.mention {
        background-color: #e3f2fd;
        border-radius: 3px;
        padding: 2px 4px;
        color: #1976d2;
        text-decoration: none;
        cursor: pointer;
      }
      
      span.mention:hover {
        background-color: #bbdefb;
      }
    `;
    
    document.head.appendChild(style);
  }

  addWordCountDisplay(): void {
    const wordCountDiv = document.createElement('div');
    wordCountDiv.className = 'word-count-display mt-2 p-2 bg-light border rounded text-end';
    wordCountDiv.innerHTML = '<small class="text-muted">0 words</small>';
    
    if (this.element && this.refs.widget) {
      this.refs.widget.parentNode?.insertBefore(wordCountDiv, this.refs.widget.nextSibling);
      
      this.on('change', () => {
        this.updateWordCount(wordCountDiv);
      });
      
      setTimeout(() => this.updateWordCount(wordCountDiv), 1000);
    }
  }

  updateWordCount(wordCountElement: HTMLElement): void {
    const content = this.getValue() || '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const mentions = tempDiv.querySelectorAll('.mention, [data-mention]');
    mentions.forEach(mention => {
      const textNode = document.createTextNode(mention.textContent || '');
      mention.parentNode?.replaceChild(textNode, mention);
    });
    
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    const characters = text.length;

    let countText = '';
    if (this.component.enableWordCount && this.component.enableCharacterCount) {
      countText = `${words} words, ${characters} characters`;
    } else if (this.component.enableWordCount) {
      countText = `${words} words`;
    } else if (this.component.enableCharacterCount) {
      countText = `${characters} characters`;
    }

    const smallElement = wordCountElement.querySelector('small');
    if (smallElement) {
      smallElement.textContent = countText;
    }
  }

  getMentions(): any[] {
    const content = this.getValue() || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const mentions: any[] = [];
    const mentionElements = tempDiv.querySelectorAll('.mention, [data-mention]');
    
    mentionElements.forEach(element => {
      mentions.push({
        id: element.getAttribute('data-id'),
        value: element.getAttribute('data-value') || element.textContent,
        denotationChar: element.getAttribute('data-denotation-char'),
        email: element.getAttribute('data-email'),
        link: element.getAttribute('data-link')
      });
    });
    
    return mentions;
  }
}
