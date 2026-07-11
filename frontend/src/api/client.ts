const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('rss_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; role: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<{ user: { id: number; username: string; role: string } }>('/auth/me'),
};

// Systems
export const systemsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/systems${query}`);
  },
  get: (id: number) => request<any>(`/systems/${id}`),
  create: (data: any) => request<any>('/systems', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/systems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/systems/${id}`, { method: 'DELETE' }),
  filters: () => request<any>('/systems/filters'),
};

// Planets
export const planetsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/planets${query}`);
  },
  get: (id: number) => request<any>(`/planets/${id}`),
  create: (data: any) => request<any>('/planets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/planets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/planets/${id}`, { method: 'DELETE' }),
  filters: () => request<any>('/planets/filters'),
};

// Bases
export const basesApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/bases${query}`);
  },
  get: (id: number) => request<any>(`/bases/${id}`),
  create: (data: any) => request<any>('/bases', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/bases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/bases/${id}`, { method: 'DELETE' }),
  featured: () => request<any>('/bases/featured'),
  filters: () => request<any>('/bases/filters'),
};

// Entities (fauna, flora, minerals, etc.)
function createEntityApi(endpoint: string) {
  return {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any>(`/entities/${endpoint}${query}`);
    },
    get: (id: number) => request<any>(`/entities/${endpoint}/${id}`),
    create: (data: any) => request<any>(`/entities/${endpoint}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/entities/${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<any>(`/entities/${endpoint}/${id}`, { method: 'DELETE' }),
  };
}

export const faunaApi = createEntityApi('fauna');
export const floraApi = createEntityApi('flora');
export const mineralsApi = createEntityApi('minerals');
export const starshipsApi = createEntityApi('starships');
export const settlementsApi = createEntityApi('settlements');
export const multitoolsApi = createEntityApi('multitools');
export const derelictsApi = createEntityApi('derelicts');
export const sandwormsApi = createEntityApi('sandworms');
export const racetracksApi = createEntityApi('racetracks');

// Stats
export const statsApi = {
  get: () => request<any>('/stats'),
};

// Wiki Generator
export const generateApi = {
  wiki: (type: string, id: number) => request<{ wikiCode: string }>(`/generate/${type}/${id}`),
  batch: (items: { type: string; id: number }[]) =>
    request<{ results: { type: string; id: number; wikiCode: string }[] }>('/generate/batch', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

// Wiki Import
export const importApi = {
  searchWiki: (query: string) => request<{ results: { title: string; url: string }[] }>(`/import/search?q=${encodeURIComponent(query)}`),
  getPage: (pageName: string) => request<{ title: string; pageId: number; wikitext: string }>(`/import/page/${encodeURIComponent(pageName)}`),
  importBase: (data: { wikitext: string; system_id?: number; planet_id?: number }) => request<any>('/import/import-base', { method: 'POST', body: JSON.stringify(data) }),
  importSystem: (data: { wikitext: string }) => request<any>('/import/import-system', { method: 'POST', body: JSON.stringify(data) }),
  importPlanet: (data: { wikitext: string; system_id?: number }) => request<any>('/import/import-planet', { method: 'POST', body: JSON.stringify(data) }),
  bulkImportSystems: (systems: any[]) => request<any>('/import/bulk-systems', { method: 'POST', body: JSON.stringify({ systems }) }),
  bulkImportBases: (bases: any[]) => request<any>('/import/bulk-bases', { method: 'POST', body: JSON.stringify({ bases }) }),
  bulkImportPlanets: (planets: any[]) => request<any>('/import/bulk-planets', { method: 'POST', body: JSON.stringify({ planets }) }),
};
