export interface Position {
  x: number;
  y: number;
}

export interface Cabinet {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LayerType =
  | "frontend"
  | "backend"
  | "database"
  | "infrastructure"
  | "integration"
  | "custom";

export interface Layer {
  id: string;
  projectId: string;
  teamId: string;
  label: string;
  layerType: LayerType;
  position: Position;
  cabinets: Cabinet[];
  createdAt: Date;
  updatedAt: Date;
  isVisible: boolean;
  color?: string;
  borderColor?: string;
}

export interface CreateLayerPayload {
  label: string;
  projectId: string;
  teamId: string;
  layerType: LayerType;
  position: Position;
  color?: string;
  borderColor?: string;
}

export interface UpdateLayerPayload {
  id: string;
  label?: string;
  layerType?: LayerType;
  position?: Position;
  color?: string;
  borderColor?: string;
  isVisible?: boolean;
}

// Cabinet creation payload
export interface CreateCabinetPayload {
  layerId: string;
  name: string;
  description?: string;
}

// Cabinet update payload
export interface UpdateCabinetPayload {
  layerId: string;
  cabinetId: string;
  name?: string;
  description?: string;
}
