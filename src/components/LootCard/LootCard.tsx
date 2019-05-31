import React, { memo, useCallback } from 'react';
import LootProperty from '../LootProperty';
import { StyledLootCard } from './LootCard.styled';

type LootRarity = '' | 'DEFAULT' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'ULTIMATE';

interface LootCard {
  itemDesc: string;
  count: number;
  itemStatus: string;
  type: string;
  value: number;
  disenchantValue: number;
  upgradeEssenceValue: number;
  storeItemId: number;
  parentItemStatus: string;
  rarity: LootRarity;
  parentStoreItemId: number;
  lootId: string;
  onClick(e: string): string;
}

const LootCard: React.FunctionComponent<LootCard> = (props): React.ReactElement => {
  const {
    itemDesc,
    count,
    itemStatus,
    type,
    value,
    disenchantValue,
    upgradeEssenceValue,
    storeItemId,
    parentItemStatus,
    rarity,
    parentStoreItemId,
    lootId,
    onClick
  } = props;
  const handleClick = useCallback(() => {
    console.log('======= lootId =======', lootId);
    console.log('======= LootCard =======', props);
    onClick(lootId);
  }, [lootId, props, onClick]);

  return (
    <StyledLootCard onClick={handleClick}>
      <LootProperty property={itemDesc}>Название</LootProperty>
      <LootProperty property={count}>Количество осколков</LootProperty>
      <LootProperty property={itemStatus}>Есть в коллекции</LootProperty>
      <LootProperty property={type}>Тип</LootProperty>
      <LootProperty property={value}>Стоимость в магазине</LootProperty>
      <LootProperty property={disenchantValue}>Стоимость распыления</LootProperty>
      <LootProperty property={upgradeEssenceValue}>Стоимость улучшения</LootProperty>
      <LootProperty property={storeItemId}>ID в магазине</LootProperty>
      <LootProperty property={parentItemStatus}>Есть ли соответствующий чемпион</LootProperty>
      <LootProperty property={rarity}>Редкость образа</LootProperty>
      <LootProperty property={parentStoreItemId}>ID чемпиона</LootProperty>
    </StyledLootCard>
  );
};

export default memo(LootCard);
