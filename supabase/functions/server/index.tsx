import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const base = "/make-server-bebe2f38";

const entityTypes = [
  "affiliates",
  "teams",
  "products",
  "tracking",
  "commissions",
  "payments",
  "content",
  "links",
  "videos",
  "payouts",
  "referrals",
] as const;

const adminOnly = new Set([
  "affiliates",
  "teams",
  "products",
  "tracking",
  "commissions",
  "payments",
]);

const seedData: Record<string, Record<string, unknown>[]> = {
  affiliates: [
    { id: "aff-maya", name: "Maya Patel", email: "maya@create.co", team: "Elevate", sales: 12480, earned: 1872, status: "Active" },
    { id: "aff-sofia", name: "Sofia Kim", email: "sofia@dailyglow.io", team: "Nova", sales: 9340, earned: 1401, status: "Active" },
    { id: "aff-jordan", name: "Jordan Reed", email: "jordan@jrmedia.com", team: "Elevate", sales: 7865, earned: 1180, status: "Review" },
    { id: "aff-david", name: "David Wu", email: "david@fitfoundry.co", team: "Momentum", sales: 6220, earned: 933, status: "Active" },
    { id: "aff-amara", name: "Amara Jones", email: "amara@wellness.me", team: "Nova", sales: 4970, earned: 745, status: "Active" },
  ],
  teams: [
    { id: "team-elevate", name: "Elevate", lead: "Maya Patel", members: 184, sales: 68420, status: "Active" },
    { id: "team-nova", name: "Nova", lead: "Sofia Kim", members: 142, sales: 52980, status: "Active" },
    { id: "team-momentum", name: "Momentum", lead: "David Wu", members: 96, sales: 38760, status: "Active" },
  ],
  products: [
    { id: "prod-wellness", name: "Daily Wellness Bundle", category: "Wellness", price: 79, commission: 15, status: "Active" },
    { id: "prod-fitness", name: "Pro Fitness Resistance Set", category: "Fitness", price: 42, commission: 18, status: "Active" },
    { id: "prod-vitamins", name: "Vitamin Essentials Pack", category: "Pharmacy", price: 54.5, commission: 12, status: "Active" },
    { id: "prod-scrubs", name: "Signature Scrub Set", category: "Uniforms", price: 68, commission: 14, status: "Draft" },
  ],
  tracking: [
    { id: "tag-elevate", name: "evellc-elevate-20", team: "Elevate", clicks: 4284, sales: 642, revenue: 18420, status: "Active" },
    { id: "tag-nova", name: "evellc-nova-20", team: "Nova", clicks: 3190, sales: 488, revenue: 13980, status: "Active" },
  ],
  commissions: [
    { id: "com-1001", name: "Maya Patel", type: "Sales commission", amount: 1872, period: "November 2025", status: "Approved" },
    { id: "com-1002", name: "Team Elevate", type: "Referral commission", amount: 92, period: "November 2025", status: "Pending" },
  ],
  payments: [
    { id: "pay-1001", name: "Affiliate registration", customer: "Nia Roberts", amount: 1.5, date: "2025-11-30", status: "Completed" },
    { id: "pay-1002", name: "UGC generation", customer: "Maya Patel", amount: 1.5, date: "2025-11-30", status: "Completed" },
  ],
  content: [
    { id: "content-1001", name: "Wellness launch caption", owner: "Maya Patel", format: "Instagram", date: "2025-11-30", status: "Ready" },
    { id: "content-1002", name: "Resistance set UGC", owner: "Jordan Reed", format: "Video", date: "2025-11-29", status: "Processing" },
  ],
  links: [
    { id: "link-1001", name: "Daily Wellness Bundle", url: "https://evellc.shop/wellness?ref=maya", clicks: 184, conversions: 26, status: "Active" },
  ],
  videos: [
    { id: "video-1001", name: "Daily Wellness Routine", product: "Daily Wellness Bundle", created: "2025-11-28", status: "Completed" },
  ],
  payouts: [
    { id: "payout-1001", name: "Maya Patel", amount: 642, method: "Bank transfer", date: "2025-12-05", status: "Pending" },
  ],
  referrals: [],
};

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get(`${base}/health`, (c) => c.json({ status: "ok" }));

