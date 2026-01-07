


export const backendURL = "https://localhost:7179"  

export type Character = {
    id: number;
    worldId: number;
    name: string;
    class: string;
    occupation: string;
    description: string;
    appearance: string;
}

export type WorldInfo = {
  id: number;
  name: string;
  description: string;
  system: string;
  genre: string;
  owner: string;
}

export type WorldFact = {
    id: number;
    worldId: number;
    description: string;
}

export type WorldLocation = {
    id: number;
    parentId: number;
    name: string;
    description: string;
}