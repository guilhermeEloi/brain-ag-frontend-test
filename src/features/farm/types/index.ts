import type { Crop } from "@/features/crop/types";

export interface Farm {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agricultableArea: number;
  vegetationArea: number;
  crops: Crop[];
}

export interface FarmTableRow {
  id: number;
  producerName: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agricultableArea: number;
  vegetationArea: number;
  totalCrops: number;
}

export interface FarmForm {
  producerId: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agricultableArea: number;
  vegetationArea: number;
}
