import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Plant } from "../interface/plants";
import { databaseService } from "../service/DatabaseService";

interface ListPlantsState {
  plants: Plant[];
  isLoading: boolean;
  isInitialized: boolean;
  initializeStore: () => Promise<void>;
  addPlant: (newPlant: Plant) => Promise<void>;
  removePlant: (plantId: string) => Promise<void>;
  waterPlant: (plantId: string) => Promise<void>;
}

export const useListPlantsStore = create<ListPlantsState>()(
  immer((set, get) => ({
    plants: [],
    isLoading: false,
    isInitialized: false,

    initializeStore: async () => {
      if (get().isInitialized) return;

      set((state) => {
        state.isLoading = true;
      });

      try {
        await databaseService.initialize();
        const plants = await databaseService.getAllPlants();
        set((state) => {
          state.plants = plants;
          state.isInitialized = true;
          state.isLoading = false;
        });
      } catch (error) {
        console.error("Failed to initialize store:", error);
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    addPlant: async (newPlant: Plant) => {
      try {
        await databaseService.addPlant(newPlant);
        set((state) => {
          state.plants.push(newPlant);
        });
      } catch (error) {
        console.error("Failed to add plant:", error);
        throw error;
      }
    },

    removePlant: async (plantId: string) => {
      try {
        await databaseService.removePlant(plantId);
        set((state) => {
          state.plants = state.plants.filter((plant) => plant.id !== plantId);
        });
      } catch (error) {
        console.error("Failed to remove plant:", error);
        throw error;
      }
    },

    waterPlant: async (plantId: string) => {
      try {
        await databaseService.waterPlant(plantId);
        set((state) => {
          const index = state.plants.findIndex((p) => p.id === plantId);
          if (index !== -1) {
            state.plants[index] = {
              ...state.plants[index],
              lastWateredDate: new Date(),
            };
          }
        });
      } catch (error) {
        console.error("Failed to water plant:", error);
        throw error;
      }
    },
  }))
);
