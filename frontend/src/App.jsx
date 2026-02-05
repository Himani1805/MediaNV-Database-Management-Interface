import React, { useState, useEffect, useCallback } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import api from './services/api';
import CreateDatabase from './components/CreateDatabase';
import VerifyDatabase from './components/VerifyDatabase';
import MigrationHub from './components/MigrationHub';
import DatabaseList from './components/DatabaseList';

function App() {
  const [allDatabases, setAllDatabases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoized fetch function so it can be called from anywhere
  const fetchDatabases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/databases');
      if (response.data.success) {
        setAllDatabases(response.data.databases);
      }
    } catch (err) {
      console.error("Failed to fetch databases", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on initial load
  useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-24">
      <header className="bg-white border-b border-zinc-200 py-4 px-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Database className="text-indigo-600" size={28} />
            <h1 className="text-xl font-bold tracking-tight text-zinc-800">
              PostgreSQL <span className="text-indigo-600">Manager</span>
            </h1>
          </div>

          <button
            onClick={fetchDatabases}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm font-semibold transition-all active:scale-95 text-zinc-600 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Database Inventory */}
        <aside className="lg:col-span-3">
          <DatabaseList databases={allDatabases} loading={loading} />
        </aside>

        {/* Right Content: Operations & Migration */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* We pass fetchDatabases to Create so it can refresh the list after creation */}
            <CreateDatabase onSuccess={fetchDatabases} />
            <VerifyDatabase allDatabases={allDatabases} />
          </div>

          <MigrationHub allDatabases={allDatabases} />
        </div>
      </main>
    </div>
  );
}

export default App;