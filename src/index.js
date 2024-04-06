import React from 'react';
import ReactDOM from 'react-dom';
import Journeys from './components/journeys'
import './index.css';

// ========================================

let jd=[
  {
    name: 'From Castleforbes Square',
    options: [
      {
        id: 1,
        type: "Bus",
        stopId: '7844'
      },
      {
        id: 2,
        type: "Luas",
        stopId: '0436'
      }
    ]
  },
  {
    name: 'Dunluce to town',
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
        stopId: '0608'
      }
    ]
  },
  {
    name: 'School to  home',
    options: [
      {
        id: 1,
        type: "Bus",
        stopId: '0526'
      }
    ]
  },
  {
    name: 'Pearse to north',
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
