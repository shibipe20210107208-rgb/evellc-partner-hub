import type { AppData, AppProfile, EntityRecord } from "./supabase";

export const demoProfile: AppProfile = {
  id: "demo-owner",
  name: "Avery Owens",
  email: "demo@evellc.shop",
  role: "admin",
  status: "Active",
  payoutMethod: "Bank transfer",
  notifications: true,
};

const now = new Date().toISOString();

const record = (value: EntityRecord): EntityRecord => ({
  ...value,
  createdAt: now,
  updatedAt: now,
});

export const initialDemoData: AppData = {
  affiliates: [
    record({ id: "aff-maya", name: "Maya Patel", email: "maya@create.co", team: "Elevate", sales: 12480, earned: 1872, status: "Active" }),
    record({ id: "aff-sofia", name: "Sofia Kim", email: "sofia@dailyglow.io", team: "Nova", sales: 9340, earned: 1401, status: "Active" }),
    record({ id: "aff-jordan", name: "Jordan Reed", email: "jordan@jrmedia.com", team: "Elevate", sales: 7865, earned: 1180, status: "Review" }),
  ],
  teams: [
    record({ id: "team-elevate", name: "Elevate", lead: "Maya Patel", members: 184, sales: 68420, status: "Active" }),
    record({ id: "team-nova", name: "Nova", lead: "Sofia Kim", members: 142, sales: 52980, status: "Active" }),
  ],
  products: [
    record({ id: "prod-wellness", name: "Daily Wellness Bundle", category: "Wellness", price: 79, commission: 15, status: "Active" }),
    record({ id: "prod-fitness", name: "Pro Fitness Resistance Set", category: "Fitness", price: 42, commission: 18, status: "Active" }),
    record({ id: "prod-vitamins", name: "Vitamin Essentials Pack", category: "Pharmacy", price: 54.5, commission: 12, status: "Active" }),
  ],
  tracking: [
    record({ id: "tag-elevate", name: "evellc-elevate-20", team: "Elevate", clicks: 4284, sales: 642, revenue: 18420, status: "Active" }),
  ],
  commissions: [
    record({ id: "com-1001", name: "Maya Patel", type: "Sales commission", amount: 1872, period: "November 2025", status: "Approved" }),
  ],
  payments: [
    record({ id: "pay-1001", name: "Affiliate registration", customer: "Nia Roberts", amount: 1.5, date: "2025-11-30", status: "Completed" }),
  ],
  content: [
    record({ id: "content-1001", name: "Wellness launch caption", owner: "Maya Patel", format: "Instagram", date: "2025-11-30", status: "Ready" }),
  ],
  links: [
    record({ id: "link-1001", name: "Daily Wellness Bundle", url: "https://evellc.shop/wellness?ref=maya", clicks: 184, conversions: 26, status: "Active" }),
  ],
  videos: [
    record({ id: "video-1001", name: "Daily Wellness Routine", product: "Daily Wellness Bundle", created: "2025-11-28", status: "Completed" }),
  ],
  payouts: [
    record({ id: "payout-1001", name: "Maya Patel", amount: 642, method: "Bank transfer", date: "2025-12-05", status: "Pending" }),
  ],
  referrals: [],
  activities: [
    record({ id: "activity-1", name: "Account created", action: "Account created", detail: "Demo workspace initialized", actor: "System" }),
  ],
};

export function getDemoData(): AppData {
  const saved = localStorage.getItem("eve-demo-data");
  if (!saved) return structuredClone(initialDemoData);
  try {
    return JSON.parse(saved) as AppData;
  } catch {
    return structuredClone(initialDemoData);
  }
}

export function saveDemoData(data: AppData) {
  localStorage.setItem("eve-demo-data", JSON.stringify(data));
}
