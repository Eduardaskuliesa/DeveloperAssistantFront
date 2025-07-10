import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Node, Edge, MarkerType, Viewport } from "@xyflow/react";
import {
  CreateLayerPayload,
  CreateCabinetPayload,
  UpdateCabinetPayload,
  Position,
  LayerType,
  Layer,
} from "@/types/layer";

// Store state interface
export interface LayerStoreState {
  layers: Layer[];
  layerNodeState: Node[];
  layerEdgeState: Edge[];
  selectedLayerId: string | null;
  isLoading: boolean;
  error: string | null;
  viewport: Viewport;
  projectId: string | null;
  projectName: string | null;
  homeNodePositions: Record<string, Position>;
}

export interface LayerStoreActions {
  // Layer CRUD operations
  createLayer: (payload: CreateLayerPayload) => void;
  updateLayerPosition: (id: string, position: Position) => void;
  updateLayerText: (id: string, label: string) => void;
  deleteLayer: (id: string) => void;

  // Cabinet operations
  addCabinet: (payload: CreateCabinetPayload) => void;
  updateCabinet: (payload: UpdateCabinetPayload) => void;
  deleteCabinet: (layerId: string, cabinetId: string) => void;

  // Viewport operations
  updateViewport: (viewport: Viewport) => void;

  // Utility operations
  setProjectName: (name: string) => void;
  setProjectId: (projectId: string) => void;
  getProjectLayerNodes: () => Node[];
  getProjectLayerEdges: () => Edge[];
  getLayerById: (id: string) => Layer | undefined;
  getLayersByType: (layerType: LayerType) => Layer[];
}

export interface LayerStore extends LayerStoreState, LayerStoreActions {}

const createInitialState = (
  projectName?: string,
  projectId?: string
): LayerStoreState => ({
  layers: [],
  layerNodeState: [
    {
      id: "home",
      type: "architectureNode",
      position: { x: 700, y: 100 },
      data: {
        label: projectName || "Unitiled Project",
        type: "home",
      },
      deletable: false,
      draggable: true,
    },
  ],
  layerEdgeState: [],
  homeNodePositions: {},
  selectedLayerId: null,
  isLoading: false,
  error: null,
  projectId: projectId || null,
  projectName: projectName || null,
  viewport: { x: 0, y: 0, zoom: 1 },
});

