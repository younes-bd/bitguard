import React, { useState, useEffect } from 'react';
import { hrService } from '../../api/hrService';
import { Award, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SkillsMatrix() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await hrService.getEmployeeSkills();
      setSkills(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch skills matrix');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 h-screen items-center bg-slate-950"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Skills Matrix</h1>
            <p className="text-sm text-slate-400">Employee capability mapping and proficiency</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6">
            {skills.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    No skills configured yet. Add skills to employees to see the matrix.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-200">{skill.skill_name}</h3>
                                    <p className="text-xs text-slate-400">Employee ID: {skill.employee}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    skill.level === 'expert' ? 'bg-purple-500/10 text-purple-400' :
                                    skill.level === 'advanced' ? 'bg-emerald-500/10 text-emerald-400' :
                                    skill.level === 'intermediate' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-slate-700 text-slate-300'
                                }`}>
                                    {skill.level.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Proficiency</span>
                                    <span className="text-slate-200">{skill.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div 
                                        className="bg-purple-500 h-2 rounded-full transition-all"
                                        style={{ width: `${skill.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
