import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Edge, Viewport, Node } from "@xyflow/react";

// Database table interfaces
export interface DatabaseRow {
  id: string;
  title: string;
  type: string;
  hasLeftHandle?: boolean;
  hasRightHandle?: boolean;
}

export interface DatabaseTable {
  id: string;
  label: string;
  schema: DatabaseRow[];
  position: { x: number; y: number };
  projectId: string | null;
  cabinetId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Store state interface
export interface DatabaseStoreState {
  tables: DatabaseTable[];
  tableNodeState: Node[];
  tableEdgeState: Edge[];
  projectId: string | null;
  activeCabinetId: string | null;
  viewport: Viewport;
  cabinetViewports: Record<string, Viewport>;
}

export interface DatabaseStoreActions {
  // Table operations
  createTable: (
    projectId: string,
    cabinetId: string,
    position?: { x: number; y: number }
  ) => void;
  renameTable: (tableId: string, newLabel: string) => void;
  deleteTable: (tableId: string) => void;
  updateTablePosition: (
    tableId: string,
    position: { x: number; y: number }
  ) => void;
  addTableEdge: (edge: Edge) => void;
  updateTableEdges: (edges: Edge[]) => void;
  removeTableEdge: (edgeId: string) => void;

  createRow: (tableId: string, title: string, type?: string) => void;
  updateRow: (
    tableId: string,
    rowId: string,
    title: string,
    type: string
  ) => void;
  deleteRow: (tableId: string, rowId: string) => void;
  addRowHandle: (
    tableId: string,
    rowId: string,
    side: "left" | "right"
  ) => void;
  removeRowHandle: (
    tableId: string,
    rowId: string,
    side: "left" | "right"
  ) => void;

  // Viewport operations
  updateViewport: (viewport: Viewport) => void;
  getCabinetViewport: () => Viewport; // Add this
  updateCabinetViewport: (viewport: Viewport) => void;
  // Project operations
  setProjectId: (projectId: string) => void;
  getProjectTables: () => DatabaseTable[];
  setCabinetId: (cabinetId: string | null) => void;
  getActiveCabinetTables: () => DatabaseTable[];
  getActiveCabinetTableNodes: () => Node[];
  getActiveCabinetTableEdges: () => Edge[];
  getProjectTableNodes: () => Node[];
  getProjectTableEdges: () => Edge[];
}

export interface DatabaseStore
  extends DatabaseStoreState,
    DatabaseStoreActions {}

const createInitialState = (): DatabaseStoreState => ({
  tables: [],
  tableNodeState: [],
  tableEdgeState: [],
  activeCabinetId: null,
  projectId: null,
  cabinetViewports: {},
  viewport: { x: 0, y: 0, zoom: 1 },
});

// Create the Zustand store
export const useDatabaseStore = create<DatabaseStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...createInitialState(),

        setProjectId: (projectId) => {
          set((state) => {
            state.projectId = projectId;
          });
        },

        setCabinetId: (cabinetId) => {
          set((state) => {
            state.activeCabinetId = cabinetId;
          });
        },

        getActiveCabinetTables: () => {
          const { tables, projectId, activeCabinetId } = get();
          if (!projectId || !activeCabinetId) return [];
          return tables.filter(
            (table) =>
              table.projectId === projectId &&
              table.cabinetId === activeCabinetId
          );
        },

        getActiveCabinetTableNodes: () => {
          const { tableNodeState, tables, projectId, activeCabinetId } = get();

          if (!projectId || !activeCabinetId) return [];

          const activeCabinetTableIds = tables
            .filter(
              (table) =>
                table.projectId === projectId &&
                table.cabinetId === activeCabinetId
            )
            .map((table) => table.id);

          return tableNodeState.filter((node) =>
            activeCabinetTableIds.includes(node.id)
          );
        },

        getActiveCabinetTableEdges: () => {
          const { tableEdgeState, tables, projectId, activeCabinetId } = get();

          if (!projectId || !activeCabinetId) return [];

          const activeCabinetTableIds = tables
            .filter(
              (table) =>
                table.projectId === projectId &&
                table.cabinetId === activeCabinetId
            )
            .map((table) => table.id);

          return tableEdgeState.filter(
            (edge) =>
              activeCabinetTableIds.includes(edge.source) &&
              activeCabinetTableIds.includes(edge.target)
          );
        },

        getProjectTables: () => {
          const { tables, projectId } = get();
          if (!projectId) return [];
          return tables.filter((table) => table.projectId === projectId);
        },

        getProjectTableNodes: () => {
          const { tableNodeState, tables, projectId } = get();

          if (!projectId) return [];

          const projectTableIds = tables
            .filter((table) => table.projectId === projectId)
            .map((table) => table.id);

          return tableNodeState.filter((node) =>
            projectTableIds.includes(node.id)
          );
        },

        getProjectTableEdges: () => {
          const { tableEdgeState, tables, projectId } = get();

          if (!projectId) return [];

          const projectTableIds = tables
            .filter((table) => table.projectId === projectId)
            .map((table) => table.id);

          return tableEdgeState.filter(
            (edge) =>
              projectTableIds.includes(edge.source) &&
              projectTableIds.includes(edge.target)
          );
        },

        addTableEdge: (edge: Edge) => {
          set((state) => {
            const existingEdgeIndex = state.tableEdgeState.findIndex(
              (e) => e.id === edge.id
            );

            if (existingEdgeIndex === -1) {
              state.tableEdgeState.push(edge);
            } else {
              state.tableEdgeState[existingEdgeIndex] = edge;
            }
          });
        },

