import React, { FunctionComponent, PropsWithChildren, memo } from 'react';

interface ILootItemProps {
  asset?: string;
  count?: number;
  disenchantLootName?: string;
  disenchantValue?: number;
  displayCategories?: string;
  expiryTime?: number;
  isNew?: boolean;
  isRental?: boolean;
  itemDesc?: string;
  itemStatus?: string;
  localizedDescription?: string;
  localizedName?: string;
  localizedRecipeSubtitle?: string;
  localizedRecipeTitle?: string;
  lootId?: string;
  lootName?: string;
  parentItemStatus?: string;
  parentStoreItemId?: number;
  rarity?: string;
  redeemableStatus?: string;
  refId?: string;
  rentalGames?: number;
  rentalSeconds?: number;
  shadowPath?: string;
  splashPath?: string;
  storeItemId?: number;
  tags?: string;
  tilePath?: string;
  type?: string;
  upgradeEssenceName?: string;
  upgradeEssenceValue?: number;
  upgradeLootName?: string;
  value?: number;
  onClick(e: any): any;
}

const style = { cursor: 'pointer' };

const LootItem: FunctionComponent<PropsWithChildren<ILootItemProps>> = (props) => {

  const handleClick = () => {
    console.log(props.lootId);
    props.onClick(props.lootId)
  }

  return (
    <div style={style} onClick={handleClick} >
      <span>{props.itemDesc} </span>
      <span>{props.disenchantValue} </span>
      <span>{props.value} </span>
      <span>{props.rarity}</span>
    </div>
  )
}

export default memo(LootItem);
