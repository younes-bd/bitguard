import React, { useState, useEffect } from 'react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';
import { useManifest } from '../../../../core/hooks/useManifest';
import { GripVertical, Save, RefreshCw, ChevronDown, ChevronRight, Box } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const MenuSequenceEditor = () => {
    const { refreshManifest } = useManifest();
    const [sections, setSections] = useState([]);
    const [modulesMap, setModulesMap] = useState({}); // { sectionName: [modules...] }
    const [expandedSections, setExpandedSections] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sectionsRes, modulesRes] = await Promise.all([
                client.get('system/sections/'),
                client.get('system/modules/?limit=200')
            ]);
            
            // Handle Sections
            const sortedSections = (sectionsRes.data || []).sort((a, b) => a.sequence - b.sequence);
            setSections(sortedSections);

            // Handle Modules
            const payload = modulesRes?.data ?? modulesRes;
            let modulesList = [];
            if (Array.isArray(payload?.results)) modulesList = payload.results;
            else if (Array.isArray(payload)) modulesList = payload;
            else if (Array.isArray(payload?.modules)) modulesList = payload.modules;

            const newModulesMap = {};
            sortedSections.forEach(sec => { newModulesMap[sec.name] = []; });
            
            modulesList.forEach(mod => {
                if (mod.application !== false && mod.is_installed !== false) {
                    const secName = mod.command_center_section || 'Other';
                    if (!newModulesMap[secName]) newModulesMap[secName] = [];
                    newModulesMap[secName].push(mod);
                }
            });

            // Sort modules within sections by their sequence
            Object.keys(newModulesMap).forEach(key => {
                newModulesMap[key].sort((a, b) => (a.sequence || 99) - (b.sequence || 99));
            });

            setModulesMap(newModulesMap);
            
            // Expand all by default
            const expanded = {};
            sortedSections.forEach(s => { expanded[s.name] = true; });
            expanded['Other'] = true;
            setExpandedSections(expanded);
            
        } catch (err) {
            toast.error('Failed to load menu data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const promises = [];
            
            // 1. Update Sections
            sections.forEach((section, index) => {
                const newSequence = (index + 1) * 10;
                promises.push(client.patch(`system/sections/${section.id}/`, { sequence: newSequence }));
            });

            // 2. Update Modules
            Object.values(modulesMap).forEach(modArray => {
                modArray.forEach((mod, index) => {
                    const newSequence = (index + 1) * 10;
                    promises.push(client.patch(`system/modules/${mod.id}/`, { sequence: newSequence }));
                });
            });

            await Promise.all(promises);
            toast.success('Menu sequences updated successfully!');
            await fetchData();
            await refreshManifest();
        } catch (err) {
            toast.error('Failed to save menu sequences');
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (sectionName) => {
        setExpandedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
    };

    // SECTION DRAG & DROP
    const handleSectionDragStart = (e, index) => {
        e.stopPropagation();
        e.dataTransfer.setData('type', 'section');
        e.dataTransfer.setData('dragIndex', index.toString());
    };

    const handleSectionDrop = (e, dropIndex) => {
        e.stopPropagation();
        if (e.dataTransfer.getData('type') !== 'section') return;
        const dragIndex = Number(e.dataTransfer.getData('dragIndex'));
        if (dragIndex === dropIndex) return;

        const newSections = [...sections];
        const [draggedItem] = newSections.splice(dragIndex, 1);
        newSections.splice(dropIndex, 0, draggedItem);
        setSections(newSections);
    };

    // MODULE DRAG & DROP (Within same section only for simplicity, like Tier-1 base)
    const handleModuleDragStart = (e, sectionName, moduleIndex) => {
        e.stopPropagation();
        e.dataTransfer.setData('type', 'module');
        e.dataTransfer.setData('sectionName', sectionName);
        e.dataTransfer.setData('moduleIndex', moduleIndex.toString());
    };

    const handleModuleDrop = (e, targetSectionName, dropIndex) => {
        e.stopPropagation();
        if (e.dataTransfer.getData('type') !== 'module') return;
        
        const sourceSectionName = e.dataTransfer.getData('sectionName');
        const dragIndex = Number(e.dataTransfer.getData('moduleIndex'));
        
        // Only allow reordering within the same pillar to protect architecture
        if (sourceSectionName !== targetSectionName) {
            toast.error("Modules cannot be moved between different pillars here.");
            return;
        }
        if (dragIndex === dropIndex) return;

        setModulesMap(prev => {
            const newMap = { ...prev };
            const newArray = [...newMap[targetSectionName]];
            const [draggedItem] = newArray.splice(dragIndex, 1);
            newArray.splice(dropIndex, 0, draggedItem);
            newMap[targetSectionName] = newArray;
            return newMap;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const renderIcon = (iconName) => {
        const IconComponent = LucideIcons[iconName] || Box;
        return <IconComponent className="h-4 w-4" />;
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Menu Sequence Editor</h1>
                    <p className="text-slate-400 mt-1">Tier-1 Tree View: Drag Pillars and Apps to mathematically reorder your global layout.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all duration-200"
                >
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Sequences
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-800/50 border-b border-slate-800 grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
                    <div className="col-span-1 text-center">Drag</div>
                    <div className="col-span-8">Menu Structure</div>
                    <div className="col-span-3 text-right">Sequence Weight</div>
                </div>
                
                <div className="divide-y divide-slate-800/50">
                    {sections.map((section, index) => {
                        const isExpanded = expandedSections[section.name];
                        const sectionModules = modulesMap[section.name] || [];
                        
                        return (
                            <div key={section.id} className="flex flex-col">
                                {/* PILLAR ROW */}
                                <div
                                    draggable
                                    onDragStart={(e) => handleSectionDragStart(e, index)}
                                    onDrop={(e) => handleSectionDrop(e, index)}
                                    onDragOver={handleDragOver}
                                    className="p-4 grid grid-cols-12 gap-4 items-center bg-slate-900 hover:bg-slate-800/80 transition-colors cursor-pointer"
                                    onClick={() => toggleSection(section.name)}
                                >
                                    <div className="col-span-1 flex justify-center cursor-move text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                        <GripVertical className="h-5 w-5" />
                                    </div>
                                    <div className="col-span-8 font-bold text-white flex items-center gap-2 text-base">
                                        {isExpanded ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                                        {section.name} <span className="text-xs text-slate-500 font-normal ml-2">({sectionModules.length} Apps)</span>
                                    </div>
                                    <div className="col-span-3 text-right font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 justify-self-end text-sm">
                                        {section.sequence}
                                    </div>
                                </div>
                                
                                {/* MODULES ROW (CHILDREN) */}
                                {isExpanded && sectionModules.length > 0 && (
                                    <div className="bg-slate-950/50 border-y border-slate-800/30">
                                        {sectionModules.map((mod, modIndex) => (
                                            <div
                                                key={mod.id}
                                                draggable
                                                onDragStart={(e) => handleModuleDragStart(e, section.name, modIndex)}
                                                onDrop={(e) => handleModuleDrop(e, section.name, modIndex)}
                                                onDragOver={handleDragOver}
                                                className="p-3 pl-12 grid grid-cols-12 gap-4 items-center hover:bg-slate-800/50 transition-colors border-b border-slate-800/30 last:border-b-0"
                                            >
                                                <div className="col-span-1 flex justify-center cursor-move text-slate-600 hover:text-slate-300 transition-colors">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                                <div className="col-span-8 text-slate-300 flex items-center gap-3 text-sm">
                                                    <div className="bg-slate-800 p-1.5 rounded-md text-slate-400 border border-slate-700/50">
                                                        {renderIcon(mod.icon)}
                                                    </div>
                                                    {mod.display_name || mod.name}
                                                </div>
                                                <div className="col-span-3 text-right font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 justify-self-end text-xs">
                                                    {mod.sequence}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    
                    {sections.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No menu sections found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuSequenceEditor;
