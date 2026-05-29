export type Users = Record<string, { display_name: string }>;

export interface ListEntry {
  name: string;
  slug: string;
  url: string;
  year: number;
}

type List = Record<number, ListEntry>;

export default List;
