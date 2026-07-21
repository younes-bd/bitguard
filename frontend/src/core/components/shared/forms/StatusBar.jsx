import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export default function StatusBar({ 
  stages = [], 
  currentStage, 
  onChange, 
  variant = 'pipeline' 
}) {
  const currentIndex = stages.findIndex(s => s.key === currentStage);

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide py-2 px-1">
      <div className="flex bg-slate-900 border border-slate-700/50 rounded-full p-1 shadow-inner relative overflow-hidden">
        {stages.map((stage, index) => {
          const isActive = stage.key === currentStage;
          const isPast = index < currentIndex;
          const isClickable = variant === 'pipeline' && onChange;
          
          let bgColor = 'transparent';
          let textColor = 'text-slate-400';
          let borderColor = 'border-transparent';
          
          if (isActive) {
            bgColor = stage.color ? `bg-[${stage.color}]/10` : 'bg-blue-500/10';
            textColor = stage.color ? `text-[${stage.color}]` : 'text-blue-400';
            borderColor = stage.color ? `border-[${stage.color}]/30` : 'border-blue-500/30';
          } else if (isPast) {
            textColor = 'text-slate-300';
          }

          return (
            <button
              key={stage.key}
              disabled={!isClickable}
              onClick={() => isClickable && onChange(stage.key)}
              className={`
                relative flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                border
                ${bgColor} ${textColor} ${borderColor}
                ${isClickable && !isActive ? 'hover:bg-slate-800 hover:text-slate-200 cursor-pointer' : ''}
                ${!isClickable ? 'cursor-default' : ''}
              `}
            >
              {isPast && (
                <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
              )}
              {stage.label}
              
              {/* Arrow separator (don't show on last item) */}
              {index < stages.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
