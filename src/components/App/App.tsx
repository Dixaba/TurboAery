import React, { useState, useEffect, useCallback, useMemo, ReactElement } from 'react';
import lolLootManipulator from '../../lolLootManipulator';
import GlobalStyle from './globalStyle';

const LCUConnector = require('lcu-connector');
const { remote } = require('electron');

const apikey = remote.getGlobal('apikey');

console.log(apikey); // it works

// TODO: refactor App

const connector = new LCUConnector();

const App: React.FunctionComponent = (): ReactElement => {
  const [lootList, setLootList] = useState<any>([]);
  const [inProgress, setInProgress] = useState<boolean>(false);

  useEffect(() => {
    connector.on('connect', (data: any) => {
      lolLootManipulator.setConfig(data, apikey);
      lolLootManipulator
        .getRegion()
        .then(async () => {
          try {
            await lolLootManipulator.getLootList();
            console.log(lolLootManipulator.lootList);
          } catch (error) {
            console.log(error);
          }
          const allChampions = lolLootManipulator.lootList.filter(
            item => item.type === 'CHAMPION_RENTAL'
          );

          setLootList(allChampions);
        })
        .catch(error => {
          console.log(error);
        });
    });
    connector.start();
    return () => {
      connector.stop();
    };
  }, []);

  const handleClick = useCallback(async () => {
    setInProgress(true);
    try {
      // eslint-disable-next-line no-restricted-syntax
      for await (const lootItem of lootList) {
        lolLootManipulator.disenchant(lootItem.lootId, lootItem.count);
      }
      await lolLootManipulator.getLootList();
      setLootList(lolLootManipulator.lootList.filter(item => item.type === 'CHAMPION_RENTAL'));
    } catch (error) {
      console.warn(error);
    }
    setInProgress(false);
  }, [lootList]);

  const memoGlobalStyle = useMemo(() => <GlobalStyle />, []);

  return (
    <>
      {memoGlobalStyle}
      <div>You got {lootList.length} champions</div>
      <br />
      <div>
        {lootList.map((item: any) => (
          <div key={item.lootId}>
            {item.count} {item.itemDesc}
          </div>
        ))}
      </div>
      <br />
      <br />
      {lootList.length ? (
        <button disabled={inProgress} onClick={handleClick}>
          Disenchant {lootList.reduce((acc: number, item: any) => acc + item.count, 0)} champion
          shards
        </button>
      ) : null}
    </>
  );
};

export default App;
