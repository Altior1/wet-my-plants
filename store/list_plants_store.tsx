import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Plant } from '../interface/plants';

interface ListPlantsState {
    plants: Plant[];
    addPlant: (newPlant: Plant) => void;
    removePlant: (plantId: string) => void;
    waterPlant: (plantId: string) => void;
}

export const useListPlantsStore = create<ListPlantsState>()(
    persist(
        immer((set) => ({
            plants: [],

            addPlant: (newPlant: Plant) =>
                set((state) => {
                    state.plants.push(newPlant);
                }),

            removePlant: (plantId: string) =>
                set((state) => {
                    state.plants = state.plants.filter((plant) => plant.id !== plantId);
                }),

            waterPlant: (plantId: string) =>
                set((state) => {
                    const index = state.plants.findIndex((p) => p.id === plantId);
                    if (index !== -1) {
                        state.plants[index] = {
                            ...state.plants[index],
                            lastWateredDate: new Date(),
                        };
                    }
                }),
        })),
        {
            name: 'plants-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
