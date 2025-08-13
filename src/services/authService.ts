const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  name: string;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    token_type: string;
    user: User;
  };
}

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginData {
  identifier: string; // email or username
  password: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.success && data.data) {
        this.setAuthData(data.data.access_token, data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
      };
    }
  }

  async signin(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.success && data.data) {
        this.setAuthData(data.data.access_token, data.data.user);
      }

      return data;
    } catch (error) {
      console.error('Signin error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.user) {
          this.user = data.data.user;
          localStorage.setItem('auth_user', JSON.stringify(this.user));
          return this.user;
        }
      } else if (response.status === 401) {
        // Token is invalid, clear auth data
        this.clearAuthData();
      }
    } catch (error) {
      console.error('Get current user error:', error);
    }

    return null;
  }

  async getDashboardData(): Promise<any> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 401) {
        // Token is invalid, clear auth data
        this.clearAuthData();
      }
    } catch (error) {
      console.error('Get dashboard data error:', error);
    }

    return null;
  }

  private setAuthData(token: string, user: User): void {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }
}

export const authService = new AuthService();
