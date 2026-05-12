export type SatelliteClass = "GEO" | "MEO";
export type ErrorAxis = "X" | "Y" | "Z" | "Clock";
export type ModelType = "Ridge" | "GRU";

export type DashboardControls = {
  satellite: SatelliteClass;
  errorType: ErrorAxis;
  model: ModelType;
  horizonMinutes: number;
};

