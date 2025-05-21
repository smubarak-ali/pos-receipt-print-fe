import { Medicine } from "./app/utils/model/medicine";

declare global {
  interface Window {
    api: {
      search: (name: string) => Promise<Medicine[]>;
      
      getAll: () => Promise<Medicine[]>;

      delete: (id: number) => Promise<void>;

      save: (medicine: Medicine) => Promise<Medicine>;
    };
  }
}

export {};