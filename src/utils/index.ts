import type { Producer, ProducerTableRow } from "@/features/producer/types";
import type { FarmTableRow } from "@/features/farm/types";
import type { CropTableRow } from "@/features/crop/types";

export interface FarmTableRowWithProducer extends FarmTableRow {
  producerName: string;
}

export function mapProducersToTableRows(
  producers: Producer[]
): ProducerTableRow[] {
  return producers.map((p) => ({
    id: p.id,
    name: p.name,
    documentType: p.documentType,
    document: p.document,
    phone: p.phone,
    email: p.email,
    totalFarms: p.farms.length,
    totalArea: p.farms.reduce((acc, farm) => acc + farm.totalArea, 0),
  }));
}

export function mapFarmsWithProducerToTableRows(
  producers: Producer[]
): FarmTableRowWithProducer[] {
  return producers.flatMap((producer) =>
    producer.farms.map((farm) => ({
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      agricultableArea: farm.agricultableArea,
      vegetationArea: farm.vegetationArea,
      totalCrops: farm.crops.length,
      producerName: producer.name,
    }))
  );
}

export function mapCropsToTableRows(producers: Producer[]): CropTableRow[] {
  return producers.flatMap((producer) =>
    producer.farms.flatMap((farm) =>
      farm.crops.map((crop) => ({
        id: farm.id,
        harvest: crop.harvest,
        culture: crop.culture,
        farmName: farm.name,
        producerName: producer.name,
      }))
    )
  );
}

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheckDigit = (base: string) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * (base.length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calcCheckDigit(cpf.substring(0, 9));
  const digit2 = calcCheckDigit(cpf.substring(0, 9) + digit1);

  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calcCheckDigit(cnpj.substring(0, 12), weights1);
  const digit2 = calcCheckDigit(cnpj.substring(0, 12) + digit1, weights2);

  return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13]);
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
}

export function maskCellphone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
