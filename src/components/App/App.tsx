import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
const { remote } = require('electron');
const apikey = remote.getGlobal('apikey');

console.log(apikey); // it works

const App: React.FunctionComponent = () => {

  const [LCUData, setLCUData] = useState<any>(null);

  useEffect(() => {
    let region: string;

    axios.get(`/lol-platform-config/v1/namespaces/LoginDataPacket/platformId`)
      .then((res: AxiosResponse<string>) => {
        region = res.data;

        if (region !== 'KR') {
          setLCUData(region);
        } else {
          setLCUData('Korea is forbidden');
        }
      })
      .catch((err: AxiosError) => {
        console.warn(err);
      })

  }, []);

  return (
    <>
      <pre>
        {LCUData ? LCUData : 'Waiting for connection'}
      </pre>
    </>
  );
}

export default App;
