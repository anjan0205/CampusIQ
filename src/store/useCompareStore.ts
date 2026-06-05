import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CollegeCompare {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  image: string;
  fees: number;
  rating: number;
  averagePlacement: number;
  highestPackage: number;
  nirfRanking: number | null;
  ownershipType: string;
}

interface CompareState {
  compareList: CollegeCompare[];
  addToCompare: (college: CollegeCompare) => { success: boolean; message: string };
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      addToCompare: (college) => {
        const currentList = get().compareList;
        
        if (currentList.find((c) => c.id === college.id)) {
          return {
            success: false,
            message: `"${college.name}" is already added to comparison.`
          };
        }

        if (currentList.length >= 3) {
          return {
            success: false,
            message: "You can compare a maximum of 3 colleges."
          };
        }

        set({ compareList: [...currentList, college] });
        return {
          success: true,
          message: `Added "${college.name}" to comparison.`
        };
      },
      removeFromCompare: (id) =>
        set((state) => ({
          compareList: state.compareList.filter((c) => c.id !== id)
        })),
      clearCompare: () => set({ compareList: [] })
    }),
    {
      name: "campusiq-compare-storage" // persist in local storage
    }
  )
);
export default useCompareStore;
