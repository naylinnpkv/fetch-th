import { create } from "zustand";

interface FilterStore {
  breeds: string[];
  setBreeds: (breeds: string[]) => void;
  minAge: number;
  setMinAge: (minAge: number) => void;
  maxAge: number;
  setMaxAge: (maxAge: number) => void;
}

const useFilterStore = create<FilterStore>()((set) => ({
  breeds: [],
  minAge: 0,
  maxAge: 0,
  setBreeds: (breeds: string[]) => set({ breeds }),
  setMinAge: (minAge: number) => set({ minAge }),
  setMaxAge: (maxAge: number) => set({ maxAge }),
}));

export default useFilterStore;
