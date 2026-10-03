import { FormEvent, useEffect, useMemo, useState } from "react";
import { appApi, AppData, AppProfile, EntityRecord, supabase } from "./lib/supabase";
import { demoProfile, getDemoData, saveDemoData } from "./lib/demo";

type IconName =
  | "dashboard"
  | "users"
  | "teams"
  | "products"
  | "link"
  | "wallet"
  | "card"
  | "sparkles"
  | "video"
  | "chart"
  | "settings"
  | "search"
  | "bell"
  | "arrowUp"
  | "arrowDown"
  | "chevron"
  | "more"
  | "plus"
  | "download"
  | "copy"
  | "menu"
  | "close"
  | "check"
  | "globe"
  | "play";

const iconPaths: Record<IconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  teams: <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M17 11a4 4 0 0 0 0-8M19 15a6 6 0 0 1 3 5v1"/></>,
  products: <><path d="m7.5 4.27 9 5.15M3 6l9 5 9-5M3 6l9-5 9 5v12l-9 5-9-5Z"/><path d="M12 11v12"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  wallet: <><path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10H5a3 3 0 0 1-3-3V7"/><path d="M16 14h.01"/></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h2"/></>,
  sparkles: <><path d="m12 3-1.2 3.1L8 7.5l2.8 1.4L12 12l1.2-3.1L16 7.5l-2.8-1.4ZM5 14l-.8 2.1L2 17l2.2.9L5 20l.8-2.1L8 17l-2.2-.9ZM19 13l-.8 2.1L16 16l2.2.9L19 19l.8-2.1L22 16l-2.2-.9Z"/></>,
  video: <><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2Z"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-8"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2v-4h.5A1.7 1.7 0 0 0 4.2 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 10 2.5V2h4v.5A1.7 1.7 0 0 0 15 4.2a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.9v4h-.9a1.7 1.7 0 0 0-1.7 1Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  arrowUp: <><path d="m18 15-6-6-6 6"/></>,
  arrowDown: <><path d="m6 9 6 6 6-6"/></>,
  chevron: <><path d="m9 18 6-6-6-6"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

const adminNav: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "dashboard" },
  { label: "Affiliates", icon: "users" },
  { label: "Teams & referrals", icon: "teams" },
  { label: "Product catalog", icon: "products" },
  { label: "Amazon tracking", icon: "link" },
  { label: "Commissions", icon: "wallet" },
  { label: "Payments", icon: "card" },
  { label: "Content & UGC", icon: "video" },
  { label: "Reports", icon: "chart" },
];

const affiliateNav: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "dashboard" },
  { label: "Product catalog", icon: "products" },
  { label: "My links", icon: "link" },
  { label: "AI content studio", icon: "sparkles" },
  { label: "UGC videos", icon: "video" },
  { label: "My team", icon: "teams" },
  { label: "Earnings & payouts", icon: "wallet" },
];

const activities = [
  { initials: "MP", color: "purple", text: "Maya Patel joined Team Elevate", meta: "New affiliate", time: "2 min ago" },
  { initials: "JR", color: "coral", text: "Jordan Reed generated a UGC video", meta: "Wellness campaign", time: "18 min ago" },
  { initials: "SK", color: "blue", text: "Sofia Kim reached $1,000 in sales", meta: "Milestone achieved", time: "42 min ago" },
  { initials: "DW", color: "green", text: "David Wu requested a payout", meta: "$842.50 pending", time: "1 hr ago" },
];

function Logo() {
  return (
    <div className="brand">
      <img src="/eve-logo.jpg" alt="Eve LLC" />
      <div><strong>Eve</strong><span>Partner Hub</span></div>
    </div>
  );
}

function Button({ children, variant = "primary", icon, onClick, type = "button" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: IconName; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} className={`button ${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16} />}{children}</button>;
}

function StatCard({ label, value, change, tone, icon }: { label: string; value: string; change: string; tone: string; icon: IconName }) {
  const positive = !change.startsWith("-");
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon name={icon} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive ? "positive" : "negative"}`}>
        <Icon name={positive ? "arrowUp" : "arrowDown"} size={13} />
        <strong>{change}</strong><span>vs last month</span>
      </div>
    </article>
  );
}

function ChartCard({ affiliate = false }: { affiliate?: boolean }) {
  const [range, setRange] = useState("12 months");
  const bars = [38, 44, 41, 58, 53, 68, 62, 78, 71, 82, 76, 93];
  const visibleBars = range === "30 days" ? bars.slice(-4) : range === "6 months" ? bars.slice(-6) : bars;
  const labels = range === "30 days" ? ["W1", "W2", "W3", "W4"] : range === "6 months" ? ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <div><h2>{affiliate ? "Your sales performance" : "Revenue performance"}</h2><p>{affiliate ? "Sales and commission earnings" : "Combined revenue across the Eve network"}</p></div>
        <select aria-label="Chart time range" value={range} onChange={(event) => setRange(event.target.value)}><option>12 months</option><option>6 months</option><option>30 days</option></select>
      </div>
      <div className="chart-summary">
        <div><span>{affiliate ? "Total sales" : "Gross revenue"}</span><strong>{affiliate ? "$18,640" : "$284,920"}</strong></div>
        <div className="legend"><i></i>{affiliate ? "Commission" : "Net revenue"}</div>
      </div>
      <div className="bar-chart">
        {visibleBars.map((height, index) => <div className="bar-slot" key={index}><div className="bar" style={{ height: `${height}%` }}></div><span>{labels[index]}</span></div>)}
      </div>
    </article>
  );
}

