import axios from "axios";
import memoize from "lodash/memoize";
const { Kayn } = require("kayn");

// TODO: extract interfaces to external file

type TLootRarity =
  | ""
  | "DEFAULT"
  | "EPIC"
  | "LEGENDARY"
  | "MYTHIC"
  | "ULTIMATE";

type TLootDisplayCategories =
  | ""
  | "CHAMPION"
  | "CHEST"
  | "EMOTE"
  | "SKIN"
  | "SUMMONERICON"
  | "WARDSKIN";

interface ILootItem {
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

interface ILootListByCategory {
  "": ILootItem[];
  CHAMPION: ILootItem[];
  CHEST: ILootItem[];
  EMOTE: ILootItem[];
  SKIN: ILootItem[];
  SUMMONERICON: ILootItem[];
  WARDSKIN: ILootItem[];
  [index: string]: ILootItem[];
}

interface ILolLootManipulator {
  lootList: ILootItem[];
  getLootList(refresh: boolean): Promise<ILootItem[]>;
  getRecipesList(lootId: string): Promise<ILootRecipe[]>;
  getLootListByCategory(): ILootListByCategory;
  getRegion(): void;
  setConfig(data: ILCUConnectionData, riotAPIKey: string): void;
}

interface IRequestConfig {
  auth: {
    username: string;
    password: string;
  };
  baseURL: string;
}

interface ILCUConnectionData {
  protocol: "https";
  address: "127.0.0.1";
  port: number;
  username: "riot";
  password: string;
}

class LolLootManipulator implements ILolLootManipulator {
  public lootList: ILootItem[] = [];
  private requestConfig?: IRequestConfig;
  private riotAPIKey?: string;
  private kayn: any = null;

  setConfig = (data: ILCUConnectionData, riotAPIConfig: string) => {
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

  getRegion = memoize(async () => {
    const response = await axios.get<string>(
      "/lol-platform-config/v1/namespaces/LoginDataPacket/platformId",
      this.requestConfig
    );
    const region = response.data;
    if (region === "KR")
      throw new Error(
        "Korea is forbidden." +
          "\nFor more information visit " +
          "https://www.riotgames.com/en/DevRel/changes-to-the-lcu-api-policy"
      );
    this.kayn = Kayn(this.riotAPIKey)({
      region: region.toLocaleLowerCase(),
      locale: "ru_RU" // hardcoded for now TODO: get locale from region string
    });
    this.kayn.DDragon.Champion.getDataById("Tristana") // test kayn and DDragon
      .callback(console.log);
  });

  getLootList = async (refresh = true): Promise<ILootItem[]> => {
    if (refresh) {
      try {
        this.lootList = (await axios.get<ILootItem[]>(
          "/lol-loot/v1/player-loot",
          this.requestConfig
        )).data;
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return this.lootList;
  };

  getLootListByCategory = () => {
    const result: ILootListByCategory = {
      "": [],
      CHAMPION: [],
      CHEST: [],
      EMOTE: [],
      SKIN: [],
      SUMMONERICON: [],
      WARDSKIN: []
    };
    return this.lootList.reduce((acc, item) => {
      acc[item.displayCategories].push(item);
      return acc;
    }, result);
  };

  getRecipesList = memoize(
    async (lootId: string): Promise<ILootRecipe[]> => {
      let fullRecipeData = [];
      try {
        const recipes = await axios.get<ILootRecipe[]>(
          `/lol-loot/v1/recipes/initial-item/${lootId}`,
          this.requestConfig
        );
        const contextMenu = await axios.get<ILootRecipe[]>(
          `/lol-loot/v1/player-loot/${lootId}/context-menu	`,
          this.requestConfig
        );
        for (let i = 0; i < recipes.data.length; i++) {
          fullRecipeData[i] = { ...recipes.data[i], ...contextMenu.data[i] };
        }
      } catch (error) {
        throw new Error(error.message);
      }
      return fullRecipeData;
    }
  );
}

const lolLootManipulator = new LolLootManipulator();

export default lolLootManipulator;
