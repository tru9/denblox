import { cursor } from "./util.d.ts";

// main
interface GroupUser {
  displayName: any;
  userId: number;
  username: string;
  buildersClubMembershipType?: string;
}

interface GroupRole {
  id: number;
  name: string;
  description?: string;
  rank: number;
  memberCount: number;
}

// group

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: GroupUser;
  roles: GroupRole[];
  shout: {
    body: string;
    poster: GroupUser;
    created: Date;
    updated: Date;
  };
  memberCount: number;
  isBuildersClubOnly: boolean;
  publicEntryAllowed: boolean;
  isLocked: boolean;
  imageUrl: string;
}

// groups logs

export interface GroupLogInterface extends cursor {
  data: GroupLog[];
}

export interface GroupLog {
  actor: {
    user: GroupUser;
    role: GroupRole;
  };
  actionType: string;
  description: { [key: string]: any };
  created: Date;
}

// group walls

export interface GroupWallInterface extends cursor {
  data: GroupWall[];
}

interface GroupWall {
  id: number;
  poster: {
    user: GroupUser;
    role: GroupRole;
  } | null;
  body: string;
  created: Date;
  updated: Date;
}

// group requests

export interface JoinRequestsInterface extends cursor {
  data: JoinRequests[];
}

export interface JoinRequests {
  requester: {
    userId: number;
    username: string;
  };
  created: Date;
}
