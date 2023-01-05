import create from "zustand";

interface BikeState {
  bikes: any[];
  setBikes: (bikes: any[]) => void;
  addBike: (bike: any) => void;
}

const useBikeStore = create<BikeState>((set) => ({
  bikes: [],
  setBikes: (bikes) => set({ bikes: bikes }),
  addBike: (bike) => set((state) => ({ bikes: [...state.bikes, bike] })),
}));

export default useBikeStore;
