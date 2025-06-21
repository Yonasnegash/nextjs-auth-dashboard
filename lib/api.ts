interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  user?: T
  token?: string
}

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || "An error occurred",
          status: response.status,
        } as ApiError
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        } as ApiError
      }
      throw error
    }
  }

  async register(userData: {
    method: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }): Promise<ApiResponse> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }
}

export const apiClient = new ApiClient()
export type { ApiError, ApiResponse }
