import React from 'react';
import Collator from '../lib/collator'


class Timetable extends React.Component{
  constructor(props){
    super(props);
    this.refresh = props.refresh;
  }

  componentDidMount(){
    this.refresh();
    this.timer = setInterval(this.refresh, 10000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  render(){
    let rows = Array.from(this.props.departures);

    return (
      <div className="col-md-4 panel panel-info well well-sm dark">
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
        <b>{departure.service}</b> {departure.destination}: {departure.dueAbsolute} ({departure.dueRelative})
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
      <div>
        <Timetable  name={this.props.journeyName} 
                    departures={this.state.departures}
                    refresh={()=>this.loadJourney()}/><br/>
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
      return(<Journey key={jd.name} journeyName={jd.name} businessLogic={new Collator(jd.options)}/>)
    });
    return (<div className="row journeys">{journeys}</div>);
  }
}
