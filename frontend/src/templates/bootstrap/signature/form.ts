'use client'
interface SignatureTemplateContext {
  component: any;
  isBuilderMode: boolean;
  isEmpty: boolean;
  signatureData: any;
  footerLabel: string;
  backgroundColor: string;
  penColor: string;
  width: string;
  height: string;
  showFooter: boolean;
}

export default function signatureTemplate(ctx: SignatureTemplateContext): string {
  const { 
    component, 
    isBuilderMode, 
    isEmpty, 
    footerLabel, 
    backgroundColor, 
    penColor, 
    width, 
    height, 
    showFooter 
  } = ctx;

  return `
    <div class="formio-signature-wrapper" data-component-key="${component.key}">
      ${component.label && !component.hideLabel ? `
        <label class="control-label">
          ${component.label}
          ${component.validate?.required ? '<span class="field-required">*</span>' : ''}
        </label>
      ` : ''}

      ${component.description ? `
        <div class="form-text text-muted mb-3">
          ${component.description}
        </div>
      ` : ''}

      <!-- Signature Canvas Container -->
      <div class="signature-container">
        <div class="signature-pad-wrapper" style="width: ${width}; height: ${height};">
          ${isBuilderMode ? `
            <!-- Builder Mode Preview -->
            <div class="signature-builder-preview" 
                 style="background-color: ${backgroundColor}; width: 100%; height: 100%; border: 1px solid #ccc;">
              <div class="signature-placeholder">
                <i class="fa fa-pencil fa-2x text-muted"></i>
                <p class="text-muted mt-2">Signature Pad Preview</p>
              </div>
            </div>
          ` : `
            <!-- Runtime Canvas -->
            <canvas 
              ref="canvas" 
              class="signature-canvas"
              style="background-color: ${backgroundColor}; border: 1px solid #ccc; width: 100%; height: 100%; cursor: crosshair;"
              data-pen-color="${penColor}"
            ></canvas>
          `}
        </div>

        <!-- Signature Controls -->
        ${!isBuilderMode ? `
          <div class="signature-controls mt-2">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-secondary" ref="clearButton" title="Clear Signature">
                <i class="fa fa-eraser"></i> Clear
              </button>
              <button type="button" class="btn btn-outline-secondary" ref="undoButton" title="Undo Last Stroke">
                <i class="fa fa-undo"></i> Undo
              </button>
              <button type="button" class="btn btn-outline-primary" ref="downloadButton" title="Download Signature">
                <i class="fa fa-download"></i> Download
              </button>
            </div>
            
            <div class="signature-status ms-3">
              <small class="text-muted">
                ${isEmpty ? 'No signature' : 'Signature captured'}
                <span class="signature-indicator ${isEmpty ? 'empty' : 'filled'}"></span>
              </small>
            </div>
          </div>
        ` : ''}

        <!-- Footer Label -->
        ${showFooter && footerLabel ? `
          <div class="signature-footer mt-2">
            <small class="text-muted">${footerLabel}</small>
          </div>
        ` : ''}
      </div>

      <!-- Signature Preview (when filled) -->
      ${!isBuilderMode && !isEmpty ? `
        <div class="signature-preview mt-3" ref="signaturePreview">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <small class="text-muted">Signature Preview</small>
              <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('.formio-signature-wrapper').querySelector('[ref=clearButton]').click()">
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <div class="card-body p-2">
              <canvas class="signature-preview-canvas" style="max-width: 100%; height: auto; border: 1px solid #e9ecef;"></canvas>
            </div>
          </div>
        </div>
      ` : ''}

      ${component.tooltip ? `
        <div class="form-text">
          <small class="text-info">
            <i class="fa fa-info-circle"></i> ${component.tooltip}
          </small>
        </div>
      ` : ''}

      <style>
        .formio-signature-wrapper {
          margin-bottom: 1rem;
        }
        
        .signature-container {
          position: relative;
        }
        
        .signature-pad-wrapper {
          position: relative;
          min-height: 150px;
          max-width: 100%;
        }
        
        .signature-canvas {
          display: block;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .signature-builder-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
        }
        
        .signature-placeholder {
          text-align: center;
          padding: 2rem;
        }
        
        .signature-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .signature-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .signature-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
        
        .signature-indicator.empty {
          background-color: #dc3545;
        }
        
        .signature-indicator.filled {
          background-color: #28a745;
        }
        
        .signature-footer {
          text-align: center;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        
        .signature-preview-canvas {
          max-height: 100px;
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .signature-canvas {
            cursor: none;
          }
          
          .signature-controls .btn {
            padding: 0.5rem 1rem;
            font-size: 1rem;
          }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .signature-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .signature-status {
            justify-content: center;
            margin-top: 0.5rem;
          }
          
          .signature-pad-wrapper {
            min-height: 120px;
          }
        }
        
        /* Print styles */
        @media print {
          .signature-controls {
            display: none;
          }
          
          .signature-canvas {
            border: 1px solid #000;
          }
        }
      </style>
    </div>
  `;
}
