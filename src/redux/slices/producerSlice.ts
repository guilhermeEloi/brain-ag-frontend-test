import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockProducers } from "@/services/mocks/producerData";
import type { Producer } from "@/features/producer/types";
import type { Farm } from "@/features/farm/types";
import type { Crop } from "@/features/crop/types";

interface ProducerState {
  producers: Producer[];
}

const initialState: ProducerState = {
  producers: mockProducers,
};

const producerSlice = createSlice({
  name: "producer",
  initialState,
  reducers: {
    setProducers(state, action: PayloadAction<Producer[]>) {
      state.producers = action.payload;
    },

    addProducer(state, action: PayloadAction<Producer>) {
      state.producers.push(action.payload);
    },

    editProducer(state, action: PayloadAction<Producer>) {
      const index = state.producers.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.producers[index] = action.payload;
      }
    },

    deleteProducer(state, action: PayloadAction<number>) {
      state.producers = state.producers.filter((p) => p.id !== action.payload);
    },

    addFarm(
      state,
      action: PayloadAction<{ producerId: number; newFarm: Farm }>
    ) {
      const { producerId, newFarm } = action.payload;
      const producer = state.producers.find((p) => p.id === producerId);
      if (producer) {
        producer.farms.push(newFarm);
      }
    },

    updateFarm(
      state,
      action: PayloadAction<{
        producerId: number;
        farmId: number;
        updatedFarm: Partial<Farm>;
      }>
    ) {
      const { producerId, farmId, updatedFarm } = action.payload;
      const producer = state.producers.find((p) => p.id === producerId);
      if (!producer) return;

      const farm = producer.farms.find((f) => f.id === farmId);
      if (farm) {
        Object.assign(farm, updatedFarm);
      }
    },

    deleteFarm(
      state,
      action: PayloadAction<{
        producerId: number;
        farmId: number;
      }>
    ) {
      const { producerId, farmId } = action.payload;

      const producer = state.producers.find((p) => p.id === producerId);
      if (!producer) return;

      producer.farms = producer.farms.filter((f) => f.id !== farmId);
    },

    addCrop(
      state,
      action: PayloadAction<{
        producerId: number;
        farmId: number;
        newCrop: Crop;
      }>
    ) {
      const { producerId, farmId, newCrop } = action.payload;
      const producer = state.producers.find((p) => p.id === producerId);
      if (!producer) return;

      const farm = producer.farms.find((f) => f.id === farmId);
      if (farm) {
        farm.crops.push(newCrop);
      }
    },

    updateCrop(
      state,
      action: PayloadAction<{
        producerId: number;
        farmId: number;
        cropId: number;
        updatedCrop: Partial<Crop>;
      }>
    ) {
      const { producerId, farmId, cropId, updatedCrop } = action.payload;
      const producer = state.producers.find((p) => p.id === producerId);
      if (!producer) return;

      const farm = producer.farms.find((f) => f.id === farmId);
      if (!farm) return;

      const crop = farm.crops.find((c) => c.id === cropId);
      if (crop) {
        Object.assign(crop, updatedCrop);
      }
    },

    deleteCrop(
      state,
      action: PayloadAction<{
        producerId: number;
        farmId: number;
        cropId: number;
      }>
    ) {
      const { producerId, farmId, cropId } = action.payload;

      const producerIndex = state.producers.findIndex(
        (p) => p.id === producerId
      );
      if (producerIndex === -1) return;

      const farmIndex = state.producers[producerIndex].farms.findIndex(
        (f) => f.id === farmId
      );
      if (farmIndex === -1) return;

      const filteredCrops = state.producers[producerIndex].farms[
        farmIndex
      ].crops.filter((c) => c.id !== cropId);

      state.producers[producerIndex].farms[farmIndex] = {
        ...state.producers[producerIndex].farms[farmIndex],
        crops: filteredCrops,
      };
    },
  },
});

export const {
  setProducers,
  addProducer,
  editProducer,
  deleteProducer,
  addFarm,
  updateFarm,
  deleteFarm,
  addCrop,
  updateCrop,
  deleteCrop,
} = producerSlice.actions;

export const producerReducer = producerSlice.reducer;
export default producerReducer;
