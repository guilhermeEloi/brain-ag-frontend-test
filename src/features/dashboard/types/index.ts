export interface PieItem {
  name: string;
  value: number;
}

export interface PieData {
  porEstado: PieItem[];
  porCultura: PieItem[];
  usoSolo: PieItem[];
}
