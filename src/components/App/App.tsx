import React, { useState, useEffect, Fragment } from 'react';
import axios, { AxiosResponse } from 'axios';
import LolLootManipulator from '../../lolLootManipulator';
import LootItem from '../LootItem';
const LCUConnector = require('lcu-connector');

interface ILCUConnectionData {
  protocol: 'https';
  address: '127.0.0.1';
  port: number;
  username: 'riot';
  password: string;
};

// TODO: refactor App

const connector = new LCUConnector();

let manipulator: any = null;

const splitByCategory = (list: any[]) => {
  return list.reduce((acc, item) => {
    debugger;
    if (item.displayCategories in acc) {
      acc[item.displayCategories].push(item)
    } else {
      acc[item.displayCategories] = [item]
    }
    return acc;
  }, {})
};

const renderList = (list: any[], fn: Function) => list.map(item => <LootItem key={item.lootId} {...item} onClick={fn} />);

const renderCategories = (list: any[], fn: Function) => Object.entries(list).map(item => (
  <Fragment key={item[0]}>
    <h4>{item[0]}</h4>
    {renderList(item[1], fn)}
  </Fragment>
))

const renderRecipeList = (list: any[]) => {
  return list.map((item: any) => (<pre key={JSON.stringify(item)}>{item.recipeName} {JSON.stringify(item.outputs)}</pre>))
};


const App: React.FunctionComponent = () => {

  const [lootList, setLootList] = useState<any>(null);
  const [recipesList, setRecipesList] = useState<any>({});

  useEffect(() => {
    connector.on('connect', (data: ILCUConnectionData) => {
      const { username, password, protocol, address, port } = data;
      const requestConfig = {
        auth: {
          username,
          password
        }
      }

      axios.get(`${protocol}://${address}:${port}/lol-platform-config/v1/namespaces/LoginDataPacket/platformId`, requestConfig)
        .then(async (response: AxiosResponse<string>) => {
          const platformId = response.data;
          if (platformId === 'KR') {
            throw new Error('Korea is forbidden.' +
              '\nFor more information visit ' +
              'https://www.riotgames.com/en/DevRel/changes-to-the-lcu-api-policy');
          }

          manipulator = new LolLootManipulator({
            baseURL: `${protocol}://${address}:${port}/lol-loot/v1`,
            ...requestConfig
          });

          const lootList = await manipulator.getLootList();
          const lootListByCategory = splitByCategory(lootList);
          console.log(lootListByCategory);

          setLootList(lootListByCategory);
        })
    });
    connector.start();
    return () => {
      connector.stop();
    }
  }, []);

  const getRecipes = async (lootId: string) => {
    const recipesList = await manipulator.getRecipesList(lootId);
    setRecipesList(recipesList);
  }

  const handleClick = (event: any) => {
    getRecipes(event);
  }

  return (
    <>
      <pre>
        {lootList ? <>{renderCategories(lootList, handleClick)}</> : 'Waiting for list of loot'}
      </pre>
      <br />
      <br />
      {Object.keys(recipesList).length ? <>{renderRecipeList(recipesList)}</> : 'Waiting for list of recipes'}
    </>
  );
}

export default App;
