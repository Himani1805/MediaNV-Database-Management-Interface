import React, { useState } from 'react';
import { Database, PlusCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CreateDatabase = ({ onSuccess }) => {
    const [dbName, setDbName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleCreate = async (e) => {
        e.preventDefault();

        // Prevent empty or whitespace-only submissions
        if (!dbName.trim()) {
            setMessage({ text: 'Please enter a database name', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await api.post('/databases', { dbName });

            setMessage({
                text: response.data.message || `Database "${dbName}" created!`,
                type: 'success'
            });
            setDbName(''); // Clear input on success

            // Trigger auto-refresh
            if (onSuccess) onSuccess();

        } catch (err) {
            // Pull error message from backend or fallback to default
            const errorMsg = err.response?.data?.message || 'Failed to create database';
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setLoading(false);
            // Optional: Clear message after 5 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <PlusCircle size={20} className="text-indigo-600" />
                <h2 className="text-lg font-semibold text-zinc-800">New Database</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <Database size={18} />
                    </div>
                    <input
                        type="text"
                        value={dbName}
                        onChange={(e) => setDbName(e.target.value)}
                        placeholder="Enter database name (e.g. sales_data)"
                        disabled={loading}
                        className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:bg-zinc-400"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        'Create Database'
                    )}
                </button>
            </form>

            {/* Feedback Messages */}
            {message.text && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-1 ${message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default CreateDatabase;