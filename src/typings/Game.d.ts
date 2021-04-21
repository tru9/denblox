import { cursor } from "./util.d.ts";

export interface GameInt {
  id: number;
  name: string;
  description: string;
  creator: {
    id: number;
    type: string;
  };
  rootPlace: {
    id: number;
    type: string;
  };
  created: Date;
  updated: Date;
  placeVisits: number;
}

// place

export interface Place {
  id: number;
  url: string;
  name: string;
  description: string;
  created: Date;
  updated: Date;
  visited: number;
  favorites: number;
  owner: {
    id: number;
    username: string;
    profileUrl: string;
  };
  copyingAllowed: boolean;
  genre: string;
  playing: number;
  maxPlayers: number;
  isPlayable: boolean;
  universeId: number;
  rootPlaceId: number;
  upVotes: number;
  downVotes: number;
  price: number;
}

// gamepass
export interface GamepassInterface extends cursor {
  data: Gamepass[];
}

export interface Gamepass {
  id: number;
  name: string;
  displayName: string;
  productId: number;
  price: number;
}

// game servers

export interface ServersInterface extends cursor {
  data: Servers[];
}

export interface Servers {
  id: string;
  maxPlayers: number;
  playing: number;
  fps: number;
  ping: number;
  name?: string;
  vipServerId?: number;
  accessCode?: string;
  ownerUserId?: number;
}
// user games

export interface UserGamesInterface extends cursor {
  data: GameInt[];
}

// group

export interface GroupGamesInterface extends cursor {
  data: GameInt[];
}
