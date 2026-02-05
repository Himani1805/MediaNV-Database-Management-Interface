import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Loader2, Database } from 'lucide-react';
import api from '../services/api';

const VerifyDatabase = () => {
  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'found', or 'not_found'

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await api.post('/databases/verify', { dbName: inputName });
      
      if (response.data.exists) {
        setStatus('found');
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      // If backend returns 404, the catch block handles it
      setStatus('not_found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6">
        <Search size={20} className="text-zinc-500" />
        <h2 className="text-lg font-semibold text-zinc-800">Verify Existence</h2>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Database size={18} />
          </div>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Search database name..."
            className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputName.trim()}
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Database'}
        </button>
      </form>

      {/* Result Cards */}
      <div className="mt-6">
        {status === 'found' && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="text-emerald-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-emerald-800">Found</p>
              <p className="text-xs text-emerald-700 mt-1">
                Database exists and is ready for migration.
              </p>
            </div>
          </div>
        )}

        {status === 'not_found' && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-lg animate-in fade-in zoom-in duration-300">
            <XCircle className="text-rose-600 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-rose-800">Not Found</p>
              <p className="text-xs text-rose-700 mt-1">
                Database not found. Please check the name or create it first.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDatabase;