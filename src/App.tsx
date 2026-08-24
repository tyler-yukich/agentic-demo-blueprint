import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, BatteryCharging, Bot, BriefcaseBusiness, Building2, CalendarDays,
  Check, ChevronRight, CircleGauge, CloudLightning, FileText, Home, Inbox,
  Mail, MapPin, MessageSquareText, Power, ShieldCheck, Sparkles, UserRound,
  UsersRound, Wifi, Wrench
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { accounts, atRiskAccounts, businessAccount, dateFromToday, eligibleAccounts, householdAccount, workflowSummary } from './data/fixtures';
import type { DemoAccount, ToolId, ToolState } from './data/types';
import { beaconReply, defaultTools, toolLabels } from './lib/agent';

type Page = 'home' | 'business' | 'consumer' | 'beacon';

const money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

function Brand() {
  return (
    <div className="brand">
      <img src="/readycurrent-mark.svg" alt="" />
      <div><strong>ReadyCurrent</strong><span>Resilience workspace</span></div>
    </div>
  );
}

function Navigation({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  const items: Array<{ id: Page; label: string; icon: LucideIcon }> = [
    { id: 'home', label: 'Seller Home', icon: Home },
    { id: 'business', label: 'Business Account', icon: Building2 },
    { id: 'consumer', label: 'Consumer Profile', icon: UserRound },
    { id: 'beacon', label: 'Beacon', icon: Bot }
  ];
  return (
    <aside className="sidebar">
      <Brand />
      <nav aria-label="Primary navigation">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="demo-badge"><ShieldCheck size={16} /><span>Fictional demo data</span></div>
    </aside>
  );
}

function Metric({ icon: Icon, label, value, detail, tone = 'teal' }: { icon: LucideIcon; label: string; value: string; detail: string; tone?: string }) {
  return (
    <article className={`metric ${tone}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <span>{label}</span><strong>{value}</strong><small>{detail}</small>
    </article>
  );
}

const workflowSteps = [
  { title: 'Assess exposure', detail: `Evaluate ${workflowSummary.population} fictional accounts`, icon: CloudLightning },
  { title: 'Identify coverage gaps', detail: `${workflowSummary.atRisk} elevated-risk accounts`, icon: CircleGauge },
  { title: 'Apply program policy', detail: `${workflowSummary.eligible} meet the staged Resilience Credit`, icon: ShieldCheck },
  { title: 'Personalize outreach', detail: `${workflowSummary.drafts} drafts prepared for review`, icon: Mail },
  { title: 'Notify the seller', detail: 'Ready for human review in Slack and Salesforce', icon: MessageSquareText }
];

function WorkflowCard() {
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const timers = useRef<number[]>([]);

  const start = () => {
    timers.current.forEach(window.clearTimeout);
    setRunning(true); setActive(0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    workflowSteps.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setActive(index), reduce ? index * 80 : index * 720));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), reduce ? 500 : workflowSteps.length * 720));
  };

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return (
    <section className="workflow-card">
      <div className="workflow-header">
        <div>
          <span className="eyebrow"><CloudLightning size={15} /> Regional outage risk · elevated</span>
          <h2>Turn a grid alert into governed outreach</h2>
          <p>This Level 1 workflow is deterministic. It demonstrates the experience without claiming live segmentation.</p>
        </div>
        <button className="primary" onClick={start} disabled={running}><Sparkles size={16} />{running ? 'Beacon is working…' : 'Run resilience play'}</button>
      </div>
      <div className="workflow-track" aria-live="polite">
        {workflowSteps.map(({ title, detail, icon: Icon }, index) => {
          const state = active > index ? 'done' : active === index ? 'current' : '';
          return (
            <div className={`workflow-step ${state}`} key={title}>
              <div className="step-icon">{state === 'done' ? <Check size={17} /> : <Icon size={17} />}</div>
              <div><strong>{title}</strong><span>{detail}</span></div>
              {index < workflowSteps.length - 1 && <ChevronRight className="step-arrow" size={16} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SellerHome({ navigate }: { navigate: (page: Page) => void }) {
  const pipeline = accounts.reduce((total, account) => total + account.annualValue, 0);
  const actions: Array<[string, string, LucideIcon]> = [
    ['Review outage-resilience drafts', `${workflowSummary.drafts} staged messages`, Mail],
    ['Prepare business-account call', businessAccount.name, Building2],
    ['Check household service case', householdAccount.contactName, Wrench]
  ];
  return (
    <main>
      <header className="page-header"><div><span className="eyebrow">Monday · {dateFromToday(0)}</span><h1>Good morning, Avery</h1><p>Here is what deserves your attention across the resilience portfolio.</p></div><div className="avatar">AC</div></header>
      <div className="metrics">
        <Metric icon={BriefcaseBusiness} label="Open portfolio" value={money.format(pipeline)} detail="100 fictional accounts" />
        <Metric icon={CloudLightning} label="Elevated exposure" value={String(atRiskAccounts.length)} detail="Regional risk window" tone="amber" />
        <Metric icon={ShieldCheck} label="Credit eligible" value={String(eligibleAccounts.length)} detail="Staged policy result" tone="blue" />
        <Metric icon={BatteryCharging} label="Monitoring active" value="64%" detail="Across installed base" tone="mint" />
      </div>
      <WorkflowCard />
      <div className="two-column">
        <section className="panel">
          <div className="section-title"><div><span className="eyebrow">Prioritized accounts</span><h2>Coverage gaps to review</h2></div><button className="text-button" onClick={() => navigate('business')}>Open business profile <ChevronRight size={15} /></button></div>
          <div className="account-list">
            {atRiskAccounts.slice(0, 5).map((account, index) => <AccountRow key={account.id} account={account} rank={index + 1} />)}
          </div>
        </section>
        <section className="panel action-panel">
          <div className="section-title"><div><span className="eyebrow">Seller actions</span><h2>Ready for today</h2></div></div>
          {actions.map(([title, detail, Icon], index) => (
            <label className="action-item" key={String(title)}><input type="checkbox" defaultChecked={index === 2} /><span className="fake-check"><Check size={12} /></span><span className="action-icon"><Icon size={16} /></span><span><strong>{String(title)}</strong><small>{String(detail)}</small></span></label>
          ))}
        </section>
      </div>
    </main>
  );
}

function AccountRow({ account, rank }: { account: DemoAccount; rank: number }) {
  return (
    <div className="account-row">
      <span className="rank">{rank}</span><div className="account-avatar">{account.segment === 'Business' ? <Building2 size={18} /> : <UserRound size={18} />}</div>
      <div className="account-name"><strong>{account.name}</strong><span><MapPin size={12} />{account.city}, {account.region}</span></div>
      <span className="product">{account.installedProduct}</span>
      <span className="risk-pill">{account.outageExposure}</span>
    </div>
  );
}

function ProfilePage({ account, consumer = false }: { account: DemoAccount; consumer?: boolean }) {
  const signals: Array<[string, string, LucideIcon]> = consumer
    ? [['Commerce', 'Replacement battery viewed twice', Inbox], ['Service', 'Runtime calibration case resolved', Wrench], ['Engagement', 'Outage guide opened yesterday', Activity]]
    : [['Operations', 'Two remote crews added this quarter', UsersRound], ['Service', 'Runtime alert on one field unit', Wrench], ['Engagement', 'Fleet coverage brief downloaded', FileText]];
  return (
    <main>
      <header className="profile-hero">
        <div className={`profile-mark ${consumer ? 'person' : ''}`}>{consumer ? <UserRound size={30} /> : <Building2 size={30} />}</div>
        <div className="profile-title"><span className="eyebrow">{consumer ? 'Unified household profile' : 'Unified business profile'}</span><h1>{consumer ? account.contactName : account.name}</h1><p><MapPin size={14} />{account.city}, {account.region} · {account.segment}</p></div>
        <div className="profile-scores"><div><span>Resilience readiness</span><strong>{consumer ? '72' : '68'}</strong></div><div><span>Expansion fit</span><strong>{consumer ? '54' : '91'}</strong></div><div><span>Service health</span><strong>{consumer ? '88' : '76'}</strong></div></div>
      </header>
      <div className="profile-grid">
        <section className="panel equipment-card"><div className="section-title"><div><span className="eyebrow">Installed relationship</span><h2>Equipment and coverage</h2></div></div>
          <div className="equipment-visual"><BatteryCharging size={38} /><div><strong>{account.installedProduct}</strong><span>Installed backup-power system</span></div></div>
          <dl><div><dt>Monitoring plan</dt><dd>{account.monitoringPlan}</dd></div><div><dt>Last active</dt><dd>{account.lastPlanActiveDaysAgo} days ago</dd></div><div><dt>Annual relationship</dt><dd>{money.format(account.annualValue)}</dd></div><div><dt>Outage exposure</dt><dd className="danger-text">{account.outageExposure}</dd></div></dl>
        </section>
        <section className="panel signals-card"><div className="section-title"><div><span className="eyebrow">Unified signals</span><h2>What changed</h2></div></div>
          {signals.map(([source, text, Icon]) => <div className="signal" key={String(source)}><span className="signal-icon"><Icon size={17} /></span><div><strong>{String(text)}</strong><span>{String(source)} · staged source</span></div></div>)}
        </section>
        <section className="panel offer-card"><span className="eyebrow"><Sparkles size={14} /> Beacon recommendation</span><h2>{consumer ? 'Home continuity refresh' : 'Field-team resilience package'}</h2><p>{consumer ? 'Replace the oldest battery module and add one year of monitoring with the fictional credit.' : 'Add four modular battery units and Fleet Resilience monitoring before the next field deployment.'}</p><div className="offer-price"><strong>{consumer ? '$1,240' : '$12,880'}</strong><span>illustrative CAD · pre-approved demo offer</span></div><button className="secondary">Prepare with Beacon <ChevronRight size={15} /></button></section>
        <section className="panel contact-card"><div className="section-title"><div><span className="eyebrow">Primary contact</span><h2>{account.contactName}</h2></div></div><p><Mail size={15} />{account.email}</p><p><CalendarDays size={15} />Next review · {dateFromToday(2)}</p><p><ShieldCheck size={15} />Resilience Credit · Eligible</p></section>
      </div>
    </main>
  );
}

function BeaconPage() {
  const [tools, setTools] = useState<ToolState>(defaultTools);
  const [input, setInput] = useState('Help me prepare for this account');
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; body: string }>>([{ role: 'assistant', body: 'I am ready. Ask for an account brief, the outage segment, or a staged meeting plan.' }]);
  const send = () => {
    const value = input.trim(); if (!value) return;
    setMessages((current) => [...current, { role: 'user', body: value }, { role: 'assistant', body: beaconReply(value, tools) }]);
    setInput('');
  };
  const enabled = useMemo(() => Object.values(tools).filter(Boolean).length, [tools]);
  return (
    <main className="beacon-page">
      <header className="page-header"><div><span className="eyebrow">Deterministic assistant</span><h1>Beacon</h1><p>Explore a scripted personal-assistant experience and see exactly how simulated tools change its context.</p></div><span className="mode-pill"><Bot size={15} /> Staged mode</span></header>
      <div className="beacon-layout">
        <aside className="tools-panel"><div><span className="eyebrow">Application context</span><h2>{enabled} of 3 tools enabled</h2><p>These switches are simulations. They never connect to Microsoft 365.</p></div>{(Object.keys(toolLabels) as ToolId[]).map((id) => {
          const icons = { outlook: Mail, calendar: CalendarDays, sharepoint: FileText }; const Icon = icons[id];
          return <label className="tool-toggle" key={id}><span className="tool-icon"><Icon size={19} /></span><span><strong>{toolLabels[id].name}</strong><small>{toolLabels[id].description}</small></span><input type="checkbox" checked={tools[id]} onChange={() => setTools((state) => ({ ...state, [id]: !state[id] }))} /><span className="switch" /></label>;
        })}<div className="tool-map"><div className="tool-node"><Mail size={14} /></div><div className="tool-node"><CalendarDays size={14} /></div><div className="tool-node"><FileText size={14} /></div><span /><div className="data-node"><CloudLightning size={16} />Unified context</div><span /><div className="agent-node"><Bot size={16} />Beacon</div></div></aside>
        <section className="chat-panel"><div className="chat-header"><div className="beacon-avatar"><img src="/readycurrent-mark.svg" alt="" /></div><div><strong>Beacon</strong><span>ReadyCurrent assistant · deterministic</span></div><span className="online-dot" /></div><div className="messages" aria-live="polite">{messages.map((message, index) => <div key={index} className={`message ${message.role}`}><span>{message.body}</span>{message.role === 'assistant' && <small>Staged response · no model call</small>}</div>)}</div><div className="suggestions">{['Explain the outage segment', 'Schedule a meeting', 'What did the last email say?'].map((text) => <button key={text} onClick={() => setInput(text)}>{text}</button>)}</div><div className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} aria-label="Message Beacon" /><button onClick={send} aria-label="Send message"><ChevronRight size={20} /></button></div></section>
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  return (
    <div className="app-shell">
      <Navigation page={page} setPage={setPage} />
      <div className="content-shell">
        <div className="topbar"><span><Wifi size={14} /> Demo workspace</span><span><Power size={14} /> Level 1 · visual prototype</span></div>
        {page === 'home' && <SellerHome navigate={setPage} />}
        {page === 'business' && <ProfilePage account={businessAccount} />}
        {page === 'consumer' && <ProfilePage account={householdAccount} consumer />}
        {page === 'beacon' && <BeaconPage />}
      </div>
    </div>
  );
}
