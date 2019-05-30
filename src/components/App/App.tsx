import React, { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import lolLootManipulator from '../../lolLootManipulator';
import LootCard from '../LootCard';
import GlobalStyle from './globalStyle';

const LCUConnector = require('lcu-connector');
const { remote } = require('electron');

const apikey = remote.getGlobal('apikey');

console.log(apikey); // it works

// TODO: refactor App

const connector = new LCUConnector();

const renderList = (list: any[], fn: Function) =>
  list.map(item => <LootCard key={item.lootId} {...item} onClick={fn} />);

const renderCategories = (list: any[], fn: Function) =>
  Object.entries(list).map(item => (
    <Fragment key={item[0]}>
      <h4>{item[0]}</h4>
      {renderList(item[1], fn)}
    </Fragment>
  ));

const renderRecipeList = (list: any[]) => {
  console.log('======= RecipeList =======', ...list);
  return list.map((item: any) => (
    <div key={JSON.stringify(item)}>
      {item.recipeName}
      <br />
      {JSON.stringify(item.outputs)}
      <br />
      {JSON.stringify(item.slots)}
      <br />
      <br />
    </div>
  ));
};

const App: React.FunctionComponent = () => {
  const [lootList, setLootList] = useState<any>(null);
  const [recipesList, setRecipesList] = useState<any>({});

  useEffect(() => {
    connector.on('connect', (data: any) => {
      lolLootManipulator.setConfig(data, apikey);
      lolLootManipulator
        .getRegion()
        .then(async () => {
          try {
            await lolLootManipulator.getLootList();
          } catch (error) {
            console.log(error);
          }
          const lootListByCategory = lolLootManipulator.getLootListByCategory();

          setLootList(lootListByCategory);
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

  const handleClick = useCallback(async (lootId: string) => {
    let recipesListById;
    try {
      recipesListById = await lolLootManipulator.getRecipesList(lootId);
      setRecipesList(recipesListById);
    } catch (error) {
      console.warn(error);
      setRecipesList({});
    }
  }, []);

  const memoGlobalStyle = useMemo(() => <GlobalStyle />, []);

  return (
    <>
      {memoGlobalStyle}
      <div>
        {lootList ? <>{renderCategories(lootList, handleClick)}</> : 'Waiting for list of loot'}
      </div>
      <br />
      <br />
      <div>
        <h4>RECIPES</h4>
        {Object.keys(recipesList).length ? (
          <>{renderRecipeList(recipesList)}</>
        ) : (
          'Waiting for list of recipes'
        )}
      </div>
    </>
  );
};

export default App;
