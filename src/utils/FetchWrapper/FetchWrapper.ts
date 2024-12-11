export default class FetchWrapper {
  constructor(
    private baseUrl: string,
    private token: string
  ) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `${this.token}`,
    }
  }

  async get(url: string) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: this.getHeaders(),
    })
    return response
  }

  async post(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      ...options,
    })

    return response
  }
}
