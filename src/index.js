import React from 'react';
import ReactDOM from 'react-dom';
import Collator from './lib/journey'
import Journey from './components/journeys'
import './index.css';

// ========================================


let jd=[
  {
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
  },
  {
    name: 'Work to  home',
    options: [
      {
        id: 1,
        type: "Train",
        stationId: 'perse',
        direction: 'Northbound'
      }
    ]
  }
];


ReactDOM.render(
  <Journey journeyName={jd[0].name} businessLogic={new Collator(jd[0].options)}/>,
  document.getElementById('root')
);
