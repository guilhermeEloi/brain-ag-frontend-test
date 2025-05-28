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
