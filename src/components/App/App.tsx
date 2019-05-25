import React, { useState, useEffect } from 'react';
const LCUConnector = require('lcu-connector');

const App: React.FunctionComponent = () => {

  const [LCUData, setLCUData] = useState(null);

  useEffect(() => {
    const connector = new LCUConnector();

    connector.on('connect', (data: any) => {
      setLCUData(data)
    });

    // Start listening for the LCU client
    connector.start();

  }, []);

  return (
    <>
      <pre>
        {LCUData ? JSON.stringify(LCUData) : 'Waiting for connection'}
      </pre>
    </>
  );
}

export default App;
