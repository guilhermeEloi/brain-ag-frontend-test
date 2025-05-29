import type { Farm } from "@/features/farm/types";

export interface Producer {
  id: number;
  name: string;
  document: string;
  documentType: string;
  email?: string;
  phone?: string;
  farms: Farm[];
}

export interface ProducerTableRow {
  id: number;
  name: string;
  document: string;
  documentType: string;
  email: string | undefined;
  phone: string | undefined;
  totalFarms: number;
  totalArea: number;
}

export interface ProducerForm {
  name: string;
  document: string;
  phone: string;
  email: string;
  documentType: string;
}
