import axios from 'axios';

// TODO: extract interfaces to external file

interface ILootItem {
  asset: string;
  count: number;
  disenchantLootName: string;
  disenchantValue: number;
  displayCategories: string;
  expiryTime: number;
  isNew: boolean;
  isRental: boolean;
  itemDesc: string;
  itemStatus: string;
  localizedDescription: string;
  localizedName: string;
  localizedRecipeSubtitle: string;
  localizedRecipeTitle: string;
  lootId: string;
  lootName: string;
  parentItemStatus: string;
  parentStoreItemId: number;
  rarity: string;
  redeemableStatus: string;
  refId: string;
  rentalGames: number;
  rentalSeconds: number;
  shadowPath: string;
  splashPath: string;
  storeItemId: number;
  tags: string;
  tilePath: string;
  type: string;
  upgradeEssenceName: string;
  upgradeEssenceValue: number;
  upgradeLootName: string;
  value: number;
}

interface ILootRecipeSlots {
  lootIds: string[];
  quantity: number;
  slotNumber: number;
}

interface ILootRecipeOutputs {
  lootName: string;
  quantity: number;
}

interface ILootRecipeMetadata {
  lootName: string;
  quantity: number;
}

interface ILootRecipe {
  contextMenuText: string;
  crafterName: string;
  description: string;
  displayCategories: string;
  imagePath: string;
  introVideoPath: string;
  loopVideoPath: string;
  metadata: ILootRecipeMetadata;
  outputs: ILootRecipeOutputs[];
  outroVideoPath: string;
  recipeName: string;
  requirementText: string;
  slots: ILootRecipeSlots[];
  type: string;
  actionType: string,
  enabled: boolean,
  essenceQuantity: number,
  essenceType: string,
  name: string,
  recipeContextMenuAction: string,
  recipeDescription: string,
  requiredOthers: string,
  requiredOthersCount: number,
  requiredOthersName: string,
  requiredTokens: string
}

interface ILolLootManipulator {
  lootList: ILootItem[];
  getLootList(): Promise<ILootItem[]>;
  getRecipesList(lootId: string): Promise<ILootRecipe[]>
}

interface IRequestConfig {
  auth: {
    username: string;
    password: string;
  };
  baseURL: string;
}

class LolLootManipulator implements ILolLootManipulator {
  public lootList: ILootItem[] = [];
  private requestConfig: IRequestConfig = {
    auth: {
      username: '',
      password: ''
    },
    baseURL: ''
  }

  // TODO: extract platformId checking from the class
  constructor(config: IRequestConfig) {
    this.requestConfig = config
  }

  getLootList = async (): Promise<ILootItem[]> => {
    try {
      const response = await axios.get<ILootItem[]>('/player-loot', this.requestConfig);
      this.lootList = response.data;
    }
    catch (error) {
      throw new Error(error.message);
    }
    return this.lootList;
  }

  getRecipesList = async (lootId: string): Promise<ILootRecipe[]> => {
    let fullRecipeData = [];
    try {
      const recipes = await axios.get<ILootRecipe[]>(`/recipes/initial-item/${lootId}`, this.requestConfig);
      const contextMenu = await axios.get<ILootRecipe[]>(`/player-loot/${lootId}/context-menu	`, this.requestConfig);
      for (let i = 0; i < recipes.data.length; i++) {
        fullRecipeData[i] = { ...recipes.data[i], ...contextMenu.data[i] }
      }
    }
    catch (error) {
      throw new Error(error.message);
    }
    return fullRecipeData;
  }
}

export default LolLootManipulator;