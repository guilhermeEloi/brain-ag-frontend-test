import type { Producer, ProducerTableRow } from "../types";

export function mapProducersToTableRows(
  producers: Producer[]
): ProducerTableRow[] {
  return producers.map((p) => ({
    id: p.id,
    name: p.name,
    document: p.document,
    totalFarms: p.farms.length,
    totalArea: p.farms.reduce((acc, farm) => acc + farm.totalArea, 0),
  }));
}
