import React, { useState } from 'react';
import {
    ArrowRightCircle,
    Database,
    Loader2,
    CheckCircle,
    AlertTriangle,
    RefreshCcw
} from 'lucide-react';
import api from '../services/api';

const MigrationHub = ({ allDatabases }) => {
    const [sourceDb, setSourceDb] = useState('');
    const [targetDb, setTargetDb] = useState('');
    const [isMigrating, setIsMigrating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const startMigration = async () => {
        // 1. Validation Logic
        if (!sourceDb || !targetDb) {
            setStatus({ type: 'error', message: 'Please select both a Source and a Target database.' });
            return;
        }

        if (sourceDb === targetDb) {
            setStatus({ type: 'error', message: 'Source and Target cannot be the same database.' });
            return;
        }

        // 2. State Update
        setIsMigrating(true);
        setStatus({ type: 'progress', message: 'Migration initiated. Streaming data via pg_dump...' });

        try {
            // 3. API Request
            const response = await api.post('/databases/migrate', {
                sourceDbName: sourceDb,
                targetDbName: targetDb
            });

            setStatus({
                type: 'success',
                message: response.data.message || 'Data migration completed successfully!'
            });

            // Reset selections after success
            setSourceDb('');
            setTargetDb('');

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Migration failed. Ensure target is empty or has matching schema.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <section className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl shadow-indigo-500/5">

            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <RefreshCcw className={`text-amber-600 ${isMigrating ? 'animate-spin' : ''}`} size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-800">Migration Hub</h2>
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">
                    v1.0 Stable
                </span>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-6">

                {/* Source Dropdown */}
                <div className="group bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm focus-within:border-indigo-500/50 transition-all">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                        Source <span className="text-zinc-300">(From)</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <Database className="text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
                        <select
                            value={sourceDb}
                            onChange={(e) => setSourceDb(e.target.value)}
                            disabled={isMigrating}
                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-zinc-700 cursor-pointer appearance-none"
                        >
                            <option value="">Select source database...</option>
                            {allDatabases.map(db => (
                                <option key={db} value={db}>{db}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Central Execute Trigger */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={startMigration}
                        disabled={isMigrating || !sourceDb || !targetDb}
                        className="group relative p-2 disabled:opacity-30 disabled:grayscale transition-all hover:scale-110 active:scale-95"
                    >
                        {isMigrating ? (
                            <Loader2 className="animate-spin text-indigo-600" size={54} />
                        ) : (
                            <ArrowRightCircle
                                size={60}
                                className="text-zinc-900 group-hover:text-indigo-600 transition-colors"
                            />
                        )}
                    </button>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase mt-2">Execute</p>
                </div>

                {/* Target Dropdown */}
                <div className="group bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm focus-within:border-indigo-500/50 transition-all">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                        Target <span className="text-indigo-400">(To)</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <Database className="text-indigo-600" size={22} />
                        <select
                            value={targetDb}
                            onChange={(e) => setTargetDb(e.target.value)}
                            disabled={isMigrating}
                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-zinc-700 cursor-pointer appearance-none"
                        >
                            <option value="">Select target database...</option>
                            {allDatabases.map(db => (
                                <option key={db} value={db}>{db}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Status Overlay/Footer */}
            {status.message && (
                <div className={`mt-8 flex items-center gap-4 p-5 rounded-2xl border transition-all animate-in slide-in-from-bottom-4 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                        status.type === 'progress' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' :
                            'bg-rose-50 border-rose-100 text-rose-800'
                    }`}>
                    <div className="flex-shrink-0">
                        {status.type === 'success' && <CheckCircle size={24} />}
                        {status.type === 'progress' && <Loader2 className="animate-spin text-indigo-600" size={24} />}
                        {status.type === 'error' && <AlertTriangle size={24} />}
                    </div>
                    <div>
                        <p className="text-sm font-bold">{status.type === 'success' ? 'Success' : status.type === 'error' ? 'Attention Required' : 'Processing'}</p>
                        <p className="text-xs opacity-80 mt-0.5">{status.message}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MigrationHub;