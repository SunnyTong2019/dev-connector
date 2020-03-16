export class Alert {
  alertType: string;
  alertMessage: string;

  constructor(alertType: string, alertMessage: string) {
    this.alertType = alertType;
    this.alertMessage = alertMessage;
  }
}
