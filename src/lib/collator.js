import DueStringParser from "./dueStringParser";

export default class Collator {
  constructor(options) {
    this.journeyOptions = options;
    this.departures = [];
  }

  fetchDepartures(onUpdate) {
    const maxDeparturesPerType = 6;

    this.journeyOptions.forEach(option => {
      const handler = (option.type === "Train") ? this.trainHandler : this.busHandler;

      handler.getFreshDepartures(option, (freshDepartures) => {
        this.replaceDepartures(freshDepartures);
        this.processDueString(this.departures);
        onUpdate(this.departures.slice(0, maxDeparturesPerType));
      });
    });
  }

  busHandler = {
    getFreshDepartures: async (option, process) => {
      const now = new Date();
      const body = {
        "clientTimeZoneOffsetInMS": now.getTimezoneOffset() * 6000, // off by factor of 10, but copying from scrape
        "departureDate": now,
        "departureTime": now,
        "stopIds": [`8220DB000${option.stopId}`],
        "stopType": "BUS_STOP",
        "requestTime": now,
        "departureOrArrival": "DEPARTURE",
        "refresh": false
      };

      fetch("https://api-lts.transportforireland.ie/lts/lts/v1/public/departures", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
          "ocp-apim-subscription-key": "630688984d38409689932a37a8641bb9",
          "pragma": "no-cache"
        },
        "body": JSON.stringify(body),
        "method": "POST"
      })
        .then(raw => raw.json())
        .then(response => {
          process(response.stopDepartures
            .map(dep => {
              return {
                option: option.id,
                service: dep.serviceNumber,
                destination: dep.destination,
                dueString: dep.realTimeDeparture || dep.scheduledDeparture
              }
            })
            .filter(dep => Date.parse(dep.dueString) > now)
          );
        })
        .catch(error => console.error(error));
    }
  }

  trainHandler = {
    getFreshDepartures: (option, process) => {
      const url = `https://transport.rmartin.workers.dev/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=${option.stationId}&NumMins=60`;

      const freshDepartures = [];

      let xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.open('GET', url, true);
      xhr.onload = () => {
        let trains = xhr.responseXML.getElementsByTagName('objStationData');

        for (let i = 0; i < trains.length; ++i) {
          let train = trains[i];

          if (train.querySelector("Direction").textContent === option.direction) {

            let trainType = train.querySelector("Traintype").textContent;

            if (trainType === "DART10") {
              freshDepartures.push({
                option: option.id,
                service: "🚆",
                destination: train.querySelector('Destination').textContent,
                dueString: train.querySelector("Expdepart").textContent,
              })
            }
          }
        }

        process(freshDepartures);
      };
      xhr.send();
    }
  }

  replaceDepartures(freshDepartures) {
    if (freshDepartures.length === 0) {
      return;
    }

    this.departures = this.departures.filter(dep => dep.option !== freshDepartures[0].option);
    this.departures = this.departures.concat(freshDepartures);
  }

  processDueString(departures) {
    departures.forEach(departure => {
      if (departure.minutes == null) {
        let dueParser = new DueStringParser(departure.dueString);
        departure.minutes = dueParser.minutes;
        departure.dueRelative = dueParser.dueRelative;
        departure.dueAbsolute = dueParser.dueAbsolute;
      }
    });

    departures.sort((a, b) => { return a.minutes - b.minutes });
  }
}
