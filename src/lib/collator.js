import DueStringParser from "./dueStringParser";

export default class Collator {
  constructor(options) {
    this.journeyOptions = options;
    this.departures = [];
  }

  fetchDepartures(onUpdate) {
    const maxDeparturesPerType = 6;

    const promises = this.journeyOptions.map(option => {
      const handler = (option.type === "Train") ? this.trainHandler : this.busHandler;

      return handler.getFreshDepartures(option)
        .then(freshDepartures => {
          this.replaceDepartures(freshDepartures);
          this.processDueString(this.departures);
          onUpdate(this.departures.slice(0, maxDeparturesPerType));
        })
        .catch(error => console.error("Error fetching data:", error));
    });

    return Promise.all(promises);
  }

  busHandler = {
    getFreshDepartures: (option) => {
      const now = new Date();
      const body = {
        "clientTimeZoneOffsetInMS": now.getTimezoneOffset() * 6000,
        "departureDate": now,
        "departureTime": now,
        "stopIds": [`8220DB000${option.stopId}`],
        "stopType": "BUS_STOP",
        "requestTime": now,
        "departureOrArrival": "DEPARTURE",
        "refresh": false
      };

      return fetch("https://api-lts.transportforireland.ie/lts/lts/v1/public/departures", {
        method: "POST",
        headers: {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
          "ocp-apim-subscription-key": "630688984d38409689932a37a8641bb9",
          "pragma": "no-cache"
        },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then(data => data.stopDepartures
          .map(dep => ({
            option: option.id,
            service: dep.serviceNumber,
            destination: dep.destination,
            dueString: dep.realTimeDeparture || dep.scheduledDeparture
          }))
          .filter(dep => Date.parse(dep.dueString) > now)
        );
    }
  }

  trainHandler = {
    getFreshDepartures: (option) => {
      const url = `https://transport.rmartin.workers.dev/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=${option.stationId}&NumMins=60`;

      return fetch(url)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const trains = xmlDoc.getElementsByTagName('objStationData');
          const freshDepartures = [];

          for (const train of trains) {
            if (train.querySelector("Direction").textContent === option.direction) {
              const trainType = train.querySelector("Traintype").textContent;

              if (trainType === "DART10") {
                freshDepartures.push({
                  option: option.id,
                  service: "🚆",
                  destination: train.querySelector('Destination').textContent,
                  dueString: train.querySelector("Expdepart").textContent,
                });
              }
            }
          }

          return freshDepartures;
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          return [];
        });
    }
  };

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

    departures.sort((a, b) => a.minutes - b.minutes);
  }
}
