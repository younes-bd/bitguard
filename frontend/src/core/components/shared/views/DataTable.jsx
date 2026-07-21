import React, { useState } from 'react';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  MoreHorizontal, Loader2, Search
} from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  onRowClick,
  onSort,
  pagination,
  selectedIds = new Set(),
  onSelectionChange,
  actions = [],
  searchSlot
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(new Set(data.map(row => row.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation(); // prevent row click
    const newSelected = new Set(selectedIds);
    if (e.target.checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectionChange(newSelected);
  };

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex-1 max-w-md mr-4">
          {searchSlot}
        </div>
        
        {/* Bulk Actions */}
        {selectedIds.size > 0 && actions.length > 0 && (
          <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-slate-400 mr-2">{selectedIds.size} selected</span>
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(Array.from(selectedIds))}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors flex items-center"
              >
                {action.icon && <span className="mr-1.5">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3 border-b border-slate-800 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500/50 bg-slate-800"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th 
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-800 transition-colors' : ''}
                  `}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                </th>
              ))}
              {/* Actions Column */}
              <th className="px-4 py-3 border-b border-slate-800 w-16 bg-slate-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {isLoading ? (
              // Skeleton Loading Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} className="animate-pulse">
                  {onSelectionChange && <td className="px-4 py-4 w-12"><div className="w-4 h-4 bg-slate-800 rounded"></div></td>}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                    </td>
                  ))}
                  <td className="px-4 py-4 w-16"></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 2 : 1)} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Search className="w-8 h-8 text-slate-700" />
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row) => {
                const isSelected = selectedIds.has(row.id);
                const isHovered = hoveredRowId === row.id;

                return (
                  <tr 
                    key={row.id}
                    onMouseEnter={() => setHoveredRowId(row.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`
                      group transition-colors 
                      ${onRowClick ? 'cursor-pointer hover:bg-slate-800/50' : ''}
                      ${isSelected ? 'bg-blue-900/10 hover:bg-blue-900/20' : 'bg-slate-950'}
                    `}
                  >
                    {onSelectionChange && (
                      <td className="px-4 py-3 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(e, row.id)}
                          className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500/50 bg-slate-800"
                        />
                      </td>
                    )}
                    
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-slate-300">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}

                    {/* Inline Actions (Visible on hover) */}
                    <td className="px-4 py-3 w-16 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className={`p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/50">
          <div className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{(pagination.page - 1) * pagination.pageSize + 1}</span> to <span className="font-medium text-slate-200">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span> of <span className="font-medium text-slate-200">{pagination.total}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
