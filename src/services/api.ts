import { Employee } from './mockData';
import { apiClient } from './apiClient';

export async function login(email: string, password: string) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await apiClient.get('/employees');
  return response.data;
}

export async function createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
  const response = await apiClient.post('/employees', data);
  return response.data;
}

export async function updateEmployee(id: number, data: Omit<Employee, 'id'>): Promise<Employee> {
  const response = await apiClient.put(`/employees/${id}`, data);
  return response.data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}
