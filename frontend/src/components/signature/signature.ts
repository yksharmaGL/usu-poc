'use client'
import { Components, Utils } from '@formio/js';
import editForm from './signature.form';
import { SignatureComponentSchema, SignatureData } from '../../types/formio';

const FieldComponent = (Components as any).components.field;

// Install signature_pad if not already installed
// npm install signature_pad @types/signature_pad

export default class SignatureComponent extends FieldComponent {
    public signaturePad: any = null;
    public canvas: HTMLCanvasElement | null = null;
    public signatureData: SignatureData | null = null;
    public isEmpty: boolean = true;

    declare component: SignatureComponentSchema;

    static schema(...extend: any[]): SignatureComponentSchema {
        return FieldComponent.schema({
            type: 'signature',
            label: 'Signature',
            key: 'signature',
            input: true,
            tableView: false,

            // Signature-specific properties
            footerLabel: 'Sign above',
            backgroundColor: 'rgb(245,245,235)',
            penColor: 'black',
            minWidth: 0.5,
            maxWidth: 2.5,
            width: '100%',
            height: '150px',

            // Signature options
            signatureOptions: {
                provider: 'default',
                velocityFilterWeight: 0.7,
                minDistance: 5,
                throttle: 16,
                dotSize: 1,
                strokeStyle: 'black',
                lineWidth: 2
            },

            // Display options
            showFooter: true,
            clearOnResize: false,

            // Validation
            validate: {
                required: false,
                custom: '',
                customMessage: ''
            }
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Signature',
            group: 'premium',
            icon: 'fa fa-pencil',
            weight: 120,
            documentation: '/developers/custom-components#signature',
            schema: SignatureComponent.schema()
        };
    }

    static editForm = editForm;

    constructor(component: any, options: any, data: any) {
        super(component, options, data);
        this.initializeComponent();
    }

    get defaultSchema() {
        return SignatureComponent.schema();
    }

    get emptyValue() {
        return null;
    }

    get isBuilderMode() {
        return this.options && this.options.builder;
    }

    initializeComponent(): void {
        // Ensure component has required structure
        if (!this.component.signatureOptions) {
            this.component.signatureOptions = {
                provider: 'default',
                velocityFilterWeight: 0.7,
                minDistance: 5,
                throttle: 16,
                dotSize: 1,
                strokeStyle: 'black',
                lineWidth: 2
            };
        }

        if (!this.component.footerLabel) {
            this.component.footerLabel = 'Sign above';
        }

        if (!this.component.backgroundColor) {
            this.component.backgroundColor = 'rgb(245,245,235)';
        }

        if (!this.component.penColor) {
            this.component.penColor = 'black';
        }
    }

    async loadSignaturePad(): Promise<void> {
        if (typeof window === 'undefined' || this.isBuilderMode) return;

        try {
            // Dynamic import of signature_pad
            const SignaturePad = (await import('signature_pad')).default;

            if (this.canvas && !this.signaturePad) {
                this.signaturePad = new SignaturePad(this.canvas, {
                    backgroundColor: this.component.backgroundColor || 'rgb(245,245,235)',
                    penColor: this.component.penColor || 'black',
                    minWidth: this.component.minWidth || 0.5,
                    maxWidth: this.component.maxWidth || 2.5,
                    velocityFilterWeight: this.component.signatureOptions?.velocityFilterWeight || 0.7,
                    minDistance: this.component.signatureOptions?.minDistance || 5,
                    throttle: this.component.signatureOptions?.throttle || 16,
                    dotSize: this.component.signatureOptions?.dotSize || 1,
                });

                this.signaturePad.onBegin = () => {
                    this.emit('signatureBegin');
                };
                this.signaturePad.onEnd = () => {
                    this.handleSignatureEnd();
                };
                // Set canvas size
                this.resizeCanvas();

                // Handle window resize
                if (this.component.clearOnResize) {
                    this.addEventListener(window, 'resize', () => {
                        this.resizeCanvas();
                        this.signaturePad.clear();
                    });
                } else {
                    this.addEventListener(window, 'resize', () => {
                        this.resizeCanvas();
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load signature pad:', error);
        }
    }

    resizeCanvas(): void {
        if (!this.canvas) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * ratio;
        this.canvas.height = rect.height * ratio;
        this.canvas.getContext('2d')!.scale(ratio, ratio);

        if (this.signaturePad) {
            this.signaturePad.clear();

            // Restore signature if exists
            if (this.dataValue && !this.isEmpty) {
                this.signaturePad.fromDataURL(this.dataValue);
            }
        }
    }

    handleSignatureEnd(): void {
        if (!this.signaturePad) return;

        this.isEmpty = this.signaturePad.isEmpty();

        if (!this.isEmpty) {
            const signatureDataUrl = this.signaturePad.toDataURL();
            this.signatureData = {
                signature: signatureDataUrl,
                isEmpty: false,
                timestamp: Date.now()
            };

            this.setValue(signatureDataUrl);
            this.emit('signatureEnd', this.signatureData);
        } else {
            this.signatureData = null;
            this.setValue(null);
        }
    }

    clearSignature(): void {
        if (this.signaturePad) {
            this.signaturePad.clear();
            this.isEmpty = true;
            this.signatureData = null;
            this.setValue(null);
            this.emit('signatureCleared');
        }
    }

    undoSignature(): void {
        if (this.signaturePad && this.signaturePad.data && this.signaturePad.data.length > 0) {
            this.signaturePad.data.pop();
            this.signaturePad._reset();
            this.signaturePad._draw();
            this.handleSignatureEnd();
        }
    }

    downloadSignature(format: 'png' | 'jpeg' | 'svg' = 'png'): void {
        if (!this.signaturePad || this.isEmpty) return;

        let dataUrl: string;
        let filename: string;

        switch (format) {
            case 'jpeg':
                dataUrl = this.signaturePad.toDataURL('image/jpeg');
                filename = `signature-${Date.now()}.jpg`;
                break;
            case 'svg':
                dataUrl = 'data:image/svg+xml;base64,' + btoa(this.signaturePad.toSVG());
                filename = `signature-${Date.now()}.svg`;
                break;
            default:
                dataUrl = this.signaturePad.toDataURL();
                filename = `signature-${Date.now()}.png`;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }

    // Form.io integration methods
    render() {
        return super.render(this.renderTemplate('signature', {
            component: this.component,
            isBuilderMode: this.isBuilderMode,
            isEmpty: this.isEmpty,
            signatureData: this.signatureData,
            footerLabel: this.component.footerLabel || 'Sign above',
            backgroundColor: this.component.backgroundColor || 'rgb(245,245,235)',
            penColor: this.component.penColor || 'black',
            width: this.component.width || '100%',
            height: this.component.height || '150px',
            showFooter: this.component.showFooter !== false
        }));
    }

    attach(element: HTMLElement) {
        this.loadRefs(element, {
            canvas: 'single',
            clearButton: 'single',
            undoButton: 'single',
            downloadButton: 'single',
            signaturePreview: 'single'
        });

        this.attachEventListeners();

        return super.attach(element);
    }

    attachEventListeners(): void {
        // Get canvas reference
        if (this.refs.canvas) {
            this.canvas = this.refs.canvas as HTMLCanvasElement;
            this.loadSignaturePad();
        }

        // Clear button
        if (this.refs.clearButton) {
            this.addEventListener(this.refs.clearButton, 'click', (event: Event) => {
                event.preventDefault();
                this.clearSignature();
            });
        }

        // Undo button
        if (this.refs.undoButton) {
            this.addEventListener(this.refs.undoButton, 'click', (event: Event) => {
                event.preventDefault();
                this.undoSignature();
            });
        }

        // Download button
        if (this.refs.downloadButton) {
            this.addEventListener(this.refs.downloadButton, 'click', (event: Event) => {
                event.preventDefault();
                this.downloadSignature('png');
            });
        }
    }

    detach(): void {
        if (this.signaturePad) {
            this.signaturePad.off();
            this.signaturePad = null;
        }
        this.canvas = null;
        super.detach();
    }

    getValue() {
        return this.signatureData?.signature || this.dataValue || null;
    }

    setValue(value: any, flags: any = {}) {
        const changed = super.setValue(value, flags);

        if (changed && this.signaturePad && value) {
            try {
                this.signaturePad.fromDataURL(value);
                this.isEmpty = false;
                this.signatureData = {
                    signature: value,
                    isEmpty: false,
                    timestamp: Date.now()
                };
            } catch (error) {
                console.error('Failed to load signature from data URL:', error);
            }
        } else if (changed && !value) {
            this.clearSignature();
        }

        return changed;
    }

    checkValidity(data?: any, dirty?: boolean, row?: any) {
        const isValid = super.checkValidity(data, dirty, row);

        if (this.component.validate?.required && this.isEmpty) {
            this.setCustomValidity('Signature is required', dirty);
            return false;
        }

        return isValid;
    }

    getValueAsString(value?: any): string {
        if (!value) return '';

        if (typeof value === 'string' && value.startsWith('data:image')) {
            return '[Signature]';
        }

        return value.toString();
    }
}
