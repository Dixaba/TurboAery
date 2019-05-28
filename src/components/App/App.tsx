import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
const { remote } = require('electron');
const apikey = remote.getGlobal('apikey');

console.log(apikey); // it works

// TODO: refactor App

const connector = new LCUConnector();

const renderList = (list: any[], fn: Function) => list.map(item => <LootItem key={item.lootId} {...item} onClick={fn} />);

const renderCategories = (list: any[], fn: Function) => Object.entries(list).map(item => (
  <Fragment key={item[0]}>
    <h4>{item[0]}</h4>
    {renderList(item[1], fn)}
  </Fragment>
))

const renderRecipeList = (list: any[]) => {
  console.log(...list);
  return list.map((item: any) => (<pre key={JSON.stringify(item)}>{item.recipeName}<br />{JSON.stringify(item.outputs)}<br />{JSON.stringify(item.slots)}<br /><br /></pre>))
};

const App: React.FunctionComponent = () => {

  const [lootList, setLootList] = useState<any>(null);
  const [recipesList, setRecipesList] = useState<any>({});

  useEffect(() => {
    connector.on('connect', (data: any) => {
      lolLootManipulator.setConfig(data, apikey);
      lolLootManipulator.getRegion()
        .then(async () => {
          await lolLootManipulator.getLootList();
          const lootListByCategory = lolLootManipulator.getLootListByCategory();

          setLootList(lootListByCategory);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    connector.start();
    return () => {
      connector.stop();
    }
  }, []);

  const getRecipes = async (lootId: string) => {
    const recipesList = await lolLootManipulator.getRecipesList(lootId);
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
      <pre>
        <h4>RECIPES</h4>
        {Object.keys(recipesList).length ? <>{renderRecipeList(recipesList)}</> : 'Waiting for list of recipes'}
      </pre>
    </>
  );
}

export default App;
