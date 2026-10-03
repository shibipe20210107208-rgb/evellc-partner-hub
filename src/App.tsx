import { useMemo, useState } from "react";

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

const affiliates = [
  { name: "Maya Patel", email: "maya@create.co", team: "Elevate", sales: "$12,480", earned: "$1,872", status: "Active", initials: "MP" },
  { name: "Sofia Kim", email: "sofia@dailyglow.io", team: "Nova", sales: "$9,340", earned: "$1,401", status: "Active", initials: "SK" },
  { name: "Jordan Reed", email: "jordan@jrmedia.com", team: "Elevate", sales: "$7,865", earned: "$1,180", status: "Review", initials: "JR" },
  { name: "David Wu", email: "david@fitfoundry.co", team: "Momentum", sales: "$6,220", earned: "$933", status: "Active", initials: "DW" },
  { name: "Amara Jones", email: "amara@wellness.me", team: "Nova", sales: "$4,970", earned: "$745", status: "Active", initials: "AJ" },
];

const products = [
  { name: "Daily Wellness Bundle", category: "Wellness", price: "$79.00", commission: "15%", status: "Active" },
  { name: "Pro Fitness Resistance Set", category: "Fitness", price: "$42.00", commission: "18%", status: "Active" },
  { name: "Vitamin Essentials Pack", category: "Pharmacy", price: "$54.50", commission: "12%", status: "Active" },
  { name: "Signature Scrub Set", category: "Uniforms", price: "$68.00", commission: "14%", status: "Draft" },
];

function Logo() {
  return (
    <div className="brand">
      <img src="/eve-logo.jpg" alt="Eve LLC" />
      <div><strong>Eve</strong><span>Partner Hub</span></div>
    </div>
  );
}

