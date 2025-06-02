export interface Crop {
  id: number;
  harvest: string;
  culture: string;
}

export interface CropTableRow {
  producerId: number;
  farmId: number;
  id: number;
  harvest: string;
  culture: string;
  farmName: string;
  producerName: string;
}

export interface CropForm {
  producerId: number;
  farmId: number;
  cropId: number;
  harvest: string;
  culture: string;
}
