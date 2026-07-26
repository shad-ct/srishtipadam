import React from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-12 text-center bg-surface-raised border border-border rounded-md">
        <p className="text-text-secondary font-medium">No data available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface-raised border border-border rounded-md shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface border-b border-border">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 text-xs font-bold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row._id || rowIdx} className="border-b border-border hover:bg-surface/50 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-4 text-sm text-text">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="p-4 text-sm text-right space-x-3 whitespace-nowrap">
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-primary hover:underline font-medium">
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="text-error hover:underline font-medium">
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
