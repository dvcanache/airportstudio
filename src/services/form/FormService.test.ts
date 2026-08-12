import { describe, it, expect, vi } from 'vitest';
import { FormService, FormSubmissionData } from './FormService';
import { ITransport } from '../http/ITransport';

describe('FormService', () => {
  it('should call transport.post with correct data', async () => {
    const mockTransport: ITransport = {
      post: vi.fn().mockResolvedValue({}),
    };
    const endpoint = 'https://example.com/api';
    const service = new FormService(mockTransport, endpoint);

    const testData: FormSubmissionData = {
      nombre: 'John Doe',
      empresa: 'Test Inc',
      email: 'john@example.com',
      servicio: 'Web Design',
      mensaje: 'Hello',
      _subject: 'New contact',
    };

    await service.submit(testData);

    expect(mockTransport.post).toHaveBeenCalledWith(endpoint, testData);
  });

  it('should propagate errors from transport', async () => {
    const mockTransport: ITransport = {
      post: vi.fn().mockRejectedValue(new Error('Network error')),
    };
    const service = new FormService(mockTransport, 'https://example.com/api');

    await expect(service.submit({} as FormSubmissionData)).rejects.toThrow('Network error');
  });
});
