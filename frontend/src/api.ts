import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

export default class LetterblendApi {
  private static _instance: LetterblendApi;

  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api/',
    });
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers['X-Letterboxd-User'] = localStorage.getItem('user');
      return config;
    });
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new LetterblendApi();
    }
    return this._instance;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.request(config).then((r) => {
      return r.data;
    });
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      ...config,
    });
  }

  async post<T>(url: string, data: object, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data: unrefDeep(data),
      ...config,
    });
  }

  async put<T>(url: string, data: object, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data: unrefDeep(data),
      ...config,
    });
  }

  async delete<T>(url: string, config: AxiosRequestConfig = {}) {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }
}
