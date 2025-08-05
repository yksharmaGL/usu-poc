interface TextEditorTemplateContext {
  component: any;
  isBuilderMode: boolean;
  height: number;
  placeholder: string;
  value: string;
  editorId: string;
  showWordCount: boolean;
}

export default function textEditorTemplate(ctx: TextEditorTemplateContext): string {
  const { 
    component, 
    isBuilderMode, 
    height,
    placeholder,
    value,
    editorId,
    showWordCount
  } = ctx;

  return `
    ${component.description ? `
      <div class="form-text text-muted mb-3">
        ${component.description}
      </div>
    ` : ''}

    <div class="text-editor-wrapper">
      ${isBuilderMode ? `
        <!-- Builder Mode Preview -->
        <div class="text-editor-preview border rounded p-4 text-center bg-light" 
             style="height: ${height}px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <i class="fa fa-edit fa-3x text-primary mb-3"></i>
          <h5 class="text-dark mb-2">TinyMCE Rich Text Editor</h5>
          <p class="text-muted mb-3">Professional WYSIWYG editor with advanced features</p>
          
          <div class="features mb-3">
            <span class="badge bg-primary me-1">Rich Formatting</span>
            <span class="badge bg-success me-1">Tables</span>
            <span class="badge bg-info me-1">Images</span>
            <span class="badge bg-warning me-1">Links</span>
            <span class="badge bg-secondary">Code View</span>
          </div>
          
          <div class="config-info text-muted small">
            <div><strong>Height:</strong> ${height}px</div>
            <div><strong>Placeholder:</strong> "${placeholder}"</div>
            ${component.enableWordCount ? '<div><strong>Word Count:</strong> Enabled</div>' : ''}
          </div>
        </div>
      ` : `
        <!-- Runtime Editor -->
        <div class="text-editor-runtime">
          <!-- TinyMCE Editor Container -->
          <textarea id="${editorId}" class="tinymce-editor" style="height: ${height}px;">${value}</textarea>
          
          <!-- Fallback Textarea (hidden by default) -->
          <textarea class="form-control fallback-textarea" 
                    style="height: ${height}px; display: none; resize: vertical;" 
                    placeholder="${placeholder}">${value}</textarea>
          
          <!-- Word Count Display -->
          ${showWordCount ? `
            <div class="editor-footer mt-2 p-2 bg-light border rounded text-end">
              <small class="text-muted word-count-display">0 words</small>
            </div>
          ` : ''}
        </div>
      `}
    </div>

    ${component.tooltip ? `
      <div class="form-text mt-2">
        <small class="text-info">
          <i class="fa fa-info-circle"></i> ${component.tooltip}
        </small>
      </div>
    ` : ''}

    <style>
      .text-editor-wrapper {
        position: relative;
      }
      
      .text-editor-preview {
        border: 2px dashed #007bff !important;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
      }
      
      .features .badge {
        font-size: 0.7rem;
        margin: 2px;
      }
      
      .config-info div {
        margin: 2px 0;
      }
      
      /* TinyMCE Custom Styling */
      .tox-tinymce {
        border-radius: 0.375rem !important;
        border: 1px solid #ced4da !important;
      }
      
      .tox-toolbar {
        background: #f8f9fa !important;
        border-bottom: 1px solid #dee2e6 !important;
      }
      
      .tox-edit-area {
        background: white !important;
      }
      
      .tox-statusbar {
        background: #f8f9fa !important;
        border-top: 1px solid #dee2e6 !important;
      }
      
      /* Focus styles */
      .tox-tinymce.tox-tinymce--focus {
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
        border-color: #80bdff !important;
      }
      
      /* Error state */
      .has-error .tox-tinymce {
        border-color: #dc3545 !important;
      }
      
      .has-error .tox-tinymce.tox-tinymce--focus {
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        border-color: #dc3545 !important;
      }
      
      .editor-footer {
        font-size: 0.875rem;
        border-top: 1px solid #dee2e6;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .tox-toolbar__group {
          flex-wrap: wrap;
        }
        
        .features .badge {
          font-size: 0.6rem;
          margin: 1px;
        }
      }
    </style>
  `;
}
