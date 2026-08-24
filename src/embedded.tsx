import { createRoot, type Root } from 'react-dom/client';
import App, { type ConnectedDashboard } from './App';
import './styles/app.css';

type MountOptions = { dashboard?: ConnectedDashboard };

let activeRoot: Root | undefined;
let activeTarget: Element | undefined;

function mount(target: Element, options: MountOptions = {}) {
  if (activeRoot) activeRoot.unmount();
  target.classList.add('readycurrent-root');
  activeTarget = target;
  activeRoot = createRoot(target);
  activeRoot.render(<App dashboard={options.dashboard} />);
}

function unmount(target?: Element) {
  if (!activeRoot || (target && target !== activeTarget)) return;
  activeRoot.unmount();
  activeRoot = undefined;
  activeTarget = undefined;
}

const embeddedApi = { mount, unmount };
(globalThis as typeof globalThis & { ReadyCurrentEmbedded?: typeof embeddedApi }).ReadyCurrentEmbedded = embeddedApi;

export { mount, unmount };
