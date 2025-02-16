export default class FetchWrapper {
  constructor(
    private baseUrl: string,
    private token: string
  ) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `${this.token}`,
    } as HeadersInit
  }

  async get(url: string) {
    console.log('ola', url)
    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    console.log('olhjaaa', response)
    return response
  }

  async post(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: this.getHeaders(),
      ...options,
    })

    return response
  }

  async postNoToken(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' } as HeadersInit,
      ...options,
    })

    return response
  }

  async delete(url: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    })

    return response
  }
}