async function authenticate(c: any, next: any) {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return c.json({ error: "Authentication required" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return c.json({ error: "Invalid or expired session" }, 401);

  c.set("user", data.user);
  c.set("profile", await kv.get(`profile:${data.user.id}`));
  await next();
}

app.use(`${base}/api/*`, authenticate);

async function addActivity(user: any, action: string, detail: string) {
  const id = crypto.randomUUID();
  await kv.set(`activity:${new Date().toISOString()}:${id}`, {
    id,
    action,
    detail,
    actor: user.email,
    createdAt: new Date().toISOString(),
  });
}

app.post(`${base}/api/bootstrap`, async (c) => {
  const user = c.get("user");
  let profile = await kv.get(`profile:${user.id}`);
  if (!profile) {
    const owner = await kv.get("system:owner");
    const role = owner ? "affiliate" : "admin";
    if (!owner) await kv.set("system:owner", { userId: user.id, email: user.email });
    profile = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Member",
      email: user.email,
      role,
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    await kv.set(`profile:${user.id}`, profile);
    await addActivity(user, "Account created", `${profile.name} joined as ${role}`);
  }

  if (!(await kv.get("system:seeded"))) {
    const keys: string[] = [];
    const values: unknown[] = [];
    for (const [type, records] of Object.entries(seedData)) {
      for (const record of records) {
        keys.push(`entity:${type}:${record.id}`);
        values.push({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
    }
    await kv.mset(keys, values);
    await kv.set("system:seeded", { at: new Date().toISOString() });
  }

  return c.json({ profile });
});

app.get(`${base}/api/data`, async (c) => {
  const profile = c.get("profile");
  const data: Record<string, unknown[]> = {};
  const privateTypes = new Set(["commissions", "payments", "content", "links", "videos", "payouts", "referrals"]);
  for (const type of entityTypes) {
    const records = await kv.getByPrefix(`entity:${type}:`);
    data[type] = profile?.role === "admin" || !privateTypes.has(type)
      ? records
      : records.filter((record) => record.ownerId === profile.id);
  }
  data.activities = (await kv.getByPrefix("activity:"))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 50);
  return c.json({ data, profile: c.get("profile") });
});

app.post(`${base}/api/entities/:type`, async (c) => {
  const type = c.req.param("type");
  if (!entityTypes.includes(type as any)) return c.json({ error: "Unknown entity type" }, 400);
  const profile = c.get("profile");
  if (adminOnly.has(type) && profile?.role !== "admin") return c.json({ error: "Admin access required" }, 403);

  const body = await c.req.json();
  const id = crypto.randomUUID();
  const record = {
    ...body,
    id,
    ownerId: profile?.role === "admin" ? body.ownerId : profile?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await kv.set(`entity:${type}:${id}`, record);
  await addActivity(c.get("user"), `Created ${type.slice(0, -1)}`, String(body.name || id));
  return c.json({ record }, 201);
});

app.put(`${base}/api/entities/:type/:id`, async (c) => {
  const { type, id } = c.req.param();
  if (!entityTypes.includes(type as any)) return c.json({ error: "Unknown entity type" }, 400);
  const profile = c.get("profile");
  if (adminOnly.has(type) && profile?.role !== "admin") return c.json({ error: "Admin access required" }, 403);
  const current = await kv.get(`entity:${type}:${id}`);
  if (!current) return c.json({ error: "Record not found" }, 404);
  if (profile?.role !== "admin" && current.ownerId && current.ownerId !== profile.id) return c.json({ error: "Not permitted" }, 403);

  const body = await c.req.json();
  const record = { ...current, ...body, id, updatedAt: new Date().toISOString() };
  await kv.set(`entity:${type}:${id}`, record);
  await addActivity(c.get("user"), `Updated ${type.slice(0, -1)}`, String(record.name || id));
  return c.json({ record });
});

app.delete(`${base}/api/entities/:type/:id`, async (c) => {
  const { type, id } = c.req.param();
  if (!entityTypes.includes(type as any)) return c.json({ error: "Unknown entity type" }, 400);
  const profile = c.get("profile");
  if (adminOnly.has(type) && profile?.role !== "admin") return c.json({ error: "Admin access required" }, 403);
  const current = await kv.get(`entity:${type}:${id}`);
  if (!current) return c.json({ error: "Record not found" }, 404);
  if (profile?.role !== "admin" && current.ownerId && current.ownerId !== profile.id) return c.json({ error: "Not permitted" }, 403);

  await kv.del(`entity:${type}:${id}`);
  await addActivity(c.get("user"), `Deleted ${type.slice(0, -1)}`, String(current.name || id));
  return c.json({ success: true });
});

app.put(`${base}/api/profile`, async (c) => {
  const user = c.get("user");
  const current = await kv.get(`profile:${user.id}`);
  const body = await c.req.json();
  const profile = {
    ...current,
    name: String(body.name || current.name),
    payoutMethod: String(body.payoutMethod || current.payoutMethod || ""),
    notifications: body.notifications ?? current.notifications ?? true,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(`profile:${user.id}`, profile);
  return c.json({ profile });
});

app.post(`${base}/api/generate-content`, async (c) => {
  if (!Deno.env.get("TRYHOLO_API_KEY")) {
    return c.json({ error: "TryHolo.ai is not configured. Add TRYHOLO_API_KEY in project secrets." }, 503);
  }
  return c.json({ error: "TryHolo.ai endpoint configuration is required for your account." }, 501);
});

Deno.serve(app.fetch);
