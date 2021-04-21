export * from "./src/controllers/User.ts";
export * from "./src/controllers/Icons.ts";
export * from "./src/controllers/Group.ts";
export * from "./src/controllers/Badge.ts";
export * from "./src/controllers/Game.ts";
export * from "./src/helpers/auth.ts";
export * from "./src/util/request.ts";
export type { Icon } from "./src/controllers/Icons.ts";

export type {
  User,
  UserBadgeInterface,
  UserGroup,
  UserGroupInterface,
  UserSearch,
  UserSearchInterface,
} from "./src/typings/User.d.ts";

export type {
  Group,
  GroupLog,
  GroupLogInterface,
  GroupRole,
  GroupUser,
  GroupWall,
  GroupWallInterface,
  JoinRequests,
  JoinRequestsInterface,
} from "./src/typings/Group.d.ts";

export type {
  GameInt,
  Gamepass,
  GamepassInterface,
  GroupGamesInterface,
  Place,
  Servers,
  ServersInterface,
  UserGamesInterface,
} from "./src/typings/Game.d.ts";

export type {
  Badge,
  BadgeAwarded,
  BadgeAwardedInterface,
  BadgeInt,
  BadgeInterface,
  BadgeUser,
  BadgeUserInterface,
} from "./src/typings/Badge.d.ts";
