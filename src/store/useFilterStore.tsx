import { create } from "zustand";

interface FilterStore {
  breeds: string[];
  minAge: number;
  maxAge: number;
  sortField: "breed" | "age";
  sortOrder: "asc" | "desc";

  setBreeds: (breeds: string[]) => void;
  setMinAge: (minAge: number) => void;
  setMaxAge: (maxAge: number) => void;
  setSortField: (sortField: "breed" | "age" | "name") => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;

  buildQueryParams: (size: number, from: number) => URLSearchParams;
}

const useFilterStore = create<FilterStore>()((set, get) => ({
  breeds: [],
  minAge: 0,
  maxAge: 0,
  sortField: "breed",
  sortOrder: "asc",

  setBreeds: (breeds) => set({ breeds }),
  setMinAge: (minAge) => set({ minAge }),
  setMaxAge: (maxAge) => set({ maxAge }),
  setSortField: (sortField) => set({ sortField }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  buildQueryParams: (size: number, from: number) => {
    const { breeds, minAge, maxAge, sortField, sortOrder } = get();
    const queryParams = new URLSearchParams();

    queryParams.append("size", size.toString());
    queryParams.append("from", from.toString());

    if (breeds.length > 0) {
      breeds.forEach((breed) => {
        queryParams.append("breeds", breed);
      });
    }

    if (minAge > 0) {
      queryParams.append("ageMin", minAge.toString());
    }
    if (maxAge > 0) {
      queryParams.append("ageMax", maxAge.toString());
    }

    queryParams.append("sort", `${sortField}:${sortOrder}`);

    return queryParams;
  },
}));

export default useFilterStore;
