import React, { FunctionComponent, PropsWithChildren, memo, useCallback } from 'react';

type TLootRarity = '' | 'DEFAULT' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'ULTIMATE';

interface ILootItemProps {
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

const style = { cursor: 'pointer' };

const LootItem: FunctionComponent<PropsWithChildren<ILootItemProps>> = (props) => {

  const handleClick = useCallback(() => {
    console.log(props.lootId);
    console.log(props);
    props.onClick(props.lootId)
  }, [props])

  return (
    <div style={style} onClick={handleClick} >
      <span>{props.itemDesc}</span> |
      <span>{props.count}</span> |
      <span>{props.itemStatus}</span> |
      <span>{props.type}</span> |
      <span>{props.value}</span> |
      <span>{props.disenchantValue}</span> |
      <span>{props.upgradeEssenceValue}</span> |
      <span>{props.storeItemId}</span> |
      <span>{props.parentItemStatus}</span> |
      <span>{props.rarity}</span> |
      <span>{props.parentStoreItemId}</span>
    </div>
  )
}

export default memo(LootItem);
