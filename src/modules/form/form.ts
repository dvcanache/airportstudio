import { getRequiredElement } from '../../shared/dom/dom.js';
import { FormService, FormSubmissionData } from '../../services/form/FormService.js';

export interface FormConfig {
  formSelector: string;
  submitButtonSelector: string;
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;
  requiredFieldsMessage: string;
  resetTimeout: number;
}

export const DEFAULT_FORM_CONFIG: FormConfig = {
  formSelector: '.cform',
  submitButtonSelector: '#submit-btn',
  successMessage: '✅ Enviado — Te contactamos pronto',
  errorMessage: '❌ Error — Contáctanos directamente',
  loadingMessage: '✈ Enviando...',
  requiredFieldsMessage: '⚠ Completa los campos requeridos',
  resetTimeout: 5000,
};

export class ContactForm {
  private formContainer: HTMLElement;
  private submitBtn: HTMLButtonElement;

  constructor(
    private formService: FormService,
    private config: FormConfig = DEFAULT_FORM_CONFIG,
  ) {
    this.formContainer = getRequiredElement<HTMLElement>(this.config.formSelector);
    this.submitBtn = getRequiredElement<HTMLButtonElement>(this.config.submitButtonSelector);
  }

  public init(): void {
    this.submitBtn.addEventListener('click', () => this.handleSubmit());
  }

  private async handleSubmit(): Promise<void> {
    const data = this.getFormData();

    if (!this.validate(data)) {
      this.showStatus(this.config.requiredFieldsMessage, 3000);
      return;
    }

    this.setLoading(true);

    try {
      await this.formService.submit(data);
      this.showSuccess();
      this.resetForm();
    } catch {
      this.showStatus(this.config.errorMessage, this.config.resetTimeout);
    } finally {
      this.setLoading(false);
    }
  }

  private getFormData(): FormSubmissionData {
    const nombre = getRequiredElement<HTMLInputElement>(
      'input[placeholder="Tu nombre completo"]',
      this.formContainer,
    ).value;
    const empresa =
      (
        this.formContainer.querySelector(
          'input[placeholder="Nombre de tu empresa"]',
        ) as HTMLInputElement | null
      )?.value || '';
    const email = getRequiredElement<HTMLInputElement>(
      'input[type="email"]',
      this.formContainer,
    ).value;
    const servicio = getRequiredElement<HTMLSelectElement>('select', this.formContainer).value;
    const mensaje = getRequiredElement<HTMLTextAreaElement>('textarea', this.formContainer).value;

    return {
      nombre,
      empresa,
      email,
      servicio,
      mensaje,
      _subject: `Nuevo contacto — ${nombre}`,
    };
  }

  private validate(data: FormSubmissionData): boolean {
    return !!(data.nombre && data.email && data.mensaje);
  }

  private setLoading(isLoading: boolean): void {
    this.submitBtn.disabled = isLoading;
    if (isLoading) {
      this.submitBtn.textContent = this.config.loadingMessage;
    } else {
      setTimeout(() => {
        this.submitBtn.textContent = 'Enviar Mensaje →';
      }, this.config.resetTimeout);
    }
  }

  private showSuccess(): void {
    this.submitBtn.textContent = this.config.successMessage;
    this.submitBtn.style.background = '#1a1a18';
    this.submitBtn.style.color = '#f2f2f0';

    setTimeout(() => {
      this.submitBtn.style.background = '';
      this.submitBtn.style.color = '';
    }, this.config.resetTimeout);
  }

  private showStatus(message: string, timeout: number): void {
    const originalText = this.submitBtn.textContent;
    this.submitBtn.textContent = message;
    setTimeout(() => {
      this.submitBtn.textContent = originalText;
    }, timeout);
  }

  private resetForm(): void {
    this.formContainer.querySelectorAll('input, textarea').forEach((el) => {
      (el as HTMLInputElement | HTMLTextAreaElement).value = '';
    });
    getRequiredElement<HTMLSelectElement>('select', this.formContainer).selectedIndex = 0;
  }
}