function Button({ children, variant = "primary", icon, onClick }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; icon?: IconName; onClick?: () => void }) {
  return <button className={`button ${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16} />}{children}</button>;
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
  const bars = [38, 44, 41, 58, 53, 68, 62, 78, 71, 82, 76, 93];
  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <div><h2>{affiliate ? "Your sales performance" : "Revenue performance"}</h2><p>{affiliate ? "Sales and commission earnings" : "Combined revenue across the Eve network"}</p></div>
        <select aria-label="Chart time range" defaultValue="12 months"><option>12 months</option><option>6 months</option><option>30 days</option></select>
      </div>
      <div className="chart-summary">
        <div><span>{affiliate ? "Total sales" : "Gross revenue"}</span><strong>{affiliate ? "$18,640" : "$284,920"}</strong></div>
        <div className="legend"><i></i>{affiliate ? "Commission" : "Net revenue"}</div>
      </div>
      <div className="bar-chart">
        {bars.map((height, index) => <div className="bar-slot" key={index}><div className="bar" style={{ height: `${height}%` }}></div><span>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][index]}</span></div>)}
      </div>
    </article>
  );
}

function ActivityCard() {
  return (
    <article className="panel activity-panel">
      <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest across your network</p></div><button className="text-button">View all</button></div>
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
      <div className="network-grid">{sites.map((site, index) => <button key={site}><span className={`site-icon site-${index}`}><Icon name="globe" size={16} /></span><span>{site}</span><Icon name="chevron" size={15} /></button>)}</div>
    </article>
  );
}

function AdminOverview() {
  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total revenue" value="$284,920" change="+18.2%" tone="purple" icon="chart" />
        <StatCard label="Total affiliates" value="2,846" change="+12.4%" tone="coral" icon="users" />
        <StatCard label="Total sales" value="8,942" change="+9.8%" tone="blue" icon="products" />
        <StatCard label="Pending payouts" value="$18,420" change="-3.1%" tone="amber" icon="wallet" />
      </div>
      <div className="dashboard-grid"><ChartCard /><ActivityCard /></div>
      <div className="dashboard-grid lower">
        <NetworkCard />
        <article className="panel revenue-panel">
          <div className="panel-heading"><div><h2>Revenue breakdown</h2><p>This month</p></div><button className="icon-button"><Icon name="more" /></button></div>
          <div className="donut-wrap"><div className="donut"><div><strong>$38.4K</strong><span>Total</span></div></div><div className="donut-legend"><div><i className="purple-dot"></i><span>Product sales</span><strong>64%</strong></div><div><i className="coral-dot"></i><span>Membership</span><strong>21%</strong></div><div><i className="blue-dot"></i><span>UGC videos</span><strong>15%</strong></div></div></div>
        </article>
      </div>
    </>
  );
}

function AffiliateOverview({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <div className="welcome-card">
        <div><span className="eyebrow">CREATOR SPOTLIGHT</span><h2>Turn your influence into impact.</h2><p>Your links drove 184 clicks this week. Keep the momentum going with fresh AI-powered content.</p><Button icon="sparkles" onClick={() => onNavigate("AI content studio")}>Create content</Button></div>
        <div className="welcome-graphic"><span><Icon name="chart" size={32} /></span><strong>+24%</strong><small>engagement</small></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Total earnings" value="$2,796" change="+18.2%" tone="purple" icon="wallet" />
        <StatCard label="Product sales" value="$18,640" change="+12.4%" tone="coral" icon="products" />
        <StatCard label="Referral earnings" value="$184.50" change="+9.8%" tone="blue" icon="teams" />
        <StatCard label="Pending payout" value="$642.00" change="+4.1%" tone="amber" icon="card" />
      </div>
      <div className="dashboard-grid"><ChartCard affiliate /><ActivityCard /></div>
      <div className="quick-actions">
        <button onClick={() => onNavigate("My links")}><span className="purple"><Icon name="link" /></span><div><strong>Create an affiliate link</strong><small>Share a product and start earning</small></div><Icon name="chevron" /></button>
        <button onClick={() => onNavigate("UGC videos")}><span className="coral"><Icon name="video" /></span><div><strong>Generate a UGC video</strong><small>AI video generation for $1.50</small></div><Icon name="chevron" /></button>
        <button onClick={() => onNavigate("My team")}><span className="blue"><Icon name="users" /></span><div><strong>Invite to your team</strong><small>Earn $0.50 referral commission</small></div><Icon name="chevron" /></button>
      </div>
    </>
  );
}

function DataPage({ page, onToast }: { page: string; onToast: (message: string) => void }) {
  const isAffiliates = page === "Affiliates";
  const isProducts = page === "Product catalog";
  const titles: Record<string, [string, string]> = {
    Affiliates: ["Affiliate management", "Manage creators, account access, and performance."],
    "Teams & referrals": ["Teams & referral network", "Monitor team hierarchy, recruiters, and referral performance."],
    "Product catalog": ["Product catalog", "Manage products across EveLLC marketplaces and campaigns."],
    "Amazon tracking": ["Amazon tracking IDs", "Assign IDs to teams and monitor sales attribution."],
    Commissions: ["Commission management", "Track affiliate, team, and referral commissions."],
    Payments: ["Payments & transactions", "Manage registration, UGC payments, refunds, and payouts."],
    "Content & UGC": ["Content & UGC library", "Review AI-generated content, videos, and generation usage."],
    Reports: ["Reports & analytics", "Performance insights across the entire EveLLC ecosystem."],
    "My links": ["Affiliate links", "Create, share, and monitor your product tracking links."],
    "AI content studio": ["AI content studio", "Create product-specific social content with TryHolo.ai."],
    "UGC videos": ["UGC video studio", "Generate and manage social-ready product videos."],
    "My team": ["My referral team", "Grow your network and track referral commissions."],
    "Earnings & payouts": ["Earnings & payouts", "Review commissions, transactions, and payout details."],
  };
  const [title, description] = titles[page] || [page, "Everything you need, all in one place."];

  if (page === "AI content studio") return <ContentStudio onToast={onToast} />;

  return (
    <>
      <div className="section-title-row"><div><h2>{title}</h2><p>{description}</p></div><Button icon={isProducts ? "plus" : "download"} onClick={() => onToast(isProducts ? "New product draft created" : "Report exported successfully")}>{isProducts ? "Add product" : "Export report"}</Button></div>
      <div className="section-stats">
        <div><span>{isAffiliates ? "Active affiliates" : isProducts ? "Active products" : "This month"}</span><strong>{isAffiliates ? "2,719" : isProducts ? "1,284" : "$38,420"}</strong><small>↑ 12.4% from last month</small></div>
        <div><span>{isAffiliates ? "Pending approval" : isProducts ? "In campaigns" : "Pending"}</span><strong>{isAffiliates ? "42" : isProducts ? "836" : "$8,420"}</strong><small>Requires your attention</small></div>
        <div><span>{isAffiliates ? "Suspended" : isProducts ? "Categories" : "Completed"}</span><strong>{isAffiliates ? "85" : isProducts ? "18" : "1,842"}</strong><small>Updated today</small></div>
      </div>
      <article className="panel table-panel">
        <div className="table-toolbar"><div className="search small"><Icon name="search" size={16}/><input aria-label="Search records" placeholder={`Search ${page.toLowerCase()}...`} /></div><div className="filters"><button>All status <Icon name="arrowDown" size={14}/></button><button>Newest first <Icon name="arrowDown" size={14}/></button></div></div>
        {isAffiliates ? (
          <div className="table-scroll"><table><thead><tr><th>Affiliate</th><th>Team</th><th>Total sales</th><th>Earned</th><th>Status</th><th></th></tr></thead><tbody>{affiliates.map((row) => <tr key={row.email}><td><div className="person"><span className="avatar purple">{row.initials}</span><div><strong>{row.name}</strong><small>{row.email}</small></div></div></td><td>{row.team}</td><td><strong>{row.sales}</strong></td><td>{row.earned}</td><td><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td><td><button className="icon-button"><Icon name="more"/></button></td></tr>)}</tbody></table></div>
        ) : isProducts ? (
          <div className="table-scroll"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Commission</th><th>Status</th><th></th></tr></thead><tbody>{products.map((row, index) => <tr key={row.name}><td><div className="person"><span className={`product-thumb thumb-${index}`}><Icon name="products"/></span><strong>{row.name}</strong></div></td><td>{row.category}</td><td><strong>{row.price}</strong></td><td>{row.commission}</td><td><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td><td><button className="icon-button"><Icon name="more"/></button></td></tr>)}</tbody></table></div>
        ) : <GenericPage page={page} onToast={onToast} />}
      </article>
    </>
  );
}

function GenericPage({ page, onToast }: { page: string; onToast: (message: string) => void }) {
  const items = [
    { title: `${page} summary`, meta: "Updated 5 minutes ago", value: "$12,480", status: "Active" },
    { title: "Elevate creator campaign", meta: "42 participating affiliates", value: "$8,942", status: "Active" },
    { title: "Wellness product launch", meta: "Global marketplace", value: "$6,204", status: "Review" },
    { title: "November performance", meta: "Monthly report", value: "$4,820", status: "Active" },
  ];
  return <div className="generic-list">{items.map((item, index) => <button key={item.title} onClick={() => onToast(`${item.title} opened`)}><span className={`list-icon list-${index}`}><Icon name={page.includes("video") || page.includes("Content") ? "video" : "chart"}/></span><div><strong>{item.title}</strong><small>{item.meta}</small></div><span className="list-value">{item.value}</span><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span><Icon name="chevron"/></button>)}</div>;
}

function ContentStudio({ onToast }: { onToast: (message: string) => void }) {
  const [caption, setCaption] = useState("");
  const [generated, setGenerated] = useState(false);
  const generate = () => {
    setGenerated(true);
    setCaption("Your everyday wellness, elevated. Discover the Daily Wellness Bundle from EveLLC—thoughtfully curated essentials for feeling your best, every day. Shop through my link and start your routine today. #EveWellness #EverydayHealth");
    onToast("New content generated with TryHolo.ai");
  };
  return (
    <>
      <div className="section-title-row"><div><h2>AI content studio</h2><p>Create conversion-ready content powered by TryHolo.ai.</p></div><span className="credit-pill"><Icon name="sparkles" size={15}/> 24 credits remaining</span></div>
      <div className="studio-grid">
        <article className="panel studio-form"><h3>Create something new</h3><label>Choose a product<select><option>Daily Wellness Bundle</option><option>Vitamin Essentials Pack</option><option>Pro Fitness Resistance Set</option></select></label><label>Content format<div className="format-grid"><button className="selected">Instagram caption</button><button>TikTok script</button><button>Email copy</button><button>Product review</button></div></label><label>Brand tone<select><option>Warm & authentic</option><option>Bold & energetic</option><option>Clear & educational</option></select></label><Button icon="sparkles" onClick={generate}>Generate content</Button><small className="cost-note">Uses 1 TryHolo.ai credit</small></article>
        <article className={`panel output-card ${generated ? "generated" : ""}`}>
          {generated ? <><div className="panel-heading"><div><span className="eyebrow">GENERATED COPY</span><h3>Instagram caption</h3></div><button className="icon-button" onClick={() => { navigator.clipboard?.writeText(caption); onToast("Caption copied to clipboard"); }}><Icon name="copy"/></button></div><textarea value={caption} onChange={(e) => setCaption(e.target.value)} /><div className="output-footer"><span>{caption.length} characters</span><div><Button variant="secondary" icon="download" onClick={() => onToast("Content saved to your library")}>Save</Button><Button icon="copy" onClick={() => { navigator.clipboard?.writeText(caption); onToast("Caption copied to clipboard"); }}>Copy</Button></div></div></> : <div className="empty-output"><span><Icon name="sparkles" size={28}/></span><h3>Your content will appear here</h3><p>Choose a product and format, then let TryHolo.ai create something compelling.</p></div>}
        </article>
      </div>
    </>
  );
}

export default function App() {
  const [role, setRole] = useState<"admin" | "affiliate">("admin");
  const [page, setPage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const nav = role === "admin" ? adminNav : affiliateNav;
  const pageDescription = role === "admin" ? "Here’s what’s happening across EveLLC today." : "Welcome back, Maya. Your community is growing.";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const navigate = (label: string) => {
    setPage(label);
    setSidebarOpen(false);
  };

  const content = useMemo(() => {
    if (page === "Overview") return role === "admin" ? <AdminOverview /> : <AffiliateOverview onNavigate={navigate} />;
    return <DataPage page={page} onToast={showToast} />;
  }, [page, role]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top"><Logo /><button className="mobile-close" onClick={() => setSidebarOpen(false)}><Icon name="close"/></button></div>
        <div className="role-switcher"><span>Viewing as</span><button onClick={() => { setRole(role === "admin" ? "affiliate" : "admin"); setPage("Overview"); }}><span className={`role-avatar ${role}`}>{role === "admin" ? "AO" : "MP"}</span><div><strong>{role === "admin" ? "Platform owner" : "Affiliate"}</strong><small>{role === "admin" ? "Admin workspace" : "Creator workspace"}</small></div><Icon name="arrowDown" size={14}/></button></div>
        <nav>
          <span className="nav-label">WORKSPACE</span>
          {nav.map((item) => <button key={item.label} className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><Icon name={item.icon}/><span>{item.label}</span>{item.label === "Payments" && <i className="nav-badge">8</i>}</button>)}
          <span className="nav-label settings-label">ACCOUNT</span>
          <button onClick={() => navigate("Settings")} className={page === "Settings" ? "active" : ""}><Icon name="settings"/><span>Settings</span></button>
        </nav>
        <div className="upgrade-card"><span><Icon name="sparkles" size={17}/></span><strong>TryHolo.ai connected</strong><p>All systems are operating normally.</p><button onClick={() => showToast("Integration settings opened")}>Manage integration</button></div>
        <div className="sidebar-help"><span>Need help?</span><button onClick={() => showToast("Support center opened")}>Visit support center <Icon name="chevron" size={14}/></button></div>
      </aside>
      {sidebarOpen && <button className="backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <main>
        <header>
          <button className="menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button>
          <div className="search"><Icon name="search" size={17}/><input aria-label="Search" placeholder="Search affiliates, products, teams..." /><kbd>⌘ K</kbd></div>
          <div className="header-actions">
            <button className="icon-button notification" aria-label="Notifications" onClick={() => showToast("You have 3 new notifications")}><Icon name="bell"/><i></i></button>
            <div className="profile-wrap"><button className="profile" onClick={() => setProfileOpen(!profileOpen)}><span>{role === "admin" ? "AO" : "MP"}</span><div><strong>{role === "admin" ? "Avery Owens" : "Maya Patel"}</strong><small>{role === "admin" ? "Platform owner" : "@mayacreates"}</small></div><Icon name="arrowDown" size={14}/></button>{profileOpen && <div className="profile-menu"><button onClick={() => showToast("Profile opened")}>View profile</button><button onClick={() => navigate("Settings")}>Account settings</button><button onClick={() => showToast("Signed out safely")}>Sign out</button></div>}</div>
          </div>
        </header>
        <div className="page-content">
          <div className="page-title"><div><p>{role === "admin" ? "ADMIN WORKSPACE" : "AFFILIATE WORKSPACE"}</p><h1>{page === "Overview" ? "Good morning, " + (role === "admin" ? "Avery" : "Maya") : page}</h1><span>{page === "Overview" ? pageDescription : "Manage and monitor your " + page.toLowerCase() + "."}</span></div>{page === "Overview" && <div className="date-pill">Nov 1 – Nov 30, 2025 <Icon name="arrowDown" size={14}/></div>}</div>
          {content}
        </div>
      </main>
      {toast && <div className="toast"><span><Icon name="check" size={15}/></span>{toast}</div>}
    </div>
  );
}
