import React, { useState } from 'react';
import { Role, ProcessedResult } from './types';
import { processShowData } from './services/apiService';
import JsonViewer from './components/JsonViewer';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<string>('( Phúc) 1841 Nguyễn Tư -Tuyết Trinh vũ sg stu 3h mk ( sang - đan )');
  const [ekipName, setEkipName] = useState<string>('sang');
  const [role, setRole] = useState<Role>(Role.MUA);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await processShowData(rawData, ekipName, role);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred processing the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            Wedding <span className="text-blue-600">Show</span> Processor
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Process raw scheduling data for Photographers and Makeup Artists using Gemini AI.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Input Data
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Raw Data String
                </label>
                <textarea
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-slate-700 font-mono text-sm"
                  placeholder="(Name) ID Customer - Show info (Ekip)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ekip Name to Check
                  </label>
                  <input
                    type="text"
                    value={ekipName}
                    onChange={(e) => setEkipName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    placeholder="e.g. Sang"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700 appearance-none bg-white"
                    >
                      <option value={Role.MUA}>Makeup Artist (MUA)</option>
                      <option value={Role.PHOTOGRAPHER}>Photographer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-lg text-white font-semibold shadow-md transition-all flex justify-center items-center gap-2
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-[0.98]'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Process Show'
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-6">
            
            {error && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="bg-white p-8 rounded-2xl shadow border border-slate-100 flex flex-col items-center justify-center text-center h-64 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p className="text-slate-400 font-medium">Results will appear here</p>
              </div>
            )}

            {result && (
              <div className="animate-fade-in-up">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Quick Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Assigned</p>
                      <p className={`text-lg font-bold ${result.assigned ? 'text-green-600' : 'text-slate-400'}`}>
                        {result.assigned ? 'TRUE' : 'FALSE'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Calculated Show Type</p>
                      <p className="text-lg font-bold text-blue-600">{result.data.type_of_show}</p>
                    </div>
                    <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Customer</p>
                      <p className="text-base font-medium text-slate-800">{result.data.customer_name}</p>
                    </div>
                  </div>
                </div>

                <JsonViewer data={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;