function ActivityCard({ onViewAll }: { onViewAll?: () => void }) {
  return (
    <article className="panel activity-panel">
      <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest across your network</p></div><button className="text-button" onClick={onViewAll}>View all</button></div>
      <div className="activity-list">
        {activities.map((item) => <div className="activity" key={item.text}><span className={`avatar ${item.color}`}>{item.initials}</span><div><strong>{item.text}</strong><span>{item.meta}</span></div><time>{item.time}</time></div>)}
      </div>
    </article>
  );
}

function NetworkCard() {
  const sites = ["evellc.shop", "pharmacy.evellc.shop", "medical.evellc.shop", "fitness.evellc.shop", "asia.evellc.shop", "europe.evellc.shop"];
  return (
    <article className="panel network-panel">
      <div className="panel-heading"><div><h2>Eve network</h2><p>Regional marketplaces</p></div><span className="live"><i></i>All systems live</span></div>
      <div className="network-grid">{sites.map((site, index) => <button key={site} onClick={() => window.open(`https://${site}`, "_blank", "noopener,noreferrer")}><span className={`site-icon site-${index}`}><Icon name="globe" size={16} /></span><span>{site}</span><Icon name="chevron" size={15} /></button>)}</div>
    </article>
  );
}

function AdminOverview({ onNavigate, data }: { onNavigate: (page: string) => void; data: AppData }) {
  const revenue = (data.affiliates || []).reduce((sum, item) => sum + Number(item.sales || 0), 0);
  const sales = (data.tracking || []).reduce((sum, item) => sum + Number(item.sales || 0), 0);
  const payouts = (data.payouts || []).filter((item) => item.status === "Pending").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total revenue" value={`$${revenue.toLocaleString()}`} change="+18.2%" tone="purple" icon="chart" />
        <StatCard label="Total affiliates" value={(data.affiliates || []).length.toLocaleString()} change="+12.4%" tone="coral" icon="users" />
        <StatCard label="Tracked sales" value={sales.toLocaleString()} change="+9.8%" tone="blue" icon="products" />
        <StatCard label="Pending payouts" value={`$${payouts.toLocaleString()}`} change="-3.1%" tone="amber" icon="wallet" />
      </div>
      <div className="dashboard-grid"><ChartCard /><ActivityCard onViewAll={() => onNavigate("Reports")} /></div>
      <div className="dashboard-grid lower">
        <NetworkCard />
        <article className="panel revenue-panel">
          <div className="panel-heading"><div><h2>Revenue breakdown</h2><p>This month</p></div><button className="icon-button" aria-label="Export revenue breakdown" onClick={() => downloadCsv("revenue-breakdown.csv", [{ id: "revenue", name: "November", productSales: 64, membership: 21, ugc: 15 }], ["name", "productSales", "membership", "ugc"])}><Icon name="download" /></button></div>
          <div className="donut-wrap"><div className="donut"><div><strong>$38.4K</strong><span>Total</span></div></div><div className="donut-legend"><div><i className="purple-dot"></i><span>Product sales</span><strong>64%</strong></div><div><i className="coral-dot"></i><span>Membership</span><strong>21%</strong></div><div><i className="blue-dot"></i><span>UGC videos</span><strong>15%</strong></div></div></div>
        </article>
      </div>
    </>
  );
}

