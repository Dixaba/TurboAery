import React, { memo, useCallback } from 'react';
import './LootCard.css'
import LootProperty from '../LootProperty';

type TLootRarity = '' | 'DEFAULT' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'ULTIMATE';

interface ILootCard {
  itemDesc: string;
  count: number;
  itemStatus: string;
  type: string;
  value: number;
  disenchantValue: number;
  upgradeEssenceValue: number;
  storeItemId: number;
  parentItemStatus: string;
  rarity: TLootRarity;
  parentStoreItemId: number;
  lootId: string;
  onClick(e: string): string;
}

const LootCard: React.FunctionComponent<ILootCard> = (props) => {

  const handleClick = useCallback(() => {
    console.log('======= lootId =======', props.lootId);
    console.log('======= LootCard =======', props);
    props.onClick(props.lootId)
  }, [props]);

  return (
    <div className='loot-card' onClick={handleClick}>
      <LootProperty property={props.itemDesc}>Название</LootProperty>
      <LootProperty property={props.count}>Количество осколков</LootProperty>
      <LootProperty property={props.itemStatus}>Есть в коллекции</LootProperty>
      <LootProperty property={props.type}>Тип</LootProperty>
      <LootProperty property={props.value}>Стоимость в магазине</LootProperty>
      <LootProperty property={props.disenchantValue}>Стоимость распыления</LootProperty>
      <LootProperty property={props.upgradeEssenceValue}>Стоимость улучшения</LootProperty>
      <LootProperty property={props.storeItemId}>ID в магазине</LootProperty>
      <LootProperty property={props.parentItemStatus}>Есть ли соответствующий чемпион</LootProperty>
      <LootProperty property={props.rarity}>Редкость образа</LootProperty>
      <LootProperty property={props.parentStoreItemId}>ID чемпиона</LootProperty>
    </div >
  )
}

export default memo(LootCard);
