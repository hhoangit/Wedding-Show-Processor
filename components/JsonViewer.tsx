import React from 'react';

interface JsonViewerProps {
  data: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400">JSON Output</span>
        <button 
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default JsonViewer;