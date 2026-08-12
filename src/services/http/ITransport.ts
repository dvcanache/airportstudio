export interface ITransport {
  post<T>(url: string, data: unknown): Promise<T>;
}
