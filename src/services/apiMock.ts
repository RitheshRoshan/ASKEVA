import { apiClient } from './apiClient';
import { mockEmployees } from './mockData';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get/set employees in localStorage
const getStoredEmployees = () => {
  const data = localStorage.getItem('company_employees');
  if (!data) {
    localStorage.setItem('company_employees', JSON.stringify(mockEmployees));
    return mockEmployees;
  }
  return JSON.parse(data);
};

const setStoredEmployees = (employees: any[]) => {
  localStorage.setItem('company_employees', JSON.stringify(employees));
};

// Helper to get/set users in localStorage
const getStoredUsers = () => {
  const data = localStorage.getItem('company_users');
  if (!data) {
    const defaultUsers = [
      { email: 'admin@company.com', password: 'password123', name: 'Admin User' },
    ];
    localStorage.setItem('company_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(data);
};

const setStoredUsers = (users: any[]) => {
  localStorage.setItem('company_users', JSON.stringify(users));
};

// Seed initial database states
getStoredEmployees();
getStoredUsers();

// Intercept Axios requests with a custom adapter
apiClient.defaults.adapter = async (config) => {
  await delay(Math.random() * 300 + 200); // 200-500ms variable latency

  const { url, method, data } = config;
  const parsedData = data ? JSON.parse(data) : null;

  // Root URL matching relative to base
  const cleanUrl = url?.replace(/^\/?api\/v1\/?/, '') || '';

  // Log incoming request
  console.log(
    `%c[API Request] %c${method?.toUpperCase()} %c/api/v1${cleanUrl}`,
    'color: #3b82f6; font-weight: bold;',
    'color: #10b981; font-weight: bold;',
    'color: #475569; font-weight: medium;',
    parsedData ? { payload: parsedData } : ''
  );

  try {
    // 1. Auth Routing: POST /auth/login
    if (cleanUrl === '/auth/login' && method?.toUpperCase() === 'POST') {
      const { email, password } = parsedData || {};
      const users = getStoredUsers();
      const matchedUser = users.find(
        (u: any) => u.email.toLowerCase() === email?.toLowerCase() && u.password === password
      );

      if (matchedUser) {
        const resData = {
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-${matchedUser.email}`,
          user: { name: matchedUser.name, email: matchedUser.email },
        };
        console.log('%c[API Response] 200 OK', 'color: #10b981; font-weight: bold;', resData);
        return {
          data: resData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      }
      throw {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid email or password' },
        },
      };
    }

    // 2. Auth Routing: POST /auth/register
    if (cleanUrl === '/auth/register' && method?.toUpperCase() === 'POST') {
      const { name, email, password } = parsedData || {};
      const users = getStoredUsers();

      // Check if user already exists
      const userExists = users.some((u: any) => u.email.toLowerCase() === email?.toLowerCase());
      if (userExists) {
        throw {
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: { message: 'A user with this email address already exists' },
          },
        };
      }

      // Add new user
      const newUser = { name, email, password };
      users.push(newUser);
      setStoredUsers(users);

      const resData = {
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-${email}`,
        user: { name, email },
      };
      console.log('%c[API Response] 201 Created', 'color: #10b981; font-weight: bold;', resData);
      return {
        data: resData,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }

    // 3. Employees Routing: GET /employees
    if (cleanUrl === '/employees' && method?.toUpperCase() === 'GET') {
      const list = getStoredEmployees();
      console.log('%c[API Response] 200 OK', 'color: #10b981; font-weight: bold;', { count: list.length });
      return {
        data: list,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    // 4. Employees Routing: POST /employees
    if (cleanUrl === '/employees' && method?.toUpperCase() === 'POST') {
      const list = getStoredEmployees();
      // Generate ID
      const maxId = list.reduce((max: number, e: any) => (e.id > max ? e.id : max), 0);
      const nextId = maxId + 1;

      const newEmployee = {
        ...parsedData,
        id: nextId,
      };

      list.unshift(newEmployee);
      setStoredEmployees(list);

      console.log('%c[API Response] 201 Created', 'color: #10b981; font-weight: bold;', newEmployee);
      return {
        data: newEmployee,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }

    // 5. Employees Routing: PUT /employees/:id
    const employeeIdMatch = cleanUrl.match(/^\/employees\/(\d+)$/);
    if (employeeIdMatch && method?.toUpperCase() === 'PUT') {
      const targetId = parseInt(employeeIdMatch[1], 10);
      const list = getStoredEmployees();
      const index = list.findIndex((e: any) => e.id === targetId);

      if (index === -1) {
        throw {
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'Employee not found' },
          },
        };
      }

      const updatedEmployee = {
        ...parsedData,
        id: targetId,
      };

      list[index] = updatedEmployee;
      setStoredEmployees(list);

      console.log('%c[API Response] 200 OK', 'color: #10b981; font-weight: bold;', updatedEmployee);
      return {
        data: updatedEmployee,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    // 6. Employees Routing: DELETE /employees/:id
    if (employeeIdMatch && method?.toUpperCase() === 'DELETE') {
      const targetId = parseInt(employeeIdMatch[1], 10);
      const list = getStoredEmployees();
      const filteredList = list.filter((e: any) => e.id !== targetId);

      if (list.length === filteredList.length) {
        throw {
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'Employee not found' },
          },
        };
      }

      setStoredEmployees(filteredList);

      console.log('%c[API Response] 200 OK', 'color: #10b981; font-weight: bold;', { success: true });
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    // Unmatched endpoint fallback
    throw {
      response: {
        status: 404,
        statusText: 'Not Found',
        data: { message: `Route ${method} ${url} not found` },
      },
    };
  } catch (error: any) {
    if (error.response) {
      console.error(
        `%c[API Error] ${error.response.status} ${error.response.statusText}`,
        'color: #ef4444; font-weight: bold;',
        error.response.data
      );
      throw error;
    }
    // Network or server error fallback
    throw {
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: error.message || 'Server execution error' },
      },
    };
  }
};

export function initializeMockApi() {
  console.log('[Mock API] Interceptor initialized successfully.');
}
