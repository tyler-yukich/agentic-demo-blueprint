import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import READY_CURRENT from '@salesforce/resourceUrl/ReadyCurrentEmbedded';
import getDashboard from '@salesforce/apex/ReadyCurrentDemoService.getDashboard';

export default class ReadyCurrentApp extends LightningElement {
  error;
  _booting = false;
  _mountedHost;

  renderedCallback() {
    const host = this.refs?.host;
    if (!host || this._booting || host.firstChild) return;
    this._booting = true;
    Promise.all([
      loadStyle(this, READY_CURRENT + '/app.css'),
      loadScript(this, READY_CURRENT + '/app.js'),
      getDashboard()
    ]).then(([, , dashboard]) => {
      const app = window.ReadyCurrentEmbedded;
      if (!app || typeof app.mount !== 'function') {
        throw new Error('The embedded application did not register its mount function.');
      }
      this._mountedHost = host;
      app.mount(host, { dashboard });
    }).catch((failure) => {
      this.error = failure?.body?.message || failure?.message || 'Unexpected initialization error.';
    }).finally(() => {
      this._booting = false;
    });
  }

  disconnectedCallback() {
    try {
      window.ReadyCurrentEmbedded?.unmount?.(this._mountedHost);
    } catch {
      // Teardown is best effort during Lightning navigation.
    }
  }
}
