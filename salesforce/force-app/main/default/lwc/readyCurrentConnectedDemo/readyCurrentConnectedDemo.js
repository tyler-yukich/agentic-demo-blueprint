import { LightningElement, wire } from 'lwc';
import getDashboard from '@salesforce/apex/ReadyCurrentDemoService.getDashboard';

export default class ReadyCurrentConnectedDemo extends LightningElement {
  dashboard; error;
  @wire(getDashboard) wiredDashboard({ data, error }) {
    this.dashboard = data; this.error = error;
  }
  get hasRun() { return Boolean(this.dashboard?.latestRun); }
}
