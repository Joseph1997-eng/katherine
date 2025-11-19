import React, { useState, useRef } from 'react';
import { analyzeContentSafety } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { Upload, Search, ShieldCheck, ShieldAlert, AlertOctagon, FileText, Image as ImageIcon } from 'lucide-react';

export const ContentAnalyzer: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAnalyze = async () => {
    if (!textInput && !selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let imageBase64 = undefined;
      let mimeType = undefined;

      if (selectedImage) {
        imageBase64 = await convertBlobToBase64(selectedImage);
        mimeType = selectedImage.type;
      }

      const analysis = await analyzeContentSafety(textInput, imageBase64, mimeType);
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'SAFE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'LOW_RISK': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MODERATE_RISK': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH_RISK': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'SAFE': return <ShieldCheck size={32} className="text-emerald-600" />;
      case 'LOW_RISK': return <ShieldCheck size={32} className="text-blue-600" />;
      case 'MODERATE_RISK': return <ShieldAlert size={32} className="text-amber-600" />;
      case 'HIGH_RISK': return <AlertOctagon size={32} className="text-red-600" />;
      default: return <ShieldCheck size={32} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Content Safety Scanner</h2>
        <p className="text-slate-500">
          Check text messages, posts, or screenshots for hidden risks using Gemini 2.5.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2"><FileText size={16}/> Text Content</div>
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[120px] resize-none transition-shadow"
                  placeholder="Paste text messages, lyrics, or chat logs here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                   <div className="flex items-center gap-2"><ImageIcon size={16}/> Image / Screenshot</div>
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    imagePreview ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-md shadow-sm" />
                      <p className="mt-2 text-xs text-emerald-600 font-medium">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Upload size={32} className="mb-2" />
                      <p className="text-sm">Click to upload screenshot</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!textInput && !selectedImage)}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                  isAnalyzing || (!textInput && !selectedImage)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Analyze Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
           {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">
              {error}
            </div>
           )}

           {!result && !isAnalyzing && !error && (
             <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 border-dashed p-12 text-slate-400 text-center">
               <ShieldCheck size={48} className="mb-4 opacity-20" />
               <p>Results will appear here after analysis.</p>
             </div>
           )}

           {isAnalyzing && (
             <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-xl border border-slate-100 p-12">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse">AI is reviewing content...</p>
             </div>
           )}

           {result && (
             <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-fade-in">
               <div className={`p-6 border-b flex items-center justify-between ${getRiskColor(result.riskLevel).split(' ')[0]}`}>
                 <div className="flex items-center space-x-3">
                   {getRiskIcon(result.riskLevel)}
                   <div>
                     <h3 className="text-xl font-bold capitalize text-slate-900">{result.riskLevel.replace('_', ' ')}</h3>
                     <p className="text-sm text-slate-600">Safety Score: <span className="font-mono font-bold">{result.safetyScore}/100</span></p>
                   </div>
                 </div>
               </div>
               
               <div className="p-6 space-y-6">
                 <div>
                   <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Detected Categories</h4>
                   <div className="flex flex-wrap gap-2">
                     {result.categories.length > 0 ? (
                       result.categories.map((cat, idx) => (
                         <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200">
                           {cat}
                         </span>
                       ))
                     ) : (
                       <span className="text-sm text-slate-400 italic">No specific threats detected.</span>
                     )}
                   </div>
                 </div>

                 <div>
                   <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Analysis</h4>
                   <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                     {result.reasoning}
                   </p>
                 </div>

                 <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendation</h4>
                    <div className="flex items-start gap-3 text-sm text-emerald-800 bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                      <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                      <p>{result.recommendation}</p>
                    </div>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
