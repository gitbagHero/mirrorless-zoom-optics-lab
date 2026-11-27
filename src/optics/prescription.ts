// Nikon WO2020157904A1, reference example 12, table 12.
// Units are millimetres except indices, Abbe numbers and half field angle in degrees.

export type SpacingKey = "D1" | "D2" | "D3" | "D4" | "D5" | "BF";

export interface Surface {
  id: number;
  radius: number;
  spacing: number | SpacingKey;
  indexAfter: number;
  abbeAfter: number | null;
}

export interface Asphere {
  kappa: number;
  coefficients: readonly [number, number, number, number, number];
}

export interface ZoomAnchor {
  id: "W" | "M1" | "M2" | "T";
  focalLength: number;
  fNumber: number;
  halfAngle: number;
  spacing: Readonly<Record<SpacingKey, number>>;
  near: { D0: number; D4: number; D5: number };
}

export const STOP = 15;

export const SURFACES: readonly Surface[] = [
  { id: 1, radius: 181.0189, spacing: 2.0855, indexAfter: 1.90366, abbeAfter: 31.27 },
  { id: 2, radius: 74.7364, spacing: 0.8982, indexAfter: 1, abbeAfter: null },
  { id: 3, radius: 78.3131, spacing: 6.0267, indexAfter: 1.59319, abbeAfter: 67.90 },
  { id: 4, radius: -878.349, spacing: 0.1429, indexAfter: 1, abbeAfter: null },
  { id: 5, radius: 65.0716, spacing: 4.834, indexAfter: 1.59319, abbeAfter: 67.90 },
  { id: 6, radius: 661.4054, spacing: "D1", indexAfter: 1, abbeAfter: null },
  { id: 7, radius: 171.3932, spacing: 1.1, indexAfter: 1.90265, abbeAfter: 35.72 },
  { id: 8, radius: 18.9469, spacing: 5.2527, indexAfter: 1, abbeAfter: null },
  { id: 9, radius: -57.6716, spacing: 1, indexAfter: 1.755, abbeAfter: 52.33 },
  { id: 10, radius: 53.7286, spacing: 0.4722, indexAfter: 1, abbeAfter: null },
  { id: 11, radius: 34.8478, spacing: 3.165, indexAfter: 1.92286, abbeAfter: 20.88 },
  { id: 12, radius: -81.2943, spacing: 1.3566, indexAfter: 1, abbeAfter: null },
  { id: 13, radius: -31.9419, spacing: 0.9, indexAfter: 1.816, abbeAfter: 46.59 },
  { id: 14, radius: -487.103, spacing: "D2", indexAfter: 1, abbeAfter: null },
  { id: 15, radius: Infinity, spacing: 2.0101, indexAfter: 1, abbeAfter: null },
  { id: 16, radius: 45.9039, spacing: 2.3316, indexAfter: 1.90265, abbeAfter: 35.72 },
  { id: 17, radius: -163.4046, spacing: 0.5, indexAfter: 1, abbeAfter: null },
  { id: 18, radius: 33.617, spacing: 1.1581, indexAfter: 2.001, abbeAfter: 29.12 },
  { id: 19, radius: 19.767, spacing: 3.5655, indexAfter: 1.57957, abbeAfter: 53.74 },
  { id: 20, radius: -85.9122, spacing: 1.37, indexAfter: 1, abbeAfter: null },
  { id: 21, radius: -41.3606, spacing: 1.0329, indexAfter: 1.95375, abbeAfter: 32.33 },
  { id: 22, radius: 1717.1475, spacing: "D3", indexAfter: 1, abbeAfter: null },
  { id: 23, radius: 37.7633, spacing: 4.9751, indexAfter: 1.83481, abbeAfter: 42.73 },
  { id: 24, radius: -38.9447, spacing: 1, indexAfter: 1.90366, abbeAfter: 31.27 },
  { id: 25, radius: -804.1582, spacing: 0.1, indexAfter: 1, abbeAfter: null },
  { id: 26, radius: 29.7427, spacing: 3.0986, indexAfter: 1.95375, abbeAfter: 32.33 },
  { id: 27, radius: 15.4408, spacing: 8.8739, indexAfter: 1.4971, abbeAfter: 81.49 },
  { id: 28, radius: -39.9876, spacing: "D4", indexAfter: 1, abbeAfter: null },
  { id: 29, radius: 10338.573, spacing: 3.6738, indexAfter: 1.84666, abbeAfter: 23.80 },
  { id: 30, radius: -27.608, spacing: 1, indexAfter: 1.85135, abbeAfter: 40.13 },
  { id: 31, radius: 31.8891, spacing: "D5", indexAfter: 1, abbeAfter: null },
  { id: 32, radius: -29.8624, spacing: 1.4, indexAfter: 1.85135, abbeAfter: 40.13 },
  { id: 33, radius: -63.8559, spacing: 0.1, indexAfter: 1, abbeAfter: null },
  { id: 34, radius: 66.4034, spacing: 4.5715, indexAfter: 1.68376, abbeAfter: 37.57 },
  { id: 35, radius: -424.4531, spacing: "BF", indexAfter: 1, abbeAfter: null },
];

export const ASPHERES: Readonly<Partial<Record<number, Asphere>>> = {
  28: { kappa: 1.0000, coefficients: [2.91470E-05, -1.17772E-07, 9.21285E-10, -5.94865E-12, 1.4842E-14] },
  31: { kappa: 1.0000, coefficients: [-5.83910E-06, 1.34714E-07, -1.32747E-09, 8.60735E-12, -2.2325E-14] },
  33: { kappa: 1.0000, coefficients: [4.26328E-06, -4.06929E-09, 4.06528E-11, -1.22140E-13, 0] },
};

export const ZOOM_ANCHORS: readonly ZoomAnchor[] = [
  {
    id: "W", focalLength: 24.72000, fNumber: 4.12000, halfAngle: 42.96973,
    spacing: { D1: 1.73220, D2: 20.01315, D3: 13.56296, D4: 4.09147, D5: 9.90112, BF: 11.75486 },
    near: { D0: 370.94930, D4: 4.89647, D5: 9.09612 },
  },
  {
    id: "M1", focalLength: 49.99999, fNumber: 5.69956, halfAngle: 22.56096,
    spacing: { D1: 15.73205, D2: 10.99318, D3: 6.37783, D4: 4.09147, D5: 17.08625, BF: 21.36749 },
    near: { D0: 406.35680, D4: 5.55202, D5: 15.62570 },
  },
  {
    id: "M2", focalLength: 104.99993, fNumber: 6.30000, halfAngle: 11.03929,
    spacing: { D1: 40.41864, D2: 5.91904, D3: 3.44003, D4: 4.09147, D5: 20.02405, BF: 31.30545 },
    near: { D0: 476.80640, D4: 7.55497, D5: 16.56055 },
  },
  {
    id: "T", focalLength: 194.00004, fNumber: 6.50003, halfAngle: 6.08825,
    spacing: { D1: 55.46338, D2: 1.09143, D3: 1.69135, D4: 4.09147, D5: 21.77273, BF: 39.32701 },
    near: { D0: 558.56770, D4: 11.91843, D5: 13.94577 },
  },
];
