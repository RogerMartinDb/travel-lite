export default class DueStringParser {
  constructor(dueString, now = new Date()) {
    now.setSeconds(0);

    dueString = dueString.trim();

    if (dueString === "Due") {
      this.minutes = 0;
      this.dueRelative = "Due";
      this.dueAbsolute = this.timeString(now);
      return;
    }

    const dueTime = new Date(dueString);

    if (!isNaN(dueTime)) {
      const minutes = Math.floor((dueTime - now) / 1000 / 60);
      this.minutes = Math.max(minutes, 0);
      this.dueAbsolute = this.timeString(dueTime);
      this.dueRelative = this.minutes === 0 ? "Due" : `${this.minutes} min`;
      return;
    }

    const [_, hour, minute] = dueString.match(/^(\d\d):(\d\d)$/) || [];

    if (hour && minute) {
      const dueTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

      if (now.getHours() - hour > 12) {
        dueTime.setDate(dueTime.getDate() + 1); // tomorrow
      }

      const minutes = Math.floor((dueTime - now) / 1000 / 60);
      this.minutes = Math.max(minutes, 0);
      this.dueAbsolute = this.timeString(dueTime);
      this.dueRelative = this.minutes === 0 ? "Due" : `${this.minutes} min`;
      return;
    }

    const [__, minutes] = dueString.match(/(\d+) min/) || [];

    if (minutes) {
      const dueTime = new Date(now.getTime() + parseInt(minutes, 10) * 60 * 1000);
      this.minutes = parseInt(minutes, 10);
      this.dueAbsolute = this.timeString(dueTime);
      this.dueRelative = `${this.minutes} min`;
      return;
    }

    this.minutes = 0;
    this.dueRelative = dueString + "!";
    this.dueAbsolute = "";
  }

  timeString(date) {
    return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  }
}
