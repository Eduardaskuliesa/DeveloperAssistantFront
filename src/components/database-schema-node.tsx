import React, { ReactNode } from "react";
import { BaseNode } from "@/components/base-node";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* DATABASE SCHEMA NODE HEADER ------------------------------------------------ */
export type DatabaseSchemaNodeHeaderProps = {
  children?: ReactNode;
  className?: string;
};

export const DatabaseSchemaNodeHeader = ({
  children,
  className,
}: DatabaseSchemaNodeHeaderProps) => {
  return (
    <h2
      className={cn(
        "rounded-tl-md rounded-tr-md bg-theme-gray p-2 text-center text-sm",
        className
      )}
    >
      {children}
    </h2>
  );
};

/* DATABASE SCHEMA NODE BODY -------------------------------------------------- */
export type DatabaseSchemaNodeBodyProps = {
  children?: ReactNode;
  className?: string;
};

export const DatabaseSchemaNodeBody = ({
  children,
  className,
}: DatabaseSchemaNodeBodyProps) => {
  return (
    <table className={cn("border-spacing-10 overflow-visible", className)}>
      <TableBody>{children}</TableBody>
    </table>
  );
};

/* DATABASE SCHEMA TABLE ROW -------------------------------------------------- */
export type DatabaseSchemaTableRowProps = {
  children: ReactNode;
  className?: string;
};

export const DatabaseSchemaTableRow = ({
  children,
  className,
}: DatabaseSchemaTableRowProps) => {
  return (
    <TableRow className={cn("relative text-xs", className)}>
      {children}
    </TableRow>
  );
};

/* DATABASE SCHEMA TABLE CELL ------------------------------------------------- */
export type DatabaseSchemaTableCellProps = {
  className?: string;
  children?: ReactNode;
};

export const DatabaseSchemaTableCell = ({
  className,
  children,
}: DatabaseSchemaTableCellProps) => {
  return <TableCell className={cn("", className)}>{children}</TableCell>;
};

/* DATABASE SCHEMA NODE ------------------------------------------------------- */
export type DatabaseSchemaNodeProps = {
  className?: string;
  selected?: boolean;
  children?: ReactNode;
};

export const DatabaseSchemaNode = ({
  className,
  selected,
  children,
}: DatabaseSchemaNodeProps) => {
  return (
    <BaseNode className={className} selected={selected}>
      {children}
    </BaseNode>
  );
};
