import React from 'react';
import BreadcrumbNav from '../navigation/BreadcrumbNav';
import StatusBar from './StatusBar';
import ChatterPanel from '../chatter/ChatterPanel';

export default function RecordFormLayout({
  title,
  breadcrumbs = [],
  stages = [],
  currentStage,
  onStageChange,
  actions = [],
  chatterModel,
  chatterObjectId,
  children
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900 overflow-hidden">
      {/* Top App Bar / Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 flex-shrink-0">
        <div className="flex flex-col mb-4 sm:mb-0">
          <BreadcrumbNav items={breadcrumbs} className="mb-2" />
          <h1 className="text-2xl font-bold text-slate-100 flex items-center">
            {title}
          </h1>
        </div>

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action, idx) => {
              const baseClasses = "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm";
              let variantClasses = "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700";
              
              if (action.variant === 'primary') {
                variantClasses = "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-900/20";
              } else if (action.variant === 'success') {
                variantClasses = "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-900/20";
              } else if (action.variant === 'danger') {
                variantClasses = "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-900/20";
              }

              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`${baseClasses} ${variantClasses}`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area (Form + Chatter) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* Left Column: Form Fields & Status Bar */}
        <div className={`flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 relative ${chatterModel ? 'lg:w-[65%]' : 'w-full'}`}>
          {/* Status Pipeline Bar */}
          {stages && stages.length > 0 && (
            <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md px-6 py-3 border-b border-slate-800">
              <StatusBar 
                stages={stages} 
                currentStage={currentStage} 
                onChange={onStageChange} 
                variant={onStageChange ? 'pipeline' : 'readonly'}
              />
            </div>
          )}
          
          <div className="p-6 max-w-5xl mx-auto w-full">
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-sm">
              {children}
            </div>
          </div>
        </div>

        {/* Right Column: Chatter Panel */}
        {chatterModel && chatterObjectId && (
          <div className="w-full lg:w-[35%] lg:min-w-[400px] lg:max-w-[500px] border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950 flex flex-col z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">
            <ChatterPanel 
              model={chatterModel} 
              objectId={chatterObjectId} 
              className="flex-1 border-none shadow-none" 
            />
          </div>
        )}

      </div>
    </div>
  );
}
