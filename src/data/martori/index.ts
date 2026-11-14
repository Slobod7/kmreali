import symbols from './symbols.json';

export type Color = 'rosu' | 'galben' | 'verde' | 'albastru' | 'alb';
export interface Light {
  id: string;
  name?: string;
  symbol: keyof typeof symbols;
  color: Color;
  // PDF pages only; web references use sourceUrl and an empty array.
  pages: number[];
  equipment?: string;
  meaning: string;
  action: string;
  states: { label: string; text: string }[];
  detail: string;
  sourceUrl?: string;
}
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  generation: string;
  verified: boolean;
  scope: string;
  source: { title: string; url: string; documentId: string; overviewPages: number[]; verifiedAt: string; pdfPageOffset: number; format?: 'web' | 'pdf'; pageNumbering?: 'pdf'; };
  notCovered: string;
  lights: Light[];
}

// Register a vehicle only after reviewing its manual and its individual variations.
// Shared symbols contain identification metadata, never universal driving instructions.
const definitions = import.meta.glob<Vehicle>('./*.json', { eager: true, import: 'default' });
export const vehicles = Object.values(definitions).filter(vehicle => vehicle.verified === true)
  .sort((a, b) => a.brand.localeCompare(b.brand, 'ro') || a.model.localeCompare(b.model, 'ro'));
export { symbols };
export const colors: Record<Color, string> = {
  rosu: 'Roșu', galben: 'Galben', verde: 'Verde', albastru: 'Albastru', alb: 'Alb',
};
export const lightAnchor = (vehicle: Vehicle, light: Light) => `martor-${vehicle.id}-${light.id}`;
export const manualLink = (vehicle: Vehicle, page = 0) => vehicle.source.format === 'web' ? vehicle.source.url : `${vehicle.source.url}#page=${page + vehicle.source.pdfPageOffset}`;
export const lightName = (light: Light) => light.name ?? symbols[light.symbol].name;
export const lightLink = (vehicle: Vehicle, light: Light) => light.sourceUrl ?? manualLink(vehicle, light.pages[0]);
