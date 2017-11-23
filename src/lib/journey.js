export default class Collator{
  constructor(options){
    this.journeyOptions = options;
    this.departures = [];
  }

  fetchDepartures(onUpdate){
    this.journeyOptions.forEach(option => {
      const handler = (option.type === "Train") ? this.trainHandler : this.busHandler;

      let xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.open('GET', handler.url(option), true);
      xhr.onload = () => {
        this.departures = this.departures.filter(dep => dep.option !== option.id);
        handler.xmlParser(option, xhr.responseXML, this.departures);
        onUpdate(this.departures.slice());
      };
      xhr.send();
    });
  }

  trainHandler = {
    url: (option)=>`/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=${option.stationId}&NumMins=60`,
    xmlParser: (option, xml, departures)=>{
      let trains = xml.getElementsByTagName('objStationData');
      
      for (let i = 0; i < trains.length; ++i){
        let train = trains[i];

        if (train.querySelector("Direction").textContent === option.direction){
          departures.push({
            option: option.id,
            service: train.querySelector("Traintype").textContent,
            destination: train.querySelector('Destination').textContent,
            expDepart: train.querySelector("Expdepart").textContent,
          })
        }
      }
    }
  }

  busHandler = {
    url: (option)=>`/Text/WebDisplay.aspx?stopRef=${option.stopId}`,
    xmlParser: (option, xml, departures)=>{
      let buses = xml.querySelectorAll("tr");
      
      for (let i = 1; i < buses.length; ++i){
        let cells = buses[i].children;

        departures.push({
          option: option.id,
          service: cells[0].textContent,
          destination: cells[2].textContent,
          expDepart: cells[4].textContent,
        })
      };
    }
  }
}
