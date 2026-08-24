import { LightningElement } from 'lwc';
import READY_CURRENT from '@salesforce/resourceUrl/ReadyCurrentEmbedded';
import getDashboard from '@salesforce/apex/ReadyCurrentDemoService.getDashboard';

export default class ReadyCurrentApp extends LightningElement {
  error;
  dashboard;
  frameLoaded = false;
  channel;

  constructor() {
    super();
    this.channel = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  get frameUrl() {
    return `${READY_CURRENT}/index.html?channel=${encodeURIComponent(this.channel)}`;
  }

  connectedCallback() {
    getDashboard()
      .then((dashboard) => {
        this.dashboard = JSON.parse(JSON.stringify(dashboard));
        this.postDashboard();
      })
      .catch((failure) => {
        this.error = failure?.body?.message || failure?.message || 'Live dashboard counts are unavailable.';
      });
  }

  handleFrameLoad() {
    this.frameLoaded = true;
    this.postDashboard();
  }

  postDashboard() {
    if (!this.frameLoaded || !this.dashboard) return;
    const frame = this.template.querySelector('iframe');
    if (!frame?.contentWindow) return;

    const targetOrigin = new URL(READY_CURRENT, window.location.href).origin;
    frame.contentWindow.postMessage({
      type: 'readycurrent:dashboard',
      channel: this.channel,
      dashboard: this.dashboard
    }, targetOrigin);
  }
}