function AffiliateOverview({ onNavigate, data }: { onNavigate: (page: string) => void; data: AppData }) {
  const earnings = (data.payouts || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const clicks = (data.links || []).reduce((sum, item) => sum + Number(item.clicks || 0), 0);
  return (
    <>
      <div className="welcome-card">
        <div><span className="eyebrow">CREATOR SPOTLIGHT</span><h2>Turn your influence into impact.</h2><p>Your links have driven {clicks.toLocaleString()} tracked clicks. Keep the momentum going with fresh product content.</p><Button icon="sparkles" onClick={() => onNavigate("AI content studio")}>Create content</Button></div>
        <div className="welcome-graphic"><span><Icon name="chart" size={32} /></span><strong>+24%</strong><small>engagement</small></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Total earnings" value={`$${earnings.toLocaleString()}`} change="+18.2%" tone="purple" icon="wallet" />
        <StatCard label="Active links" value={(data.links || []).filter((item) => item.status === "Active").length.toString()} change="+12.4%" tone="coral" icon="products" />
        <StatCard label="Team network" value={(data.teams || []).reduce((sum, item) => sum + Number(item.members || 0), 0).toLocaleString()} change="+9.8%" tone="blue" icon="teams" />
        <StatCard label="Pending payout" value={`$${(data.payouts || []).filter((item) => item.status === "Pending").reduce((sum, item) => sum + Number(item.amount || 0), 0).toLocaleString()}`} change="+4.1%" tone="amber" icon="card" />
      </div>
      <div className="dashboard-grid"><ChartCard affiliate /><ActivityCard onViewAll={() => onNavigate("My team")} /></div>
      <div className="quick-actions">
        <button onClick={() => onNavigate("My links")}><span className="purple"><Icon name="link" /></span><div><strong>Create an affiliate link</strong><small>Share a product and start earning</small></div><Icon name="chevron" /></button>
        <button onClick={() => onNavigate("UGC videos")}><span className="coral"><Icon name="video" /></span><div><strong>Generate a UGC video</strong><small>AI video generation for $1.50</small></div><Icon name="chevron" /></button>
        <button onClick={() => onNavigate("My team")}><span className="blue"><Icon name="users" /></span><div><strong>Invite to your team</strong><small>Earn $0.50 referral commission</small></div><Icon name="chevron" /></button>
      </div>
    </>
  );
}

function ContentStudio({ onToast }: { onToast: (message: string) => void }) {
  const [caption, setCaption] = useState("");
  const [generated, setGenerated] = useState(false);
  const [product, setProduct] = useState("Daily Wellness Bundle");
  const [format, setFormat] = useState("Instagram caption");
  const [tone, setTone] = useState("Warm & authentic");
  const [error, setError] = useState("");
  const generate = async () => {
    setError("");
    try {
      const response = await appApi.generateContent({ product, format, tone });
      setCaption(response.content);
      setGenerated(true);
      onToast("New content generated with TryHolo.ai");
    } catch (reason) {
      setGenerated(false);
      setError(reason instanceof Error ? reason.message : "Generation failed");
    }
  };
  return (
    <>
      <div className="section-title-row"><div><h2>AI content studio</h2><p>Create conversion-ready content powered by TryHolo.ai.</p></div><span className="credit-pill"><Icon name="sparkles" size={15}/> API connection required</span></div>
      <div className="studio-grid">
        <article className="panel studio-form"><h3>Create something new</h3><label>Choose a product<select value={product} onChange={(event) => setProduct(event.target.value)}><option>Daily Wellness Bundle</option><option>Vitamin Essentials Pack</option><option>Pro Fitness Resistance Set</option></select></label><label>Content format<div className="format-grid">{["Instagram caption", "TikTok script", "Email copy", "Product review"].map((item) => <button key={item} className={format === item ? "selected" : ""} onClick={() => setFormat(item)}>{item}</button>)}</div></label><label>Brand tone<select value={tone} onChange={(event) => setTone(event.target.value)}><option>Warm & authentic</option><option>Bold & energetic</option><option>Clear & educational</option></select></label>{error && <div className="auth-message">{error}</div>}<Button icon="sparkles" onClick={generate}>Generate content</Button><small className="cost-note">A configured TryHolo.ai account is required</small></article>
        <article className={`panel output-card ${generated ? "generated" : ""}`}>
          {generated ? <><div className="panel-heading"><div><span className="eyebrow">GENERATED COPY</span><h3>Instagram caption</h3></div><button className="icon-button" onClick={() => { navigator.clipboard?.writeText(caption); onToast("Caption copied to clipboard"); }}><Icon name="copy"/></button></div><textarea value={caption} onChange={(e) => setCaption(e.target.value)} /><div className="output-footer"><span>{caption.length} characters</span><div><Button variant="secondary" icon="download" onClick={() => onToast("Content saved to your library")}>Save</Button><Button icon="copy" onClick={() => { navigator.clipboard?.writeText(caption); onToast("Caption copied to clipboard"); }}>Copy</Button></div></div></> : <div className="empty-output"><span><Icon name="sparkles" size={28}/></span><h3>Your content will appear here</h3><p>Choose a product and format, then let TryHolo.ai create something compelling.</p></div>}
        </article>
      </div>
    </>
  );
}

type Field = { key: string; label: string; type?: "text" | "email" | "number" | "date" | "url" | "select"; options?: string[] };
type PageConfig = { type: string; title: string; description: string; action: string; fields: Field[]; columns: string[]; readOnly?: boolean };

const pageConfigs: Record<string, PageConfig> = {
  Affiliates: { type: "affiliates", title: "Affiliate management", description: "Approve, suspend, assign, and review every affiliate account.", action: "Add affiliate", columns: ["name", "email", "team", "sales", "earned", "status"], fields: [{ key: "name", label: "Full name" }, { key: "email", label: "Email", type: "email" }, { key: "team", label: "Team" }, { key: "sales", label: "Sales", type: "number" }, { key: "earned", label: "Earnings", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Review", "Suspended"] }] },
  "Teams & referrals": { type: "teams", title: "Teams & referral network", description: "Maintain team ownership, recruitment relationships, and performance.", action: "Create team", columns: ["name", "lead", "members", "sales", "status"], fields: [{ key: "name", label: "Team name" }, { key: "lead", label: "Team lead" }, { key: "members", label: "Members", type: "number" }, { key: "sales", label: "Sales", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Paused"] }] },
  "Product catalog": { type: "products", title: "Product catalog", description: "Manage approved products, categories, pricing, and campaign commission.", action: "Add product", columns: ["name", "category", "price", "commission", "status"], fields: [{ key: "name", label: "Product name" }, { key: "category", label: "Category" }, { key: "price", label: "Price", type: "number" }, { key: "commission", label: "Commission %", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Archived"] }] },
  "Amazon tracking": { type: "tracking", title: "Amazon tracking IDs", description: "Assign tracking IDs to teams and monitor attributed performance.", action: "Add tracking ID", columns: ["name", "team", "clicks", "sales", "revenue", "status"], fields: [{ key: "name", label: "Tracking ID" }, { key: "team", label: "Assigned team" }, { key: "clicks", label: "Clicks", type: "number" }, { key: "sales", label: "Sales", type: "number" }, { key: "revenue", label: "Revenue", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Paused"] }] },
  Commissions: { type: "commissions", title: "Commission management", description: "Review sales, referral, team earnings, approvals, and payout readiness.", action: "Add commission", columns: ["name", "type", "amount", "period", "status"], fields: [{ key: "name", label: "Affiliate or team" }, { key: "type", label: "Commission type", type: "select", options: ["Sales commission", "Referral commission", "Team commission"] }, { key: "amount", label: "Amount", type: "number" }, { key: "period", label: "Period" }, { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Paid"] }] },
  Payments: { type: "payments", title: "Payments & transactions", description: "Track registration fees, UGC purchases, refunds, and payment history.", action: "Record transaction", columns: ["name", "customer", "amount", "date", "status"], fields: [{ key: "name", label: "Transaction" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount", type: "number" }, { key: "date", label: "Date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Completed", "Pending", "Refunded", "Failed"] }] },
  "Content & UGC": { type: "content", title: "Content & UGC library", description: "Monitor generated content, videos, usage, and content records.", action: "Add content record", columns: ["name", "owner", "format", "date", "status"], fields: [{ key: "name", label: "Content title" }, { key: "owner", label: "Owner" }, { key: "format", label: "Format", type: "select", options: ["Instagram", "TikTok", "Email", "Video"] }, { key: "date", label: "Date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Ready", "Processing", "Failed"] }] },
  Reports: { type: "activities", title: "Reports & activity", description: "A complete audit trail of changes across the platform.", action: "Export report", columns: ["action", "detail", "actor", "createdAt"], fields: [], readOnly: true },
  "My links": { type: "links", title: "Affiliate links", description: "Create product tracking links and monitor clicks and conversion.", action: "Create link", columns: ["name", "url", "clicks", "conversions", "status"], fields: [{ key: "name", label: "Product or campaign" }, { key: "url", label: "Tracking URL", type: "url" }, { key: "clicks", label: "Clicks", type: "number" }, { key: "conversions", label: "Conversions", type: "number" }, { key: "status", label: "Status", type: "select", options: ["Active", "Paused"] }] },
  "UGC videos": { type: "videos", title: "UGC video studio", description: "Request, monitor, download, and reuse product videos.", action: "Request video", columns: ["name", "product", "created", "status"], fields: [{ key: "name", label: "Video title" }, { key: "product", label: "Product" }, { key: "created", label: "Request date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Requested", "Processing", "Completed", "Failed"] }] },
  "My team": { type: "referrals", title: "My referral team", description: "Invite members and monitor your personal referral relationships.", action: "Invite member", columns: ["name", "email", "relationship", "joined", "status"], fields: [{ key: "name", label: "Member name" }, { key: "email", label: "Email", type: "email" }, { key: "relationship", label: "Relationship", type: "select", options: ["Direct referral", "Team member"] }, { key: "joined", label: "Invite date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Invited", "Active"] }] },
  "Earnings & payouts": { type: "payouts", title: "Earnings & payouts", description: "Review pending, approved, and completed payout records.", action: "Request payout", columns: ["name", "amount", "method", "date", "status"], fields: [{ key: "name", label: "Payee" }, { key: "amount", label: "Amount", type: "number" }, { key: "method", label: "Payout method" }, { key: "date", label: "Payout date", type: "date" }, { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Paid"] }] },
};

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatValue(key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  if (["sales", "earned", "price", "amount", "revenue"].includes(key) && typeof value === "number") return `$${value.toLocaleString(undefined, { minimumFractionDigits: key === "price" || key === "amount" ? 2 : 0 })}`;
  if (key === "commission") return `${value}%`;
  if (key === "createdAt") return new Date(String(value)).toLocaleString();
  return String(value);
}

function downloadCsv(filename: string, rows: EntityRecord[], columns: string[]) {
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [columns.map(escape).join(","), ...rows.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function AuthScreen({ onDemo }: { onDemo: () => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "");
    const password = String(values.get("password") || "");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error;
        setMessage("Password reset instructions were sent to your email.");
      } else if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({ email, password, options: { data: { name: String(values.get("name") || "") } } });
        if (error) throw error;
        setMessage(data.session ? "Account created. Loading your workspace…" : "Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return <div className="auth-screen"><div className="auth-brand"><Logo /><div><span className="eyebrow">EVELLC PARTNER NETWORK</span><h1>Build influence.<br/>Grow together.</h1><p>One secure workspace for products, content, referrals, commissions, and team growth.</p><div className="auth-proof"><span><Icon name="check"/></span><div><strong>Global partner ecosystem</strong><small>Commerce tools across every EveLLC marketplace.</small></div></div></div></div><form className="auth-card" onSubmit={submit}><span className="eyebrow">{mode === "signup" ? "JOIN THE NETWORK" : mode === "reset" ? "ACCOUNT RECOVERY" : "WELCOME BACK"}</span><h2>{mode === "signup" ? "Create your account" : mode === "reset" ? "Reset your password" : "Sign in to Partner Hub"}</h2><p>{mode === "signup" ? "The first registered account becomes platform owner." : "Use your verified EveLLC partner credentials."}</p>{mode === "signup" && <label>Full name<input name="name" required autoComplete="name"/></label>}<label>Email address<input name="email" type="email" required autoComplete="email"/></label>{mode !== "reset" && <label>Password<input name="password" type="password" minLength={8} required autoComplete={mode === "signup" ? "new-password" : "current-password"}/></label>}{message && <div className="auth-message">{message}</div>}<Button type="submit">{loading ? "Please wait…" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}</Button><div className="auth-links">{mode === "login" && <button type="button" onClick={() => setMode("reset")}>Forgot password?</button>}<button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Already registered? Sign in" : "New partner? Create account"}</button></div><div className="auth-divider"><span>or</span></div><Button variant="secondary" onClick={onDemo}>Continue in demo workspace</Button><small className="demo-note">No account required. Changes stay in this browser.</small></form></div>;
}

function RecordModal({ config, record, onClose, onSave }: { config: PageConfig; record: EntityRecord | null; onClose: () => void; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values: Record<string, unknown> = {};
    new FormData(event.currentTarget).forEach((value, key) => {
      const field = config.fields.find((item) => item.key === key);
      values[key] = field?.type === "number" ? Number(value) : String(value);
    });
    try { await onSave(values); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save"); setSaving(false); }
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">{record ? "EDIT RECORD" : "NEW RECORD"}</span><h2 id="modal-title">{record ? `Edit ${record.name}` : config.action}</h2></div><button className="icon-button" onClick={onClose}><Icon name="close"/></button></div><form onSubmit={submit}><div className="modal-fields">{config.fields.map((field) => <label key={field.key}>{field.label}{field.type === "select" ? <select name={field.key} defaultValue={String(record?.[field.key] ?? field.options?.[0] ?? "")}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input name={field.key} type={field.type || "text"} step={field.type === "number" ? "0.01" : undefined} defaultValue={String(record?.[field.key] ?? "")} required={["name", "email", "url"].includes(field.key)}/>}</label>)}</div>{error && <div className="auth-message">{error}</div>}<div className="modal-actions"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">{saving ? "Saving…" : "Save record"}</Button></div></form></div></div>;
}

function FunctionalDataPage({ page, data, role, onRefresh, onToast, onCreate, onUpdate, onRemove }: { page: string; data: AppData; role: "admin" | "affiliate"; onRefresh: () => Promise<void>; onToast: (message: string) => void; onCreate: (type: string, values: Record<string, unknown>) => Promise<void>; onUpdate: (type: string, id: string, values: Record<string, unknown>) => Promise<void>; onRemove: (type: string, id: string) => Promise<void> }) {
  const config = pageConfigs[page];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [editing, setEditing] = useState<EntityRecord | null | undefined>(undefined);
  const rows = data[config.type] || [];
  const statuses = ["All", ...Array.from(new Set(rows.map((row) => String(row.status || "")).filter(Boolean)))];
  const filtered = rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase())) && (status === "All" || row.status === status)).sort((a, b) => sort === "A–Z" ? a.name.localeCompare(b.name) : String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")));
  const canManage = !config.readOnly && (role === "admin" || !["affiliates", "teams", "products", "tracking", "commissions", "payments"].includes(config.type));
  const canPromote = role === "affiliate" && config.type === "products";

  async function save(values: Record<string, unknown>) {
    if (editing) await onUpdate(config.type, editing.id, values);
    else await onCreate(config.type, values);
    setEditing(undefined);
    await onRefresh();
    onToast(editing ? "Record updated successfully" : "Record created successfully");
  }

  async function remove(record: EntityRecord) {
    if (!window.confirm(`Delete “${record.name}”? This action cannot be undone.`)) return;
    await onRemove(config.type, record.id);
    await onRefresh();
    onToast("Record deleted");
  }

  async function promote(record: EntityRecord) {
    const slug = record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await onCreate("links", { name: record.name, url: `https://evellc.shop/products/${slug}?ref=${crypto.randomUUID().slice(0, 8)}`, clicks: 0, conversions: 0, status: "Active" });
    await onRefresh();
    onToast("Product added to your promotional links");
  }

  return <><div className="section-title-row"><div><h2>{config.title}</h2><p>{config.description}</p></div><div className="section-actions"><Button variant="secondary" icon="download" onClick={() => { downloadCsv(`${config.type}.csv`, filtered, config.columns); onToast("CSV exported"); }}>Export</Button>{canManage && <Button icon="plus" onClick={() => setEditing(null)}>{config.action}</Button>}</div></div><div className="section-stats"><div><span>Total records</span><strong>{rows.length.toLocaleString()}</strong><small>Synced with Supabase</small></div><div><span>Active / completed</span><strong>{rows.filter((row) => ["Active", "Completed", "Ready", "Approved", "Paid"].includes(String(row.status))).length}</strong><small>Current live records</small></div><div><span>Needs attention</span><strong>{rows.filter((row) => ["Pending", "Review", "Processing", "Failed"].includes(String(row.status))).length}</strong><small>Review recommended</small></div></div><article className="panel table-panel"><div className="table-toolbar"><div className="search small"><Icon name="search" size={16}/><input aria-label="Search records" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`}/></div><div className="filters"><select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Sort records" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>A–Z</option></select></div></div><div className="table-scroll"><table><thead><tr>{config.columns.map((column) => <th key={column}>{column.replace(/([A-Z])/g, " $1")}</th>)}{(canManage || canPromote) && <th>Actions</th>}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>{config.columns.map((column, index) => <td key={column}>{index === 0 ? <div className="person"><span className="avatar purple">{initials(formatValue(column, row[column]))}</span><strong>{formatValue(column, row[column])}</strong></div> : column === "status" ? <span className={`status ${String(row[column]).toLowerCase()}`}>{formatValue(column, row[column])}</span> : formatValue(column, row[column])}</td>)}{canManage && <td><div className="row-actions"><button onClick={() => setEditing(row)}>Edit</button><button className="danger-action" onClick={() => remove(row)}>Delete</button></div></td>}{canPromote && <td><div className="row-actions"><button onClick={() => promote(row)}>Promote</button></div></td>}</tr>)}{filtered.length === 0 && <tr><td colSpan={config.columns.length + 1}><div className="empty-row">No matching records found.</div></td></tr>}</tbody></table></div></article>{editing !== undefined && <RecordModal config={config} record={editing} onClose={() => setEditing(undefined)} onSave={save}/>}</>;
}

function SettingsPage({ profile, onProfile, onToast, onSave }: { profile: AppProfile; onProfile: (profile: AppProfile) => void; onToast: (message: string) => void; onSave: (values: Record<string, unknown>) => Promise<AppProfile> }) {
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const values = new FormData(event.currentTarget);
    try {
      const updated = await onSave({ name: values.get("name"), payoutMethod: values.get("payoutMethod"), notifications: values.get("notifications") === "on" });
      onProfile(updated);
      onToast("Settings saved");
    } finally { setSaving(false); }
  }
  return <><div className="section-title-row"><div><h2>Profile & settings</h2><p>Manage personal details, payout preferences, security, and integrations.</p></div></div><div className="settings-grid"><form className="panel settings-form" onSubmit={submit}><h3>Account information</h3><label>Full name<input name="name" defaultValue={profile.name} required/></label><label>Email address<input value={profile.email} disabled/></label><label>Payout method<select name="payoutMethod" defaultValue={profile.payoutMethod || "Bank transfer"}><option>Bank transfer</option><option>PayPal</option><option>Wise</option></select></label><label className="check-label"><input name="notifications" type="checkbox" defaultChecked={profile.notifications !== false}/>Email notifications for sales and payouts</label><Button type="submit">{saving ? "Saving…" : "Save changes"}</Button></form><div className="settings-stack"><article className="panel integration-card"><span className="list-icon"><Icon name="sparkles"/></span><div><h3>TryHolo.ai</h3><p>API key required before live content or video generation can run.</p></div><span className="status review">Setup required</span></article><article className="panel integration-card"><span className="list-icon list-1"><Icon name="card"/></span><div><h3>Payment provider</h3><p>Connect Stripe to collect registration and UGC generation fees.</p></div><span className="status review">Setup required</span></article><article className="panel integration-card"><span className="list-icon list-2"><Icon name="link"/></span><div><h3>Amazon Associates</h3><p>Credentials are required for live tracking and sales attribution.</p></div><span className="status review">Setup required</span></article></div></div></>;
}

function LoadingScreen({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return <div className="loading-screen"><Logo/><span className={error ? "loading-error" : "loading-ring"}>{error && <Icon name="close"/>}</span><h2>{error ? "Workspace connection failed" : "Preparing your workspace"}</h2><p>{error || "Securely loading your EveLLC data…"}</p>{error && onRetry && <Button onClick={onRetry}>Try again</Button>}</div>;
}

export default function App() {
  const [demoMode, setDemoMode] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [data, setData] = useState<AppData>({ activities: [] } as AppData);
  const [role, setRole] = useState<"admin" | "affiliate">("affiliate");
  const [page, setPage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [loadError, setLoadError] = useState("");

  async function loadWorkspace() {
    setLoadError("");
    if (demoMode) {
      setProfile(JSON.parse(localStorage.getItem("eve-demo-profile") || JSON.stringify(demoProfile)));
      setRole("admin");
      setData(getDemoData());
      return;
    }
    try {
      const boot = await appApi.bootstrap();
      const response = await appApi.data();
      setProfile(response.profile || boot.profile);
      setRole((response.profile || boot.profile).role);
      setData(response.data);
    } catch (error) {
      console.warn("Supabase workspace unavailable; switching to local demo mode.", error);
      enterDemo();
    }
  }

  useEffect(() => {
    if (localStorage.getItem("eve-demo-mode") === "true") {
      setDemoMode(true);
      setAuthenticated(true);
      setSessionReady(true);
      setProfile(JSON.parse(localStorage.getItem("eve-demo-profile") || JSON.stringify(demoProfile)));
      setRole("admin");
      setData(getDemoData());
      return;
    }
    supabase.auth.getSession().then(({ data: authData }) => {
      setAuthenticated(Boolean(authData.session));
      setSessionReady(true);
      if (authData.session) loadWorkspace();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setAuthenticated(Boolean(nextSession));
      setSessionReady(true);
      if (nextSession) window.setTimeout(loadWorkspace, 0);
      else { setProfile(null); setData({ activities: [] } as AppData); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  function enterDemo() {
    localStorage.setItem("eve-demo-mode", "true");
    setDemoMode(true);
    setAuthenticated(true);
    setSessionReady(true);
    setProfile(demoProfile);
    setRole("admin");
    setData(getDemoData());
  }

  async function createRecord(type: string, values: Record<string, unknown>) {
    if (!demoMode) { await appApi.create(type, values); return; }
    const nextRecord = { ...values, id: crypto.randomUUID(), name: String(values.name || "New record"), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as EntityRecord;
    const next = { ...data, [type]: [...(data[type] || []), nextRecord] };
    saveDemoData(next);
    setData(next);
  }

  async function updateRecord(type: string, id: string, values: Record<string, unknown>) {
    if (!demoMode) { await appApi.update(type, id, values); return; }
    const next = { ...data, [type]: (data[type] || []).map((item) => item.id === id ? { ...item, ...values, updatedAt: new Date().toISOString() } : item) };
    saveDemoData(next);
    setData(next);
  }

  async function removeRecord(type: string, id: string) {
    if (!demoMode) { await appApi.remove(type, id); return; }
    const next = { ...data, [type]: (data[type] || []).filter((item) => item.id !== id) };
    saveDemoData(next);
    setData(next);
  }

  async function saveProfile(values: Record<string, unknown>) {
    if (!demoMode) return (await appApi.updateProfile(values)).profile;
    const updated = { ...profile!, ...values } as AppProfile;
    localStorage.setItem("eve-demo-profile", JSON.stringify(updated));
    setProfile(updated);
    return updated;
  }

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>("#global-search")?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (label: string) => { setPage(label); setSidebarOpen(false); setGlobalQuery(""); };
  const nav = role === "admin" ? adminNav : affiliateNav;
  const searchResults = useMemo(() => {
    if (!globalQuery.trim()) return [];
    const pageByType: Record<string, string> = { affiliates: "Affiliates", teams: "Teams & referrals", referrals: "My team", products: "Product catalog", tracking: "Amazon tracking", commissions: "Commissions", payments: "Payments", content: "Content & UGC", links: "My links", videos: "UGC videos", payouts: "Earnings & payouts" };
    return Object.entries(data).flatMap(([type, rows]) => (rows || []).filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(globalQuery.toLowerCase()))).slice(0, 3).map((row) => ({ type, page: pageByType[type] || "Reports", row }))).slice(0, 8);
  }, [globalQuery, data, role]);

  if (!sessionReady) return <LoadingScreen />;
  if (!authenticated) return <AuthScreen onDemo={enterDemo} />;
  if (loadError) return <LoadingScreen error={loadError} onRetry={loadWorkspace}/>;
  if (!profile) return <LoadingScreen />;

  let content: React.ReactNode;
  if (page === "Overview") content = role === "admin" ? <AdminOverview onNavigate={navigate} data={data} /> : <AffiliateOverview onNavigate={navigate} data={data}/>;
  else if (page === "AI content studio") content = <ContentStudio onToast={showToast}/>;
  else if (page === "Settings") content = <SettingsPage profile={profile} onProfile={setProfile} onToast={showToast} onSave={saveProfile}/>;
  else content = <FunctionalDataPage page={page} data={data} role={profile.role} onRefresh={loadWorkspace} onToast={showToast} onCreate={createRecord} onUpdate={updateRecord} onRemove={removeRecord}/>;

  return <div className="app-shell"><aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="sidebar-top"><Logo/><button className="mobile-close" onClick={() => setSidebarOpen(false)}><Icon name="close"/></button></div><div className="role-switcher"><span>Viewing as</span><button disabled={profile.role !== "admin"} onClick={() => { if (profile.role === "admin") { setRole(role === "admin" ? "affiliate" : "admin"); setPage("Overview"); } }}><span className={`role-avatar ${role}`}>{initials(role === "admin" ? profile.name : "Affiliate Preview")}</span><div><strong>{role === "admin" ? "Platform owner" : profile.role === "admin" ? "Affiliate preview" : "Affiliate"}</strong><small>{profile.role === "admin" ? "Switch workspace" : "Creator workspace"}</small></div>{profile.role === "admin" && <Icon name="arrowDown" size={14}/>}</button></div><nav><span className="nav-label">WORKSPACE</span>{nav.map((item) => <button key={item.label} className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><Icon name={item.icon}/><span>{item.label}</span>{item.label === "Payments" && data.payments?.filter((item) => item.status === "Pending").length > 0 && <i className="nav-badge">{data.payments.filter((item) => item.status === "Pending").length}</i>}</button>)}<span className="nav-label settings-label">ACCOUNT</span><button onClick={() => navigate("Settings")} className={page === "Settings" ? "active" : ""}><Icon name="settings"/><span>Settings</span></button></nav><div className="upgrade-card"><span><Icon name="sparkles" size={17}/></span><strong>{demoMode ? "Demo workspace active" : "TryHolo.ai setup required"}</strong><p>{demoMode ? "Data is saved in this browser." : "Add a secure API secret before enabling generation."}</p><button onClick={() => navigate("Settings")}>Manage integrations</button></div><div className="sidebar-help"><span>Need help?</span><button onClick={() => window.location.href = "mailto:support@evellc.shop?subject=Partner Hub Support"}>Email support <Icon name="chevron" size={14}/></button></div></aside>{sidebarOpen && <button className="backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}<main><header><button className="menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button><div className="global-search-wrap"><div className="search"><Icon name="search" size={17}/><input id="global-search" aria-label="Search all records" value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} placeholder="Search affiliates, products, teams..."/><kbd>⌘ K</kbd></div>{globalQuery && <div className="search-results">{searchResults.length ? searchResults.map(({ type, page: resultPage, row }) => <button key={`${type}-${row.id}`} onClick={() => navigate(resultPage)}><span className="list-icon"><Icon name="search" size={15}/></span><div><strong>{row.name || row.action}</strong><small>{resultPage} · {row.status || row.detail}</small></div><Icon name="chevron" size={14}/></button>) : <div className="empty-row">No results found.</div>}</div>}</div><div className="header-actions"><div className="profile-wrap"><button className="icon-button notification" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Icon name="bell"/>{data.activities?.length > 0 && <i/>}</button>{notificationsOpen && <div className="notification-menu"><strong>Recent activity</strong>{data.activities?.slice(0, 4).map((item) => <button key={item.id} onClick={() => navigate("Reports")}><span>{item.action}</span><small>{item.detail}</small></button>)}</div>}</div><div className="profile-wrap"><button className="profile" onClick={() => setProfileOpen(!profileOpen)}><span>{initials(profile.name)}</span><div><strong>{profile.name}</strong><small>{demoMode ? "Demo owner" : profile.role === "admin" ? "Platform owner" : "Affiliate"}</small></div><Icon name="arrowDown" size={14}/></button>{profileOpen && <div className="profile-menu"><button onClick={() => { navigate("Settings"); setProfileOpen(false); }}>View profile</button><button onClick={() => { navigate("Settings"); setProfileOpen(false); }}>Account settings</button><button onClick={async () => { if (demoMode) { localStorage.removeItem("eve-demo-mode"); setDemoMode(false); setAuthenticated(false); setProfile(null); } else await supabase.auth.signOut(); setProfileOpen(false); }}>Sign out</button></div>}</div></div></header><div className="page-content"><div className="page-title"><div><p>{role === "admin" ? "ADMIN WORKSPACE" : "AFFILIATE WORKSPACE"}</p><h1>{page === "Overview" ? `Good morning, ${profile.name.split(" ")[0]}` : page}</h1><span>{page === "Overview" ? role === "admin" ? "Here’s what’s happening across EveLLC today." : "Your community and earnings at a glance." : pageConfigs[page]?.description || "Manage your account and workspace."}</span></div>{page === "Overview" && <div className="date-pill">{new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}<Icon name="check" size={14}/></div>}</div>{content}</div></main>{toast && <div className="toast"><span><Icon name="check" size={15}/></span>{toast}</div>}</div>;
}
