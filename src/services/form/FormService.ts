import { ITransport } from '../http/ITransport.js';

export interface FormSubmissionData {
  nombre: string;
  empresa: string;
  email: string;
  servicio: string;
  mensaje: string;
  _subject: string;
}

export class FormService {
  constructor(
    private transport: ITransport,
    private endpoint: string,
  ) {}

  async submit(data: FormSubmissionData): Promise<void> {
    await this.transport.post(this.endpoint, data);
  }
}
