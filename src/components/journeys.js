import React from 'react';

class LoadJourneys extends React.Component{
  render(){
    return <input type='button' onClick={()=>this.props.onClick()} value='Refresh' />
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
      <tr key={i}>
        <td>{departure.service}</td><td>{departure.destination}</td><td>{departure.expDepart}</td>
      </tr>
    )
  }
}

export default class Journey extends React.Component{
  constructor(props){
    super(props);
    this.businessLogic = props.businessLogic;
    this.state = {
      departures: []
    };
  }

  render(){
    return (
      <div>
        <Timetable name={this.props.journeyName} departures={this.state.departures}/><br/>
        <LoadJourneys onClick={()=>this.loadJourney()}/><br/>
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
