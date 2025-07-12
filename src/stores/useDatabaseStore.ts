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
  createdAt: Date;
  updatedAt: Date;
}

// Store state interface
export interface DatabaseStoreState {
  tables: DatabaseTable[];
  tableNodeState: Node[];
  tableEdgeState: Edge[];
  projectId: string | null;
  viewport: Viewport;
}

export interface DatabaseStoreActions {
  // Table operations
  createTable: (projectId: string, position?: { x: number; y: number }) => void;
  renameTable: (tableId: string, newLabel: string) => void;
  deleteTable: (tableId: string) => void;
  updateTablePosition: (
    tableId: string,
    position: { x: number; y: number }
  ) => void;
  addTableEdge: (edge: Edge) => void;
  updateTableEdges: (edges: Edge[]) => void;
  removeTableEdge: (edgeId: string) => void;

  // Row operations
  createRow: (tableId: string, title: string, type?: string) => void;
  updateRow: (
    tableId: string,
    rowId: string,
    title: string,
    type: string
  ) => void;
  deleteRow: (tableId: string, rowId: string) => void;
  addRowHandle: (tableId: string, rowId: string, side: 'left' | 'right') => void;
  removeRowHandle: (tableId: string, rowId: string, side: 'left' | 'right') => void;

  // Viewport operations
  updateViewport: (viewport: Viewport) => void;

  // Project operations
  setProjectId: (projectId: string) => void;
  getProjectTables: () => DatabaseTable[];
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
  projectId: null,
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
            const existingEdgeIndex = state.tableEdgeState.findIndex(e => e.id === edge.id);
            
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
                if (side === 'left') {
                  row.hasLeftHandle = true;
                } else {
                  row.hasRightHandle = true;
                }
                table.updatedAt = new Date();

                // Update React Flow node data
                const node = state.tableNodeState.find((node) => node.id === tableId);
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
                if (side === 'left') {
                  row.hasLeftHandle = false;
                } else {
                  row.hasRightHandle = false;
                }
                table.updatedAt = new Date();

                // Update React Flow node data
                const node = state.tableNodeState.find((node) => node.id === tableId);
                if (node && node.data) {
                  node.data.schema = [...table.schema];
                }
              }
            }
          });
        },

        createTable: (projectId, position = { x: 100, y: 100 }) => {
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
              position,
              projectId,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Add to tables array
            state.tables.push(newTable);

            // Add to React Flow node state
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

            // Update label in React Flow node data
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

              // Update React Flow node data
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

        deleteRow: (tableId, rowId) => {
          set((state) => {
            const table = state.tables.find((t) => t.id === tableId);
            if (table) {
              table.schema = table.schema.filter((row) => row.id !== rowId);
              table.updatedAt = new Date();

              // Update React Flow node data
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