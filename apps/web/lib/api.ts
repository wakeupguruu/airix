// Thin client for the Go backend (http://localhost:8080/api/v1).
// Tokens live in localStorage; on 401 we try one refresh, then bounce to /login.

import { Workspace } from '../app/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('airix_access_token');
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem('airix_access_token', access);
  if (refresh) localStorage.setItem('airix_refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('airix_access_token');
  localStorage.removeItem('airix_refresh_token');
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = localStorage.getItem('airix_refresh_token');
  if (!refresh) return false;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setTokens(data.access_token);
  return true;
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; retried?: boolean } = {},
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers: {
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 401 && !opts.retried && !path.startsWith('/auth/')) {
    if (await refreshAccessToken()) {
      return api<T>(path, { ...opts, retried: true });
    }
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const data = await api<{ access_token: string; refresh_token: string; user: any }>(
    '/auth/login',
    { method: 'POST', body: { email, password } },
  );
  setTokens(data.access_token, data.refresh_token);
  return data.user;
}

export async function register(username: string, email: string, password: string) {
  const data = await api<{ access_token: string; refresh_token: string; user: any }>(
    '/auth/register',
    { method: 'POST', body: { username, email, password } },
  );
  setTokens(data.access_token, data.refresh_token);
  return data.user;
}

// ── Workspaces ────────────────────────────────────────────────────────────────

export type ApiWorkspace = {
  id: string;
  name: string;
  type: 'blank' | 'image_to_model' | 'text_to_model' | 'concept_studio';
  status: 'draft' | 'in_progress' | 'complete';
  scene_json: any;
  created_at: string;
  updated_at: string;
};

const TYPE_TO_MODE: Record<ApiWorkspace['type'], Workspace['mode']> = {
  blank: 'Blank Workspace',
  image_to_model: 'Image → 3D',
  text_to_model: 'Text → 3D',
  concept_studio: 'Concept Studio',
};

export const MODE_TO_TYPE: Record<Workspace['mode'], ApiWorkspace['type']> = {
  'Blank Workspace': 'blank',
  'Image → 3D': 'image_to_model',
  'Text → 3D': 'text_to_model',
  'Concept Studio': 'concept_studio',
};

const STATUS_TO_UI: Record<ApiWorkspace['status'], Workspace['status']> = {
  draft: 'Draft',
  in_progress: 'Active',
  complete: 'Completed',
};

export function toUiWorkspace(ws: ApiWorkspace): Workspace {
  return {
    id: ws.id,
    name: ws.name,
    mode: TYPE_TO_MODE[ws.type] || 'Blank Workspace',
    status: STATUS_TO_UI[ws.status] || 'Draft',
    lastEdited: `Edited ${new Date(ws.updated_at).toLocaleDateString()}`,
  };
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const data = await api<{ workspaces: ApiWorkspace[] }>('/workspaces?limit=100');
  return (data.workspaces || []).map(toUiWorkspace);
}

export async function createWorkspace(name: string, mode: Workspace['mode']) {
  return api<ApiWorkspace>('/workspaces', {
    method: 'POST',
    body: { name, type: MODE_TO_TYPE[mode] },
  });
}

export async function renameWorkspace(id: string, name: string) {
  return api<ApiWorkspace>(`/workspaces/${id}`, { method: 'PATCH', body: { name } });
}

export async function deleteWorkspace(id: string) {
  return api(`/workspaces/${id}`, { method: 'DELETE' });
}

// ── AI ────────────────────────────────────────────────────────────────────────

export async function designChat(workspaceId: string, prompt: string, sceneJson?: any) {
  return api<{
    user_message: any;
    assistant_message: any;
    type?: string;
    follow_up_question?: string;
    job_id?: string;
  }>(`/workspaces/${workspaceId}/chat/design`, {
    method: 'POST',
    body: { prompt, scene_json: sceneJson },
  });
}

export async function startGenerate(
  workspaceId: string,
  body: { mode: 'text_to_model' | 'image_to_model'; prompt?: string; image_url?: string },
) {
  return api<{ job_id: string; chat_id: string; status: string }>(
    `/workspaces/${workspaceId}/generate`,
    { method: 'POST', body },
  );
}

export async function generateStatus(workspaceId: string, jobId: string, chatId: string) {
  return api<{ status: string; model_url?: string; model_id?: string; error?: string }>(
    `/workspaces/${workspaceId}/generate/status?job_id=${encodeURIComponent(jobId)}&chat_id=${encodeURIComponent(chatId)}`,
  );
}

// Polls every 5s until done/failed. 3D gen takes 1-3 min typically.
export async function pollGenerate(
  workspaceId: string,
  jobId: string,
  chatId: string,
  onTick?: (status: string) => void,
): Promise<string> {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await generateStatus(workspaceId, jobId, chatId);
    onTick?.(res.status);
    if (res.status === 'done' && res.model_url) return res.model_url;
    if (res.status === 'failed') throw new Error(res.error || '3D generation failed');
  }
  throw new Error('3D generation timed out');
}

export async function conceptImages(workspaceId: string, prompt: string) {
  return api<{ images: string[]; chat_id: string }>(`/workspaces/${workspaceId}/concept`, {
    method: 'POST',
    body: { prompt },
  });
}
