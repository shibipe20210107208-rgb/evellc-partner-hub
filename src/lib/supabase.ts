import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-bebe2f38`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload as T;
}

export type AppProfile = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "affiliate";
  status: string;
  payoutMethod?: string;
  notifications?: boolean;
};

export type EntityRecord = Record<string, string | number | boolean | undefined> & {
  id: string;
  name: string;
  status?: string;
};

export type AppData = Record<string, EntityRecord[]> & {
  activities: EntityRecord[];
};

export const appApi = {
  bootstrap: () => request<{ profile: AppProfile }>("/api/bootstrap", { method: "POST" }),
  data: () => request<{ data: AppData; profile: AppProfile }>("/api/data"),
  create: (type: string, values: Record<string, unknown>) =>
    request<{ record: EntityRecord }>(`/api/entities/${type}`, { method: "POST", body: JSON.stringify(values) }),
  update: (type: string, id: string, values: Record<string, unknown>) =>
    request<{ record: EntityRecord }>(`/api/entities/${type}/${id}`, { method: "PUT", body: JSON.stringify(values) }),
  remove: (type: string, id: string) =>
    request<{ success: boolean }>(`/api/entities/${type}/${id}`, { method: "DELETE" }),
  updateProfile: (values: Record<string, unknown>) =>
    request<{ profile: AppProfile }>("/api/profile", { method: "PUT", body: JSON.stringify(values) }),
  generateContent: (values: Record<string, unknown>) =>
    request<{ content: string }>("/api/generate-content", { method: "POST", body: JSON.stringify(values) }),
};
