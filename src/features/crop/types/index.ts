export interface Crop {
  harvest: string;
  culture: string;
}

export interface CropTableRow {
  id: number;
  harvest: string;
  culture: string;
  farmName: string;
  producerName: string;
}

export interface CropForm {
  producerId: number;
  farmId: number;
  harvest: string;
  culture: string;
}
