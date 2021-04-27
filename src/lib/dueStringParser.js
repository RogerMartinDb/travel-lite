export default class DueStringParser{
  constructor(dueString, now = new Date()){
    now.setSeconds(0);
    
    if (dueString === "Due")
    {
        this.minutes = 0;
        this.dueRelative = "Due";
        this.dueAbsolute = this.timeString(now);
        return;
    }

    let match = dueString.match(/^(\d\d):(\d\d)$/);

    if(match){
      let hour = parseInt(match[1], 10);
      let minute = parseInt(match[2], 10);

      let dueTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

      if (now.getHours() - hour > 12)
        dueTime.setDate(dueTime.getDate() + 1);  // tomorrow

      let minutes = Math.trunc((dueTime - now)/1000/60);
      if (minutes < 0) minutes = 0;

      this.minutes = minutes;
      this.dueAbsolute = dueString;
      this.dueRelative = minutes === 0 ? "Due" : `${minutes} min`;

      return;
    }

    match = dueString.match(/(\d+) min/);
    
    if (match)
    {
        this.minutes = parseInt(match[1], 10);
        let dueTime = now;
        dueTime.setMinutes(now.getMinutes() + this.minutes);
        this.dueAbsolute = this.timeString(dueTime);
        this.dueRelative = `${this.minutes} min`;

        return;
    }

    this.minutes = 0;
    this.dueRelative = dueString + "!";
    this.dueAbsolute = "";

  }

  timeString(date){
    return ("0" + date.getHours()).slice(-2) + ":" + 
            ("0" + date.getMinutes()).slice(-2);
  }

}