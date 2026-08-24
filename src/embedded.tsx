import { createRoot, type Root } from 'react-dom/client';
import App, { type ConnectedDashboard } from './App';
import './styles/app.css';

type MountOptions = { dashboard?: ConnectedDashboard };

type DashboardMessage = {
  type: 'readycurrent:dashboard';
  channel: string;
  dashboard: ConnectedDashboard;
};

let activeRoot: Root | undefined;

function mount(target: Element, options: MountOptions = {}) {
  activeRoot?.unmount();
  target.classList.add('readycurrent-root');
  activeRoot = createRoot(target);
  activeRoot.render(<App dashboard={options.dashboard} />);
}

function unmount() {
  activeRoot?.unmount();
  activeRoot = undefined;
}

function isDashboard(value: unknown): value is ConnectedDashboard {
  if (!value || typeof value !== 'object') return false;
  const dashboard = value as Record<string, unknown>;
  return ['accountCount', 'atRiskCount', 'eligibleCount', 'draftCount']
    .every((field) => typeof dashboard[field] === 'number');
}

function expectedParentOrigin() {
  if (!document.referrer) return undefined;
  try {
    return new URL(document.referrer).origin;
  } catch {
    return undefined;
  }
}

const embeddedApi = { mount, unmount };
const global = window as typeof window & { ReadyCurrentEmbedded?: typeof embeddedApi };
global.ReadyCurrentEmbedded = embeddedApi;

const frameRoot = document.getElementById('readycurrent-embedded-root');
if (frameRoot) {
  const channel = new URLSearchParams(window.location.search).get('channel');
  const parentOrigin = expectedParentOrigin();

  // Render immediately with safe fixtures, then replace the aggregate counts
  // when the Lightning wrapper sends its Apex response into this frame.
  mount(frameRoot);
  window.addEventListener('message', (event: MessageEvent<DashboardMessage>) => {
    if (event.source !== window.parent) return;
    if (parentOrigin && event.origin !== parentOrigin) return;
    if (!channel || event.data?.type !== 'readycurrent:dashboard') return;
    if (event.data.channel !== channel || !isDashboard(event.data.dashboard)) return;
    mount(frameRoot, { dashboard: event.data.dashboard });
  });
}

export { mount, unmount };
