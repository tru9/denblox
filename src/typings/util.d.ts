export type Value<E> = E | E[];
export interface cursor {
  previousPageCursor: string | null;
  nextPageCursor: string | null;
}
