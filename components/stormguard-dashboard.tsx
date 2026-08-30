"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock3,
  Command,
  Download,
  Eye,
  FileWarning,
  Filter,
  Flame,
  Globe2,
  Hash,
  Hexagon,
  Keyboard,
  Layers3,
  LockKeyhole,
  Menu,
  Network,
  Play,
  Radio,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Target,
  Timer,
  TrendingUp,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react"

const threats = [
  { id: "T-9421", title: "Encoded PowerShell beacon", type: "Command & Control", severity: "CRITICAL", score: 98, time: "09:41:22", host: "WKSTN-442", user: "jsmith", tactic: "T1059.001", detail: "A signed binary proxy execution chain opened an outbound TLS session to a rare ASN after a macro payload ran." },
  { id: "T-9417", title: "Lateral SMB movement", type: "Lateral Movement", severity: "HIGH", score: 84, time: "09:39:08", host: "SRV-DB-07", user: "svc_backup", tactic: "T1021.002", detail: "Unexpected admin share access followed a burst of failed authentication attempts from an unmanaged workstation." },
  { id: "T-9403", title: "Credential dumping signature", type: "Credential Access", severity: "HIGH", score: 77, time: "09:35:44", host: "WKSTN-119", user: "akhan", tactic: "T1003", detail: "Memory access pattern matches a known credential extraction family, but execution was blocked by endpoint policy." },
  { id: "T-9398", title: "DNS tunneling anomaly", type: "Exfiltration", severity: "MEDIUM", score: 63, time: "09:30:19", host: "IOT-GW-02", user: "system", tactic: "T1048.003", detail: "High-entropy subdomains exceeded the baseline for this device class across three consecutive intervals." },
]

const featureRows = [
  ["Destination Port", "+0.31", "high"],
  ["Flow Bytes/s", "+0.24", "high"],
  ["Protocol: TCP", "+0.18", "high"],
  ["Connection State", "+0.11", "med"],
  ["Packet Length Mean", "+0.07", "med"],
  ["Source Bytes", "−0.04", "low"],
]

const timeline = [
  ["09:28:11", "Reconnaissance", "Port sweep detected", "cyan"],
  ["09:30:19", "Discovery", "DNS entropy spike", "cyan"],
  ["09:35:44", "Credential Access", "LSASS access blocked", "yellow"],
  ["09:39:08", "Lateral Movement", "SMB admin share hit", "orange"],
  ["09:41:22", "Command & Control", "PowerShell beacon", "red"],
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label"><span className="section-mark" />{children}</div>
}

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return <button aria-label={label} title={label} onClick={onClick} className="icon-button">{children}</button>
}

function SeverityBadge({ severity }: { severity: string }) {
  return <span className={`severity severity-${severity.toLowerCase()}`}><span className="status-dot" />{severity}</span>
}

function Radar() {
  const rings = [20, 39, 58, 77]
  const points = [[50, 20], [82, 39], [78, 70], [51, 82], [20, 65], [18, 38], [50, 50]]
  return <div className="radar-wrap" aria-label="Storm Radar threat concentration visualization">
    <svg viewBox="0 0 100 100" role="img">
      <circle cx="50" cy="50" r="45" className="radar-ring radar-outer" />
      {rings.map((r) => <circle key={r} cx="50" cy="50" r={r / 2} className="radar-ring" />)}
      <path d="M50 5V95M5 50H95M18 18L82 82M82 18L18 82" className="radar-grid" />
      <path d="M50 50 L50 20 L82 39 L78 70 L51 82 L20 65 L18 38 Z" className="radar-shape" />
      {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 6 ? 2.3 : 1.8} className={i === 6 ? "radar-core" : "radar-point"} />)}
      <circle cx="50" cy="50" r="44" className="radar-sweep" />
    </svg>
    <span className="radar-axis north">C2</span><span className="radar-axis east">LAT</span><span className="radar-axis south">EXFIL</span><span className="radar-axis west">CRED</span>
    <div className="radar-caption"><span className="live-dot" />LIVE SIGNAL FIELD <span className="muted">/ 60 SEC</span></div>
  </div>
}

