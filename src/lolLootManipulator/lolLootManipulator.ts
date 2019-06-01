import axios from 'axios';
import memoize from 'lodash/memoize';
import { MemoizedFunction } from 'lodash';

const { Kayn } = require('kayn');

// TODO: extract interfaces to external file

type TLootRarity = '' | 'DEFAULT' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'ULTIMATE';

type TLootDisplayCategories =
  | ''
  | 'CHAMPION'
  | 'CHEST'
  | 'EMOTE'
  | 'SKIN'
  | 'SUMMONERICON'
  | 'WARDSKIN';

interface LootItem {
  asset: string;
  count: number;
  disenchantLootName: string;
  disenchantValue: number;
  displayCategories: TLootDisplayCategories;
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
  rarity: TLootRarity;
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

interface LootRecipeSlots {
  lootIds: string[];
  quantity: number;
  slotNumber: number;
}

interface LootRecipeOutputs {
  lootName: string;
  quantity: number;
}

interface LootRecipeMetadata {
  lootName: string;
  quantity: number;
}

interface LootRecipe {
  contextMenuText: string;
  crafterName: string;
  description: string;
  displayCategories: string;
  imagePath: string;
  introVideoPath: string;
  loopVideoPath: string;
  metadata: LootRecipeMetadata;
  outputs: LootRecipeOutputs[];
  outroVideoPath: string;
  recipeName: string;
  requirementText: string;
  slots: LootRecipeSlots[];
  type: string;
  actionType: string;
  enabled: boolean;
  essenceQuantity: number;
  essenceType: string;
  name: string;
  recipeContextMenuAction: string;
  recipeDescription: string;
  requiredOthers: string;
  requiredOthersCount: number;
  requiredOthersName: string;
  requiredTokens: string;
}

interface LootListByCategory {
  '': LootItem[];
  CHAMPION: LootItem[];
  CHEST: LootItem[];
  EMOTE: LootItem[];
  SKIN: LootItem[];
  SUMMONERICON: LootItem[];
  WARDSKIN: LootItem[];
  [index: string]: LootItem[];
}

interface LolLootManipulator {
  lootList: LootItem[];
  getLootList(refresh?: boolean): Promise<LootItem[]>;
  getRecipesList: ((lootId: string) => Promise<LootRecipe[]>) & MemoizedFunction;
  getLootListByCategory(): LootListByCategory;
  getRegion: (() => Promise<void>) & MemoizedFunction;
  setConfig(data: LCUConnectionData, riotAPIKey: string): void;
  disenchant(lootId: string, count: number): Promise<void>;
}

interface RequestConfig {
  auth: {
    username: string;
    password: string;
  };
  baseURL: string;
}

interface LCUConnectionData {
  protocol: 'https';
  address: '127.0.0.1';
  port: number;
  username: 'riot';
  password: string;
}

class LolLootManipulator implements LolLootManipulator {
  public lootList: LootItem[] = [];

  private requestConfig?: RequestConfig;

  private riotAPIKey?: string;

  private kayn: any = null;

  public setConfig = (data: LCUConnectionData, riotAPIConfig: string): void => {
    const { username, password, protocol, address, port } = data;
    this.requestConfig = {
      auth: {
        username,
        password
      },
      baseURL: `${protocol}://${address}:${port}`
    };
    this.riotAPIKey = riotAPIConfig;
  };

  public getRegion = memoize(
    async (): Promise<void> => {
      const response = await axios.get<string>(
        '/lol-platform-config/v1/namespaces/LoginDataPacket/platformId',
        this.requestConfig
      );
      const region = response.data;
      if (region === 'KR')
        throw new Error(
          'Korea is forbidden.' +
            '\nFor more information visit ' +
            'https://www.riotgames.com/en/DevRel/changes-to-the-lcu-api-policy'
        );
      try {
        this.kayn = Kayn(this.riotAPIKey)({
          region: region.toLocaleLowerCase(),
          locale: 'ru_RU' // hardcoded for now TODO: get locale from region string
        });
        this.kayn.DDragon.Champion.getDataById('Tristana') // test kayn and DDragon
          .callback(console.log);
      } catch (error) {
        console.warn(error);
      }
    }
  );

  public getLootList = async (refresh = true): Promise<LootItem[]> => {
    if (refresh) {
      try {
        this.lootList = (await axios.get<LootItem[]>(
          '/lol-loot/v1/player-loot',
          this.requestConfig
        )).data;
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return this.lootList;
  };

  public getLootListByCategory = (): LootListByCategory => {
    const result: LootListByCategory = {
      '': [],
      CHAMPION: [],
      CHEST: [],
      EMOTE: [],
      SKIN: [],
      SUMMONERICON: [],
      WARDSKIN: []
    };
    return this.lootList.reduce((acc, item): LootListByCategory => {
      acc[item.displayCategories].push(item);
      return acc;
    }, result);
  };

  public getRecipesList = memoize(
    async (lootId: string): Promise<LootRecipe[]> => {
      const fullRecipeData = [];
      try {
        const recipes = await axios.get<LootRecipe[]>(
          `/lol-loot/v1/recipes/initial-item/${lootId}`,
          this.requestConfig
        );
        const contextMenu = await axios.get<LootRecipe[]>(
          `/lol-loot/v1/player-loot/${lootId}/context-menu	`,
          this.requestConfig
        );
        for (let i = 0; i < recipes.data.length; i += 1) {
          fullRecipeData[i] = { ...recipes.data[i], ...contextMenu.data[i] };
        }
      } catch (error) {
        throw new Error(error.message);
      }
      return fullRecipeData;
    }
  );

  public disenchant = async (lootId: string, count: number) => {
    const extendedRequestConfig = {
      ...this.requestConfig,
      params: { repeat: count }
    };
    await axios.post(
      `/lol-loot/v1/recipes/CHAMPION_RENTAL_disenchant/craft`,
      [lootId],
      this.requestConfig
    );
  };
}

const lolLootManipulator = new LolLootManipulator();

export default lolLootManipulator;
