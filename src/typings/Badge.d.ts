// badge
interface BadgeInt {
  id: number;
  name: string;
  description: string;
  displayName: string;
  displayDescription: string;
  enabled: boolean;
  iconImageId: number;
  displayIconImageId: number;
  statistics: {
    pastDayAwardedCount: number;
    awardedCount: number;
    winRatePercentage: number;
  };
  created: Date;
  updated: Date;
}

export interface BadgeInterface {
  nextPageCursor: string | null;
  previousPageCursor: string | null;
  data: Badge[];
}

export interface Badge extends BadgeInt {
  awardingUniverse: {
    id: number;
    type: string;
    name?: string;
  };
}

// badge awarded
export interface BadgeAwardedInterface {
  data: BadgeAwarded[];
}

export interface BadgeAwarded {
  badgeId: number;
  awardedDate: Date;
}

// badge user

export interface BadgeUserInterface {
  nextPageCursor: string | null;
  previousPageCursor: string | null;
  data: BadgeUser[];
}

export interface BadgeUser extends BadgeInt {
  awarder: {
    id: number;
    type: string;
  };
}