// Create the Zustand store with types
export const useLayerStore = create<LayerStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...createInitialState(),
        setProjectId: (projectId) => {
          set((state) => {
            state.projectId = projectId;
          });
        },
        setProjectName: (name) => {
          set((state) => {
            state.projectName = name;
            const homeNode = state.layerNodeState.find(
              (node) => node.id === "home"
            );
            if (homeNode) {
              homeNode.data.label = name;
            }
          });
        },
        getProjectLayerNodes: () => {
          const { layerNodeState, layers, projectId, homeNodePositions } =
            get();

          if (!projectId) return [layerNodeState[0]];

          const projectLayerIds = layers
            .filter((layer) => layer.projectId === projectId)
            .map((layer) => layer.id);

          const homeNodePosition = homeNodePositions[projectId] || {
            x: 700,
            y: 100,
          };

          const homeNode = {
            ...layerNodeState[0],
            position: homeNodePosition,
          };

          const projectNodes = layerNodeState.filter((node) =>
            projectLayerIds.includes(node.id)
          );

          return [homeNode, ...projectNodes];
        },

        getProjectLayerEdges: () => {
          const { layerEdgeState, layers, projectId } = get();

          if (!projectId) return [];

          const projectLayerIds = layers
            .filter((layer) => layer.projectId === projectId)
            .map((layer) => layer.id);

          return layerEdgeState.filter(
            (edge) =>
              (edge.source === "home" &&
                projectLayerIds.includes(edge.target)) ||
              (projectLayerIds.includes(edge.source) &&
                projectLayerIds.includes(edge.target))
          );
        },

        createLayer: (payload: CreateLayerPayload) => {
          set((state) => {
            const newLayer: Layer = {
              id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              projectId: payload.projectId,
              teamId: payload.teamId,
              label: payload.label,
              layerType: payload.layerType,
              position: payload.position,
              cabinets: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              isVisible: true,
              color: payload.color || "#374151",
              borderColor: payload.borderColor || "#6b7280",
            };

            state.layers.push(newLayer);
            state.selectedLayerId = newLayer.id;
            state.error = null;

            state.layerNodeState.push({
              id: newLayer.id,
              type: "layerNode",
              position: newLayer.position,
              data: {
                label: newLayer.label,
                layerType: newLayer.layerType,
                cabinets: newLayer.cabinets,
              },
              deletable: true,
              draggable: true,
            });

            state.layerEdgeState.push({
              id: `home-${newLayer.id}`,
              source: "home",
              target: newLayer.id,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#737373",
              },
              style: { stroke: "#737373", strokeWidth: 2 },
              type: "bezier",
            });
          });
        },

        updateLayerPosition: (id: string, position: Position) => {
          set((state) => {
            if (id === "home" && state.projectId) {
              state.homeNodePositions[state.projectId] = position;
              return;
            }

            const layer = state.layers.find((layer: Layer) => layer.id === id);
            if (layer) {
              layer.position = position;
              layer.updatedAt = new Date();
            }

            const node = state.layerNodeState.find(
              (node: Node) => node.id === id
            );
            if (node) {
              node.position = position;
            }
          });
        },

        updateLayerText: (id: string, label: string) => {
          set((state) => {
            const layer: Layer | undefined = state.layers.find(
              (layer: Layer) => layer.id === id
            );
            if (layer) {
              layer.label = label;
              layer.updatedAt = new Date();
            }

            const node = state.layerNodeState.find(
              (node: Node) => node.id === id
            );
            if (node && node.data) {
              (node as Node).data.label = label;
            }
          });
        },

        deleteLayer: (id: string) => {
          set((state) => {
            state.layers = state.layers.filter(
              (layer: Layer) => layer.id !== id
            );

            state.layerNodeState = state.layerNodeState.filter(
              (node: Node) => node.id !== id
            );

            state.layerEdgeState = state.layerEdgeState.filter(
              (edge: Edge) => edge.source !== id && edge.target !== id
            );

            if (state.selectedLayerId === id) {
              state.selectedLayerId = null;
            }
          });
        },

        addCabinet: (payload: CreateCabinetPayload) => {
          set((state) => {
            const layer = state.layers.find(
              (layer: Layer) => layer.id === payload.layerId
            );

            if (layer) {
              const newCabinet = {
                id: `cabinet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: payload.name,
                description: payload.description || "",
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              layer.cabinets.push(newCabinet);

              const node = state.layerNodeState.find(
                (node: Node) => node.id === payload.layerId
              );
              if (node && node.data) {
                (node as Node).data.cabinets = [...layer.cabinets];
              }
            }
          });
        },

        updateCabinet: (payload: UpdateCabinetPayload) => {
          // Implementation will be added later
          console.log("updateCabinet", payload);
        },

        deleteCabinet: (layerId: string, cabinetId: string) => {
          // Implementation will be added later
          console.log("deleteCabinet", layerId, cabinetId);
        },

        updateViewport: (viewport: Viewport) => {
          set((state) => {
            state.viewport = viewport;
          });
        },

        getLayerById: (id: string) => {
          return get().layers.find((layer) => layer.id === id);
        },

        getLayersByType: (layerType: LayerType) => {
          return get().layers.filter((layer) => layer.layerType === layerType);
        },

        clearAllLayers: () => {
          set((state) => {
            state.layers = [];
            state.selectedLayerId = null;
          });
        },
      })),
      {
        name: "layer-store",
        partialize: (state: LayerStore) => ({
          layers: state.layers,
          layerNodeState: state.layerNodeState,
          layerEdgeState: state.layerEdgeState,
          selectedLayerId: state.selectedLayerId,
          viewport: state.viewport,
          homeNodePositions: state.homeNodePositions,
        }),
      }
    ),
    {
      name: "layer-store",
    }
  )
);
