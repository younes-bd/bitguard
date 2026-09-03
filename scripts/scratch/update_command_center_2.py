import re

file_path = "frontend/src/apps/board/pages/CommandCenter.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 5. Replace enterprisePillars rendering
pillars_render_old = """                    {enterprisePillars.map((pillar) => {
                        const visibleTiles = pillar.tiles;
                        if (visibleTiles.length === 0) return null;
                        return (
                        <div key={pillar.name} className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <pillar.icon size={14} className="text-blue-500" />
                                {pillar.name}
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {pillar.tiles.map((tile) => {
                                const isInstalled = tile.techName === null || (installedSet && installedSet.has(tile.techName));
                                const displayStatus = isInstalled ? tile.status : 'idle';
                                const displayPath = isInstalled ? tile.path : `/admin/apps?highlight=${tile.techName}`;
                                return (
                                    <ModuleTile key={tile.title} {...tile} status={displayStatus} path={displayPath} isInstalled={isInstalled} />
                                );
                                })}
                            </div>
                        </div>
                    );
                    })}"""

pillars_render_new = """                    {dynamicPillars.map((pillar, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                {/* Use a default icon since we don't have category icons in DB yet */}
                                <Layers size={14} className="text-blue-500" />
                                {pillar.name}
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {pillar.tiles.map((tile, tidx) => (
                                    <ModuleTile key={tidx} {...tile} isInstalled={true} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {installedModules.length === 0 && !modulesLoading && (
                        <div className="text-center py-20 col-span-full">
                            <Layers size={40} className="mx-auto mb-3 text-slate-700" />
                            <p className="font-bold text-slate-300">No modules installed yet.</p>
                            <Link to="/admin/apps" className="text-sky-400 text-sm hover:underline mt-2 inline-block">
                                Browse the App Store →
                            </Link>
                        </div>
                    )}"""
content = content.replace(pillars_render_old, pillars_render_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
