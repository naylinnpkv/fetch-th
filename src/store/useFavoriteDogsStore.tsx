import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteDogsStore {
  favoriteDogs: string[];
  addDog: (dog: string) => void;
  removeDog: (dog: string) => void;
}

const useFavoriteDogsStore = create<FavoriteDogsStore>()(
  persist(
    (set) => ({
      favoriteDogs: [],
      addDog: (dog) =>
        set((state) => ({ favoriteDogs: [...state.favoriteDogs, dog] })),
      removeDog: (dog) =>
        set((state) => ({
          favoriteDogs: state.favoriteDogs.filter((d) => d !== dog),
        })),
    }),
    {
      name: "favorite-dogs",
    }
  )
);

export default useFavoriteDogsStore;
