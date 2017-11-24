import React from 'react';
import Collator from '../lib/collator'

class LoadJourneys extends React.Component{
  render(){
    return <input type='button' onClick={()=>this.props.onClick()} value='Get Times...' />
  }
}

class Timetable extends React.Component{
  render(){
    let rows = Array.from(this.props.departures);

    return (
      <div>
        <div className="panel-heading">
          <h1 className="panel-title">{this.props.name}</h1>
        </div>
        <div className="panel-body">
          <ul className="list-group">
            {rows.map((departure, i) => this.renderRow(departure, i))}
          </ul>
        </div>
      </div>
    );
  }

  renderRow(departure, i){
    return (
      <li className="list-group-item" key={i}>
        <b>{departure.service}</b> {departure.destination}: {departure.expDepart}
      </li>
    )
  }
}

class Journey extends React.Component{
  constructor(props){
    super(props);
    this.businessLogic = props.businessLogic;
    this.state = {
      departures: []
    };
  }

  render(){
    return (
      <div className="col-md-4 panel panel-success well well-sm">
        <LoadJourneys onClick={()=>this.loadJourney()}/><br/>
        <Timetable name={this.props.journeyName} departures={this.state.departures}/><br/>
      </div>
    );
  }

  loadJourney(){
    this.businessLogic.fetchDepartures(
      newDepartures => this.setState({
        departures: newDepartures
      })
    )
  }
}

export default class Journeys extends React.Component{
  constructor(props){
    super(props);
    this.journeyDefinitions = props.journeyDefinitions;
  }

  render(){
    let journeys = this.journeyDefinitions.map(jd => {
      return(<div><Journey journeyName={jd.name} businessLogic={new Collator(jd.options)}/></div>)
    });
    return (<div className="row journeys">{journeys}</div>);
  }
}