function NetworkGraph({ onNode }: { onNode: (node: string) => void }) {
  const nodes = [
    ["WKSTN-442", 52, 52, "critical"], ["SRV-DB-07", 78, 25, "high"], ["DC-01", 24, 26, "normal"], ["FW-EDGE", 79, 75, "normal"], ["IOT-GW", 26, 76, "medium"], ["EXT-API", 52, 16, "normal"],
  ] as const
  return <div className="network-graph" aria-label="Bifrost network graph">
    <svg viewBox="0 0 100 100" role="img">
      <path d="M52 52 L78 25 M52 52 L24 26 M52 52 L79 75 M52 52 L26 76 M52 52 L52 16" className="network-edge active" />
      <path d="M24 26 L52 16 M78 25 L79 75 M26 76 L79 75" className="network-edge" />
      {nodes.map(([name, x, y, state]) => <g key={name} className="network-node" onClick={() => onNode(name)} tabIndex={0} role="button" aria-label={`Inspect ${name}`}><circle cx={x} cy={y} r={state === "critical" ? 6 : 4.5} className={`node-${state}`} /><circle cx={x} cy={y} r={state === "critical" ? 9 : 7} className="node-halo" /><text x={x} y={y + 13} textAnchor="middle">{name}</text></g>)}
    </svg>
    <div className="graph-legend"><span><i className="legend-dot dot-critical" />Critical</span><span><i className="legend-dot dot-high" />High</span><span><i className="legend-dot dot-normal" />Baseline</span></div>
  </div>
}

