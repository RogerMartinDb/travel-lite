import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ========================================


class LoadJourneys extends React.Component{
  render(){
    return <input type='button' onClick={()=>this.props.onClick()} value='Test' />
  }
}

class Timetable extends React.Component{
  render(){
    let rows = Array.from(this.props.departures);

    return (
      <div>
        <h1>{this.props.name}</h1>
      <table>
        <tbody>
        {rows.map((departure, i) => this.renderRow(departure, i))}
        </tbody>
      </table>
      </div>
    );
  }

  renderRow(departure, i){
    return (
      <tr key={i}><td>
      {departure.service}
      </td><td>
      {departure.destination}
      </td><td>
      {departure.expDepart}
      </td></tr>
    )
  }
}

class Journeys extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      departures: []
    };
  }

  render(){
    return (
      <div>
        <Timetable name={this.props.journeyDefinition.name} departures={this.state.departures}/><br/>
        <LoadJourneys onClick={()=>this.loadJourneys()}/><br/>
      </div>
    );
  }

  loadJourneys(){
    let businssLogic = new BusinessLogic();

    businssLogic.getJourneys(
      this.props.journeyDefinition.options,
      ()=>this.state.departures,
      (departures)=>this.setState({departures: departures})
    )
  }
}

class BusinessLogic{
  getJourneys(journeyOptions, getDepartures, setDepartures){
    journeyOptions.forEach(option => {
      const handler = (option.type === "Train") ? this.trainHandler : this.busHandler;

      let xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.open('GET', handler.url(option), true);
      xhr.onload = () => {
        let departures = getDepartures();
        departures = departures.filter(dep => dep.option !== option.id);
        handler.xmlParser(option, xhr.responseXML, departures);
        setDepartures(departures);
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
let jd={
  name: 'Home to town',
  options: [
    {
      id: 1,
      type: "Train",
      stationId: 'klstr',
      direction: 'Southbound'
    },
    {
      id: 2,
      type: "Bus",
      stopId: '00608'
    }
  ]
};

ReactDOM.render(
  <Journeys journeyDefinition={jd}/>,
  document.getElementById('root')
);
