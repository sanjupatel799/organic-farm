const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private tokenGetter: () => string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.tokenGetter = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("accessToken");
      }
      return null;
    };
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }

    const token = this.tokenGetter();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, params?: Record<string, any>) {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: any; accessToken: string; refreshToken: string }>("/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<{ user: any; accessToken: string; refreshToken: string }>("/auth/register", data),
  getProfile: () => api.get<any>("/auth/profile"),
  updateProfile: (data: { name?: string; phone?: string }) => api.patch<any>("/auth/profile", data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post<any>("/auth/change-password", { oldPassword, newPassword }),
};

// Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ products: any[]; total: number; page: number; totalPages: number }>("/products", params),
  getBySlug: (slug: string) => api.get<any>(`/products/${slug}`),
  getRelated: (slug: string) => api.get<any[]>(`/products/${slug}/related`),
  getBestSellers: () => api.get<any[]>("/products/best-sellers"),
  getFeatured: () => api.get<any[]>("/products/featured"),
  create: (data: any) => api.post<any>("/products", data),
  update: (id: number, data: any) => api.patch<any>(`/products/${id}`, data),
  delete: (id: number) => api.delete<any>(`/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get<any[]>("/categories"),
  getBySlug: (slug: string) => api.get<any>(`/categories/${slug}`),
  create: (data: any) => api.post<any>("/categories", data),
  update: (id: number, data: any) => api.patch<any>(`/categories/${id}`, data),
  delete: (id: number) => api.delete<any>(`/categories/${id}`),
};

// Cart API
export const cartApi = {
  get: () => api.get<any>("/cart"),
  addItem: (productId: number, quantity?: number) =>
    api.post<any>("/cart/items", { productId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.patch<any>(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: number) => api.delete<any>(`/cart/items/${itemId}`),
  clear: () => api.delete<any>("/cart"),
};

// Orders API
export const ordersApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ orders: any[]; total: number; page: number; totalPages: number }>("/orders", params),
  getMyOrders: () => api.get<any[]>("/orders/my-orders"),
  getById: (id: number) => api.get<any>(`/orders/${id}`),
  create: (data: { addressId: number; couponCode?: string; paymentMethod?: string }) =>
    api.post<any>("/orders", data),
  updateStatus: (id: number, status: string) =>
    api.patch<any>(`/orders/${id}/status`, { status }),
  cancel: (id: number) => api.post<any>(`/orders/${id}/cancel`),
};

// Wishlist API
export const wishlistApi = {
  get: () => api.get<any[]>("/wishlist"),
  add: (productId: number) => api.post<any>("/wishlist", { productId }),
  remove: (productId: number) => api.delete<any>(`/wishlist/${productId}`),
  check: (productId: number) => api.get<boolean>(`/wishlist/check/${productId}`),
};

// Addresses API
export const addressesApi = {
  getAll: () => api.get<any[]>("/users/addresses"),
  create: (data: any) => api.post<any>("/users/addresses", data),
  update: (id: number, data: any) => api.patch<any>(`/users/addresses/${id}`, data),
  delete: (id: number) => api.delete<any>(`/users/addresses/${id}`),
};

// Coupons API
export const couponsApi = {
  validate: (code: string, subtotal?: number) =>
    api.get<any>(`/coupons/validate?code=${code}${subtotal ? `&subtotal=${subtotal}` : ""}`),
  getAll: () => api.get<any[]>("/coupons"),
  create: (data: any) => api.post<any>("/coupons", data),
  update: (id: number, data: any) => api.patch<any>(`/coupons/${id}`, data),
  delete: (id: number) => api.delete<any>(`/coupons/${id}`),
};

// Payments API
export const paymentsApi = {
  createOrder: (amount: number, currency?: string) =>
    api.post<any>("/payments/create-order", { amount, currency }),
  verify: (orderId: string, paymentId: string, signature: string) =>
    api.post<any>("/payments/verify", { orderId, paymentId, signature }),
};

// Blogs API
export const blogsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ blogs: any[]; total: number; page: number; totalPages: number }>("/blogs", params),
  getBySlug: (slug: string) => api.get<any>(`/blogs/${slug}`),
  create: (data: any) => api.post<any>("/blogs", data),
  update: (id: number, data: any) => api.patch<any>(`/blogs/${id}`, data),
  delete: (id: number) => api.delete<any>(`/blogs/${id}`),
};

// Contact API
export const contactApi = {
  send: (data: { name: string; email: string; message: string }) =>
    api.post<any>("/contact", data),
  getAll: (params?: Record<string, any>) =>
    api.get<{ messages: any[]; total: number }>("/contact", params),
  markAsRead: (id: number) => api.patch<any>(`/contact/${id}/read`),
  delete: (id: number) => api.delete<any>(`/contact/${id}`),
};

// Admin API
export const adminApi = {
  getDashboard: () => api.get<any>("/admin/dashboard"),
  getInventoryAlerts: () => api.get<any>("/admin/inventory-alerts"),
};

// Upload API
export const uploadsApi = {
  uploadSingle: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'Upload failed');
    }
    const data = await response.json();
    return data.url || data.secureUrl;
  },

  uploadMultiple: async (files: File[], folder?: string): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    if (folder) formData.append('folder', folder);

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'Upload failed');
    }
    const results = await response.json();
    return results.map((r: any) => r.url || r.secureUrl);
  },

  getUploadSignature: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/upload/signature`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to get upload signature');
    return response.json();
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: () => api.get<any>("/analytics/overview"),
  getMonthlySales: (year?: number) =>
    api.get<any[]>("/analytics/monthly-sales", year ? { year } : undefined),
  getTopProducts: (limit?: number) =>
    api.get<any[]>("/analytics/top-products", limit ? { limit } : undefined),
  getRevenueByPeriod: (period: string) =>
    api.get<any[]>("/analytics/revenue", { period }),
};
