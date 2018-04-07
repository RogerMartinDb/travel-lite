import React from 'react';
import ReactDOM from 'react-dom';
import Journeys from './components/journeys'
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
        stopId: '608'
      }
    ]
  },
  {
    name: 'School to  home',
    options: [
      {
        id: 1,
        type: "Bus",
        stopId: '526'
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
  <Journeys journeyDefinitions={jd}/>,
  document.getElementById('root')
);
