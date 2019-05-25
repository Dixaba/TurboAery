import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import axios from 'axios';
const LCUConnector = require('lcu-connector');

interface ILCUConnectionData {
  protocol: 'https';
  address: '127.0.0.1';
  port: number;
  username: 'riot';
  password: string;
};

ReactDom.render(<p>Waiting for connection</p>, document.getElementById('root'));

const connector = new LCUConnector();

connector.on('connect', async (data: ILCUConnectionData) => {
  axios.defaults.baseURL = `${data.protocol}://${data.address}:${data.port}`;
  axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${data.username}:${data.password}`)}`;
  ReactDom.render(<App />, document.getElementById('root'));
});

connector.start();