        updateTableEdges: (edges: Edge[]) => {
          set((state) => {
            state.tableEdgeState = edges;
          });
        },

        removeTableEdge: (edgeId) => {
          set((state) => {
            state.tableEdgeState = state.tableEdgeState.filter(
              (edge) => edge.id !== edgeId
            );
          });
        },

        addRowHandle: (tableId, rowId, side) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              const row = table.schema.find((r) => r.id === rowId);
              if (row) {
                if (side === "left") {
                  row.hasLeftHandle = true;
                } else {
                  row.hasRightHandle = true;
                }
                table.updatedAt = new Date();

                // Update React Flow node data
                const node = state.tableNodeState.find(
                  (node) => node.id === tableId
                );
                if (node && node.data) {
                  node.data.schema = [...table.schema];
                }
              }
            }
          });
        },

        removeRowHandle: (tableId, rowId, side) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              const row = table.schema.find((r) => r.id === rowId);
              if (row) {
                if (side === "left") {
                  row.hasLeftHandle = false;
                } else {
                  row.hasRightHandle = false;
                }
                table.updatedAt = new Date();

                const node = state.tableNodeState.find(
                  (node) => node.id === tableId
                );
                if (node && node.data) {
                  node.data.schema = [...table.schema];
                }

                const handleId =
                  side === "left" ? `${rowId}-target` : `${rowId}-source`;
                state.tableEdgeState = state.tableEdgeState.filter(
                  (edge) =>
                    edge.sourceHandle !== handleId &&
                    edge.targetHandle !== handleId
                );
              }
            }
          });
        },

        createTable: (projectId, cabinetId, position = { x: 100, y: 100 }) => {
          set((state) => {
            const newTable: DatabaseTable = {
              id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              label: "New Table",
              schema: [
                {
                  id: `row-${Date.now()}-1`,
                  title: "id",
                  type: "uuid",
                },
                {
                  id: `row-${Date.now()}-2`,
                  title: "created_at",
                  type: "timestamp",
                },
              ],

              projectId,
              cabinetId,
              position,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            state.tables.push(newTable);

            state.tableNodeState.push({
              id: newTable.id,
              type: "dataTableNode",
              position: newTable.position,
              data: {
                label: newTable.label,
                schema: newTable.schema,
                tableId: newTable.id,
              },
              deletable: true,
              draggable: true,
            });
          });
        },

        updateTablePosition: (tableId, position) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              table.position = position;
              table.updatedAt = new Date();
            }

            const node = state.tableNodeState.find(
              (node) => node.id === tableId
            );
            if (node) {
              node.position = position;
            }
          });
        },

        renameTable: (tableId, newLabel) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              table.label = newLabel;
              table.updatedAt = new Date();
            }

            const node = state.tableNodeState.find(
              (node) => node.id === tableId
            );
            if (node && node.data) {
              node.data.label = newLabel;
            }
          });
        },

        deleteTable: (tableId) => {
          set((state) => {
            state.tables = state.tables.filter((table) => table.id !== tableId);

            state.tableNodeState = state.tableNodeState.filter(
              (node) => node.id !== tableId
            );

            state.tableEdgeState = state.tableEdgeState.filter(
              (edge) => edge.source !== tableId && edge.target !== tableId
            );
          });
        },

        createRow: (tableId, title, type = "string") => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              const newRow: DatabaseRow = {
                id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title,
                type,
              };
              table.schema.push(newRow);
              table.updatedAt = new Date();

              const node = state.tableNodeState.find(
                (node) => node.id === tableId
              );
              if (node && node.data) {
                node.data.schema = [...table.schema];
              }
            }
          });
        },

        updateRow: (tableId, rowId, title, type) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              const row = table.schema.find((r) => r.id === rowId);
              if (row) {
                row.title = title;
                row.type = type;
                table.updatedAt = new Date();

                const node = state.tableNodeState.find(
                  (node) => node.id === tableId
                );
                if (node && node.data) {
                  node.data.schema = [...table.schema];
                }
              }
            }
          });
        },

        deleteRow: (tableId, rowId) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              table.schema = table.schema.filter((row) => row.id !== rowId);
              table.updatedAt = new Date();

              const node = state.tableNodeState.find(
                (node) => node.id === tableId
              );
              if (node && node.data) {
                node.data.schema = [...table.schema];
              }
            }
          });
        },

        updateViewport: (viewport) => {
          set((state) => {
            state.viewport = viewport;
          });
        },
        getCabinetViewport: () => {
          const { cabinetViewports, activeCabinetId, viewport } = get();
          if (!activeCabinetId) return viewport;
          return cabinetViewports[activeCabinetId] || viewport;
        },

        updateCabinetViewport: (viewport: Viewport) => {
          set((state) => {
            if (state.activeCabinetId) {
              state.cabinetViewports[state.activeCabinetId] = viewport;
            } else {
              state.viewport = viewport;
            }
          });
        },
      })),
      {
        name: "database-store",
        partialize: (state: DatabaseStore) => ({
          tables: state.tables,
          tableNodeState: state.tableNodeState,
          tableEdgeState: state.tableEdgeState,
          projectId: state.projectId,
          viewport: state.viewport,
        }),
      }
    ),
    {
      name: "database-store",
    }
  )
);
