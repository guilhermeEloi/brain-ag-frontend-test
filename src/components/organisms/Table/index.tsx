import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

export interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface Action<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
}

interface DynamicTableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
}

const DynamicTable = <T extends { id: number | string }>({
  columns,
  data,
  actions = [],
}: DynamicTableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={String(col.accessor)}
                style={{ fontSize: "1.2rem", fontWeight: 800 }}
              >
                {col.header}
              </TableCell>
            ))}
            {actions.length > 0 && (
              <TableCell
                align="right"
                style={{ fontSize: "1.2rem", fontWeight: 800 }}
              >
                Ações
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.accessor)}
                  style={{ fontSize: "1rem", fontWeight: 500 }}
                >
                  {row[col.accessor] != null && row[col.accessor] !== ""
                    ? String(row[col.accessor])
                    : "-"}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right">
                  {actions.map((action, i) => (
                    <IconButton
                      key={i}
                      title={action.label}
                      onClick={() => action.onClick(row)}
                    >
                      {action.icon}
                    </IconButton>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
