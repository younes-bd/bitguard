import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export default function KanbanBoard({
  columns = [],
  cardRenderer,
  onCardMove,
  onColumnAdd,
  isLoading = false
}) {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, card, columnId) => {
    setDraggedCard(card);
    setDraggedFromColumn(columnId);
    // Required for Firefox
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Slight delay to allow the drag ghost to generate before we add styling
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('opacity-50', 'scale-95');
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove('opacity-50', 'scale-95');
    }
    setDraggedCard(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedCard && draggedFromColumn !== columnId) {
      onCardMove(draggedCard.id, draggedFromColumn, columnId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950 p-6 space-x-6">
      {columns.map((column) => {
        const isDragOver = dragOverColumn === column.id;
        
        return (
          <div 
            key={column.id}
            className={`flex flex-col min-w-[320px] max-w-[320px] flex-shrink-0 bg-slate-900/50 rounded-xl border transition-colors duration-200 ${isDragOver ? 'border-blue-500/50 bg-blue-900/10' : 'border-slate-800'}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`p-3 border-b border-slate-800 flex items-center justify-between`}>
              <div className="flex items-center">
                {column.color && (
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: column.color }}></div>
                )}
                <h3 className="font-semibold text-slate-200">{column.label}</h3>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                  {column.cards?.length || 0}
                </span>
              </div>
            </div>

            {/* Column Body / Cards Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 p-3 space-y-3">
              {!column.cards || column.cards.length === 0 ? (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
                  No records
                </div>
              ) : (
                column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, column.id)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing transition-transform duration-200"
                  >
                    {cardRenderer(card)}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Add Column Button (Optional) */}
      {onColumnAdd && (
        <div className="min-w-[320px] flex-shrink-0">
          <button 
            onClick={onColumnAdd}
            className="w-full flex items-center justify-center py-4 bg-slate-900/30 hover:bg-slate-800 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Stage
          </button>
        </div>
      )}
    </div>
  );
}
