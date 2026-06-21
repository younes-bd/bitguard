import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowLeft, Download } from 'lucide-react';
import supportService from '../../../../core/api/supportService';
import reportingService from '../../../../core/api/reportingService';
import { toast } from 'react-hot-toast';

const statusBadge = (status) => {
    const map = {
        open: 'bg-blue-500/10 text-blue-400',
        in_progress: 'bg-amber-500/10 text-amber-400',
        resolved: 'bg-emerald-500/10 text-emerald-400',
        closed: 'bg-slate-700 text-slate-400',
        escalated: 'bg-red-500/10 text-red-400',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
};

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        supportService.getTicket(id)
            .then(data => {
                setTicket(data);
                setLoading(false);
            })
            .catch(err => {
                toast.error('Failed to load ticket details.');
                setLoading(false);
            });
    }, [id]);

    const handleDownloadPdf = async () => {
        setGenerating(true);
        try {
            await reportingService.generateReport(null, 'support.Ticket', ticket.id);
            toast.success('Document downloaded successfully');
        } catch (error) {
            toast.error('Failed to generate document');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="p-8 text-center text-slate-500">Ticket not found</div>;
    }

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <button onClick={() => navigate('/admin/support/tickets')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4">
                <ArrowLeft size={16} /> Back to Tickets
            </button>
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full overflow-hidden shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Ticket #{ticket.id?.toString().slice(0, 8)}</h3>
                        <p className="text-slate-400 text-sm">{ticket.subject || ticket.title}</p>
                    </div>
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={generating}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download size={16} /> {generating ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
                <div className="p-6 text-slate-300 text-sm space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-500 uppercase text-xs font-bold mb-1">Status</p>
                            <div>{statusBadge(ticket.status)}</div>
                        </div>
                        <div>
                            <p className="text-slate-500 uppercase text-xs font-bold mb-1">Due Date</p>
                            <p className="font-mono text-white">{ticket.due_date ? new Date(ticket.due_date).toLocaleString() : 'No SLA Match'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 uppercase text-xs font-bold mb-1">Description</p>
                        <div className="bg-slate-800/50 p-4 rounded-lg">{ticket.description || 'No description provided.'}</div>
                    </div>

                    {/* AI Triage Block */}
                    {['high', 'critical'].includes(ticket.priority) && (
                        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                            <Sparkles className="text-blue-400 mt-0.5" size={20} />
                            <div>
                                <h4 className="text-white font-bold text-sm">BitGuard AI Analysis</h4>
                                <p className="text-blue-200 text-xs mt-1">
                                    Ticket was automatically triaged to <span className="font-bold uppercase text-white">{ticket.priority}</span> priority based on detected urgency keywords.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* KB Integration Section */}
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-blue-400"/> Knowledge Base Integration</h4>
                        {ticket.is_converted_to_kb ? (
                            <p className="text-emerald-400 text-sm flex items-center gap-2"><CheckCircle size={14}/> Successfully converted to KB Article.</p>
                        ) : (
                            <div className="flex gap-3">
                                {ticket.status === 'resolved' && (
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await supportService.createKbFromTicket(ticket.id);
                                                toast.success('Converted to KB successfully');
                                                setTicket({...ticket, is_converted_to_kb: true});
                                            } catch (e) {
                                                toast.error('Error converting to KB article');
                                            }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Convert to KB Article
                                    </button>
                                )}
                                <button onClick={() => {
                                    const id = prompt('Enter KB Article ID to link:');
                                    if (id) {
                                        supportService.linkArticle(ticket.id, id)
                                            .then(() => toast.success('KB Article linked!'))
                                            .catch(() => toast.error('Failed to link article.'));
                                    }
                                }} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 transition-colors">
                                    Link Existing KB Article
                                </button>
                            </div>
                        )}
                        {ticket.related_articles?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-slate-400 text-xs uppercase font-bold mb-2">Linked Articles</p>
                                <ul className="space-y-1">
                                    {ticket.related_articles.map(id => (
                                        <li key={id} className="text-blue-400 text-sm cursor-pointer hover:underline">Article ID: {id}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;