export default function StormGuardDashboard() {
  const [active, setActive] = useState("overview")
  const [selected, setSelected] = useState(threats[0])
  const [drawer, setDrawer] = useState(false)
  const [sidebar, setSidebar] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [simStep, setSimStep] = useState(3)
  const [filter, setFilter] = useState("ALL")
  const [commandOpen, setCommandOpen] = useState(false)
  const [phishing, setPhishing] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => { if (!simulating) return; const timer = window.setInterval(() => setSimStep((s) => s >= 5 ? 1 : s + 1), 1100); return () => window.clearInterval(timer) }, [simulating])
  useEffect(() => { const key = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true) } if (event.key === "Escape") { setCommandOpen(false); setDrawer(false) } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key) }, [])

  const filteredThreats = useMemo(() => filter === "ALL" ? threats : threats.filter((threat) => threat.severity === filter), [filter])
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600) }
  const investigate = (threat: typeof threats[number]) => { setSelected(threat); setDrawer(true) }
  const exportReport = () => { const blob = new Blob([`STORMGUARD AI // INCIDENT REPORT\nGenerated: ${new Date().toISOString()}\n\nPriority incident: ${selected.title}\nHost: ${selected.host}\nTactic: ${selected.tactic}\nRisk score: ${selected.score}/100\n\n${selected.detail}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `stormguard-${selected.id}.txt`; anchor.click(); URL.revokeObjectURL(url); notify("Incident report exported") }

  return <div className="stormguard-shell">
    <aside className={`sidebar ${sidebar ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="brand"><div className="brand-mark"><Hexagon /></div><div><strong>STORMGUARD</strong><span>AI SECURITY OPERATIONS</span></div></div>
      <div className="demo-tag"><span className="live-dot" />DEMO MODE <span className="demo-divider" /> UNSW-NB15</div>
      <nav className="main-nav" aria-label="Primary navigation">
        <button className={active === "overview" ? "nav-item active" : "nav-item"} onClick={() => setActive("overview")}><Layers3 />Overview <span className="nav-count">01</span></button>
        <Link className="nav-item" href="/incidents"><TriangleAlert />Threats <span className="nav-count danger">04</span></Link>
        <Link className="nav-item" href="/explorer"><Network />Network <span className="nav-count">12</span></Link>
        <Link className="nav-item" href="/data-model"><BrainCircuit />Models <span className="nav-count">03</span></Link>
      </nav>
      <div className="nav-divider" />
      <div className="nav-heading">OPERATIONS</div>
      <nav className="main-nav"><Link className="nav-item" href="/timeline"><Clock3 />Timeline</Link><button className="nav-item" onClick={() => setPhishing(true)}><FileWarning />Phishing Lab</button><Link className="nav-item" href="/settings"><LockKeyhole />Settings</Link></nav>
      <div className="sidebar-bottom"><div className="agent-card"><div className="agent-orbit"><Bot /></div><div><strong>ODIN AGENT</strong><span>ONLINE / v0.8.4</span></div><span className="live-dot" /></div><button className="user-row" onClick={() => notify("Analyst profile: Alex Morgan")}><span className="avatar">AM</span><span><strong>Alex Morgan</strong><small>Security Analyst</small></span><ChevronRight /></button></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="topbar-left"><IconButton label="Toggle navigation" onClick={() => setSidebar(!sidebar)}><Menu /></IconButton><div className="breadcrumb"><span>COMMAND CENTER</span><ChevronRight /><strong>LIVE OVERVIEW</strong></div></div><div className="topbar-actions"><div className="system-health"><span className="live-dot" />SYSTEM NOMINAL</div><button className="command-trigger" onClick={() => setCommandOpen(true)}><Search />Search commands <kbd><Command />K</kbd></button><IconButton label="Notifications" onClick={() => notify("No new critical notifications")}><Bell /><span className="notification-dot" /></IconButton><IconButton label="Refresh data" onClick={() => notify("Signal field synchronized")}><RefreshCw /></IconButton></div></header>
      <div className="content-wrap">
        <section className="page-heading"><div><div className="eyebrow"><span className="pulse-line" />SOC // REAL-TIME TELEMETRY</div><h1>Storm <em>Command</em></h1><p>AI-augmented network defense. Detect the signal before it becomes a storm.</p></div><div className="heading-actions"><button className={`simulation-button ${simulating ? "is-running" : ""}`} onClick={() => setSimulating(!simulating)}>{simulating ? <Square /> : <Play />}{simulating ? "STOP SIMULATION" : "RUN STORM SIMULATION"}</button><button className="outline-button" onClick={exportReport}><Download />EXPORT REPORT</button></div></section>

        <section className="kpi-grid" aria-label="Security metrics"><div className="kpi-card kpi-alert"><span className="kpi-icon"><Zap /></span><span className="kpi-label">ACTIVE THREATS</span><strong>{simulating && simStep >= 4 ? "05" : "04"}</strong><span className="kpi-meta up"><TrendingUp /> +2 in last hour</span></div><div className="kpi-card"><span className="kpi-icon"><Target /></span><span className="kpi-label">RISK SCORE</span><strong>{simulating && simStep >= 4 ? "91" : "87"}<small>/100</small></strong><span className="kpi-meta down">−4.2% from baseline</span></div><div className="kpi-card"><span className="kpi-icon"><ShieldCheck /></span><span className="kpi-label">BLOCKED TODAY</span><strong>1,284</strong><span className="kpi-meta up"><TrendingUp /> +18.6% efficiency</span></div><div className="kpi-card"><span className="kpi-icon"><Timer /></span><span className="kpi-label">MEAN RESPONSE</span><strong>42<small>ms</small></strong><span className="kpi-meta neutral">−12ms vs. last week</span></div></section>

        <section className="visual-grid"><article className="panel radar-panel"><div className="panel-header"><div><SectionLabel>STORM RADAR</SectionLabel><h2>Threat concentration</h2></div><div className="panel-tools"><span className="live-status"><span className="live-dot" />LIVE</span><IconButton label="Radar options"><ChevronDown /></IconButton></div></div><Radar /><div className="radar-footer"><span><i className="legend-dot dot-cyan" />Network</span><span><i className="legend-dot dot-magenta" />Endpoint</span><span><i className="legend-dot dot-yellow" />Identity</span><span className="radar-time">Updated 09:42:01 UTC</span></div></article><article className="panel network-panel"><div className="panel-header"><div><SectionLabel>BIFROST NETWORK</SectionLabel><h2>Live attack surface</h2></div><button className="text-button" onClick={() => setActive("network")}>EXPLORE <ChevronRight /></button></div><NetworkGraph onNode={(node) => notify(`${node} selected for inspection`)} /><div className="network-footer"><span><CircleDot /> 12 monitored nodes</span><span><Activity /> 3 active paths</span><span className="danger-text">● 1 compromised</span></div></article></section>

        <section className="lower-grid"><article className="panel threats-panel"><div className="panel-header"><div><SectionLabel>MJOLNIR PRIORITY ENGINE</SectionLabel><h2>Threat queue <span className="count-pill">04</span></h2></div><div className="filter-row"><Filter /><select aria-label="Filter threats" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">ALL SEVERITIES</option><option value="CRITICAL">CRITICAL</option><option value="HIGH">HIGH</option><option value="MEDIUM">MEDIUM</option></select></div></div><div className="threat-table"><div className="table-head"><span>THREAT SIGNAL</span><span>SEVERITY</span><span>RISK</span><span>DETECTED</span><span /></div>{filteredThreats.map((threat) => <button className={`threat-row ${selected.id === threat.id ? "selected" : ""}`} key={threat.id} onClick={() => investigate(threat)}><span className="threat-name"><span className={`threat-glyph glyph-${threat.severity.toLowerCase()}`}><AlertTriangle /></span><span><strong>{threat.title}</strong><small>{threat.id} · {threat.type}</small></span></span><SeverityBadge severity={threat.severity} /><span className="risk-score">{threat.score}<small>/100</small></span><span className="detected-time">{threat.time}<small>{threat.host}</small></span><ChevronRight /></button>)}</div></article><article className="panel intelligence-panel"><div className="panel-header"><div><SectionLabel>ODIN INTELLIGENCE</SectionLabel><h2>Model signal</h2></div><span className="model-tag">XGBOOST <span>v2.1</span></span></div><div className="confidence-block"><div className="confidence-ring"><strong>94</strong><span>%</span><small>CONFIDENCE</small></div><div><span className="classification">CLASSIFICATION</span><strong className="classification-value">ANOMALOUS</strong><p>Behavior strongly deviates from learned baseline.</p></div></div><div className="feature-list"><div className="feature-header"><span>TOP CONTRIBUTING FEATURES</span><span>SHAP VALUE</span></div>{featureRows.map(([name, value, level]) => <div className="feature-row" key={name}><span>{name}</span><span className={`feature-bar bar-${level}`}><i /></span><strong className={value.startsWith("−") ? "negative" : ""}>{value}</strong></div>)}</div><button className="odin-button" onClick={() => investigate(selected)}><Sparkles />ASK ODIN TO INVESTIGATE <ChevronRight /></button></article></section>

        <section className="bottom-grid"><article className="panel timeline-panel"><div className="panel-header"><div><SectionLabel>ATTACK PATH</SectionLabel><h2>Incident timeline</h2></div><button className="text-button" onClick={() => setActive("timeline")}>FULL TIMELINE <ChevronRight /></button></div><div className="timeline">{timeline.map(([time, label, desc, tone], i) => <div className={`timeline-item tone-${tone} ${simulating && simStep === i + 1 ? "current" : ""}`} key={time}><span className="timeline-dot" /><div><time>{time}</time><strong>{label}</strong><p>{desc}</p></div>{i < timeline.length - 1 && <span className="timeline-line" />}</div>)}</div></article><article className="panel distribution-panel"><div className="panel-header"><div><SectionLabel>DATASET DISTRIBUTION</SectionLabel><h2>Attack categories</h2></div><span className="dataset-tag">UNSW-NB15 <span>DEMO</span></span></div><div className="distribution-bars">{[["Normal", 76, "normal"], ["Exploits", 42, "cyan"], ["Generic", 31, "magenta"], ["Fuzzers", 24, "yellow"], ["DoS", 18, "orange"]].map(([label, width, tone]) => <div className="dist-row" key={label}><span>{label}</span><div><i className={`dist-bar ${tone}`} style={{ width: `${width}%` }} /></div><strong>{width === 76 ? "76.2%" : `${width}%`}</strong></div>)}</div><div className="distribution-note"><Radio /> Real-time classification feed <span>12,440 flows analyzed</span></div></article></section>
        <footer className="footer-bar"><span><span className="live-dot" /> All systems operational</span><span>StormGuard AI <b>v0.8.4</b> · Demo environment</span><span>Last sync 09:42:01 UTC</span></footer>
      </div>
    </main>

    {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(false)}><aside className="investigation-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><SectionLabel>INVESTIGATION</SectionLabel><h2>{selected.id}</h2></div><IconButton label="Close investigation" onClick={() => setDrawer(false)}><X /></IconButton></div><div className="drawer-alert"><span className="threat-glyph glyph-critical"><AlertTriangle /></span><div><SeverityBadge severity={selected.severity} /><h3>{selected.title}</h3><p>{selected.detail}</p></div></div><div className="drawer-facts"><div><span>RISK SCORE</span><strong>{selected.score}/100</strong></div><div><span>MITRE TACTIC</span><strong>{selected.tactic}</strong></div><div><span>HOST</span><strong>{selected.host}</strong></div><div><span>USER</span><strong>{selected.user}</strong></div></div><div className="odin-note"><Sparkles /><div><strong>ODIN ASSESSMENT</strong><p>Containment recommended. The signal is consistent with an active intrusion chain. Preserve endpoint evidence before isolation.</p></div></div><div className="drawer-actions"><button className="contain-button" onClick={() => { notify(`${selected.host} containment queued`); setDrawer(false) }}><ShieldCheck />ISOLATE HOST</button><button className="outline-button" onClick={() => notify("Threat marked as acknowledged")}><Eye />ACKNOWLEDGE</button></div><button className="drawer-report" onClick={exportReport}><Download /> Export incident evidence report</button></aside></div>}
    {commandOpen && <div className="command-backdrop" onClick={() => setCommandOpen(false)}><div className="command-modal" onClick={(event) => event.stopPropagation()}><div className="command-input"><Search /><input autoFocus placeholder="Search commands, hosts, or threats..." /><kbd>ESC</kbd></div><div className="command-section"><span>QUICK ACTIONS</span><button onClick={() => { setCommandOpen(false); setSimulating(true) }}><Play />Run storm simulation <kbd>R</kbd></button><button onClick={() => { setCommandOpen(false); exportReport() }}><Download />Export incident report <kbd>E</kbd></button><button onClick={() => { setCommandOpen(false); setPhishing(true) }}><FileWarning />Open phishing lab</button></div><div className="command-section"><span>JUMP TO</span><button onClick={() => { setCommandOpen(false); setActive("overview") }}><Layers3 />Overview</button><button onClick={() => { setCommandOpen(false); setActive("threats") }}><TriangleAlert />Threat queue</button></div></div></div>}
    {phishing && <div className="drawer-backdrop" onClick={() => setPhishing(false)}><aside className="investigation-drawer lab-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><SectionLabel>ODIN PHISHING LAB</SectionLabel><h2>Email triage</h2></div><IconButton label="Close phishing lab" onClick={() => setPhishing(false)}><X /></IconButton></div><div className="email-card"><span className="email-warning"><FileWarning /> SUSPICIOUS MESSAGE</span><strong>Invoice overdue — action required</strong><small>billing@acme-payrnents.com</small><p>Your account will be suspended. Review the attached invoice immediately to avoid service interruption.</p><div className="email-link">hxxps://acme-payrnents[.]com/secure/invoice</div></div><div className="odin-note"><BrainCircuit /><div><strong>ODIN VERDICT</strong><p>High confidence phishing. Lookalike domain, urgency language, and credential harvesting link detected.</p></div></div><button className="contain-button" onClick={() => { notify("Phishing sample quarantined"); setPhishing(false) }}><ShieldCheck />QUARANTINE SAMPLE</button></aside></div>}
    {toast && <div className="toast"><ShieldCheck />{toast}</div>}
  </div>
}
