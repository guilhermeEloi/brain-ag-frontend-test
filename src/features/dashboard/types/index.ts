export interface PieItem {
  name: string;
  value: number;
}

export interface PieData {
  perState: PieItem[];
  perCulture: PieItem[];
  landUse: PieItem[];
}
