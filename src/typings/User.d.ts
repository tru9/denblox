import { Group, GroupRole } from "./Group.d.ts";
import { Badge } from "./Badge.d.ts";
import { cursor } from "./util.d.ts";

// user

export interface User {
  description: string;
  created: Date;
  isBanned: boolean;
  id: number;
  name: string;
  thumbnails: {
    body: string;
    headshot: string;
  };
}

// user groups
export interface UserGroupInterface {
  data: UserGroup[];
}

export interface UserGroup {
  group: Group;
  role: GroupRole;
  isPrimaryGroup: boolean;
}

// user badge

export interface UserBadgeInterface extends cursor {
  data: Badge[];
}

// search user

export interface UserSearchInterface extends cursor {
  data: UserSearch[];
}

export interface UserSearch {
  id: number;
  name: string;
  displayName: string;
  previousUsernames: string[];
}
