import create from "zustand";

interface BikeState {
    bikes: any[];
    addBike: (bike: any) => void;
}

const useBikeStore = create<BikeState>((set) => ({
    bikes: [],
    addBike: (bike) => set((state) => ({ bikes: [...state.bikes, bike] })),
}));

export default useBikeStore;
