import React from 'react';
import { Layers, HardDrive } from 'lucide-react';

const DatabaseList = ({ databases, loading }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-50 pb-4">
        <Layers size={18} className="text-indigo-500" />
        <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-widest">Inventory</h2>
      </div>

      {loading && databases.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-zinc-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {databases.map((db) => (
            <div 
              key={db}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-lg group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-default"
            >
              <HardDrive size={14} className="text-zinc-400 group-hover:text-indigo-400" />
              <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 truncate">
                {db}
              </span>
            </div>
          ))}
          {databases.length === 0 && !loading && (
            <p className="text-xs text-zinc-400 text-center py-4 italic">No databases found.</p>
          )}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-zinc-50 text-[10px] text-zinc-400 font-medium">
        TOTAL COUNT: {databases.length}
      </div>
    </div>
  );
};

export default DatabaseList;