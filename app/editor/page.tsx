"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type StyleSuggestion = {
  description: string;
  css: string;
  tone: string;
};

type Collaborator = { initials: string; [key: string]: any };

export default function AdvancedEditor() {
  const { user } = useUser();
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [docData, setDocData] = useState({
    title: "",
    content: "",
    tone: "neutral",
    format: "normal",
    style: "",
  });
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeToolbar, setActiveToolbar] = useState<'text' | 'bold' | 'italic' | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [styleSuggestions, setStyleSuggestions] = useState<StyleSuggestion[]>([]);
  const [showStyleSuggestions, setShowStyleSuggestions] = useState(false);

  const formatOptions = [
    { value: "normal", label: "Normal" },
    { value: "heading1", label: "Titre 1" },
    { value: "heading2", label: "Titre 2" },
    { value: "heading3", label: "Titre 3" },
  ];

  const toneOptions = [
      { value: "happy", label: "Heureux", type: "mood" },
  { value: "sad", label: "Triste", type: "mood" },
  { value: "angry", label: "En colère", type: "mood" },
  { value: "melancholic", label: "Mélancolique", type: "mood" },
  { value: "romantic", label: "Romantique", type: "mood" },
  { value: "anxious", label: "Anxieux", type: "mood" },
  { value: "hopeful", label: "Optimiste", type: "mood" },
  { value: "nostalgic", label: "Nostalgique", type: "mood" },
  { value: "dramatic", label: "Dramatique", type: "mood" },
  { value: "mysterious", label: "Mystérieux", type: "mood" },
  { value: "grateful", label: "Reconnaissant", type: "mood" },
  { value: "sarcastic", label: "Sarcastique", type: "mood" },
  { value: "ironic", label: "Ironique", type: "mood" },
  { value: "despairing", label: "Désespéré", type: "mood" },
  { value: "playful", label: "Joueur", type: "mood" },
  { value: "whimsical", label: "Capricieux", type: "mood" }
  ];

  useEffect(() => {
    const words = docData.content.trim() ? docData.content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(docData.content.length);
  }, [docData.content]);

  const handleFormatChange = (format: string) => {
    setDocData({ ...docData, format });
  };

  const handleSave = async () => {
    if (!docData.title.trim()) {
      toast.error("Un titre est requis");
      if (titleRef.current) {
        titleRef.current.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData),
      });
      
      if (!res.ok) throw new Error("Échec de l'enregistrement");

      const data = await res.json();
      const postId = data.post.id;
      
      const shareRes = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      
      if (!shareRes.ok) throw new Error("Échec de la génération du lien");

      const shareData = await shareRes.json();
      const generatedUrl = `${window.location.origin}/shared/${shareData.id}`;
      setShareUrl(generatedUrl);
      toast.success("Document enregistré et partagé avec succès!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Lien copié!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "#" && e.ctrlKey) {
      handleFormatChange("heading1");
      e.preventDefault();
    }
  };

  const getStyleSuggestions = async () => {
    setIsAILoading(true);
    try {
      const response = await fetch("/api/ai-style-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: docData.content,
          currentTone: docData.tone,
          currentFormat: docData.format
        }),
      });

      if (!response.ok) throw new Error("Échec de la récupération des suggestions");

      const data = await response.json();
      setStyleSuggestions(data.suggestions);
      setShowStyleSuggestions(true);
      toast.success("Suggestions de style générées!");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsAILoading(false);
    }
  };

  const applyStyle = (css: string) => {
    setDocData(prev => ({ ...prev, style: css }));
    toast.success("Style appliqué!");
    setShowStyleSuggestions(false);
  };

  useEffect(() => {
    const applyToneBasedStyle = async () => {
      if (docData.tone && docData.content) {
        setIsAILoading(true);
        try {
          const response = await fetch("/api/ai-apply-tone-style", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: docData.content,
              tone: docData.tone
            }),
          });

          if (!response.ok) throw new Error("Échec de l'application du style");

          const data = await response.json();
          setDocData(prev => ({ ...prev, style: data.css }));
          toast.success(`Style ${docData.tone} appliqué automatiquement`);
        } catch (error) {
          console.error(error);
          toast.error("Erreur lors de l'application du style");
        } finally {
          setIsAILoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      applyToneBasedStyle();
    }, 2000);

    return () => clearTimeout(timer);
  }, [docData.tone, docData.content]);
useEffect(() => {
  const timer = setTimeout(() => {
    if (docData.content.length > 30) { // Se déclenche seulement après un certain nombre de caractères
      getStyleSuggestions();
    }
  }, 1000); // Délai de 1 seconde après la fin de la saisie

  return () => clearTimeout(timer);
}, [docData.content]);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-2 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="ml-2 text-xl font-medium text-gray-700">Docs</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4">
          <input
            ref={titleRef}
            className="w-full text-lg font-normal px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
            placeholder="Titre du document"
            value={docData.title}
            onChange={(e) => setDocData({...docData, title: e.target.value})}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-1">
            {collaborators.slice(0, 3).map((collab, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-600">
                {collab.initials}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            Partager
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <select
            value={docData.format}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          
          <button 
            onClick={() => setActiveToolbar('text')}
            className={`p-2 rounded hover:bg-gray-100 ${activeToolbar === 'text' ? 'bg-gray-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          
          <button 
            onClick={() => setActiveToolbar('bold')}
            className={`p-2 rounded hover:bg-gray-100 ${activeToolbar === 'bold' ? 'bg-gray-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          
          <button 
            onClick={() => setActiveToolbar('italic')}
            className={`p-2 rounded hover:bg-gray-100 ${activeToolbar === 'italic' ? 'bg-gray-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          
          <button 
            onClick={getStyleSuggestions}
            disabled={isAILoading}
            className={`p-2 rounded hover:bg-gray-100 flex items-center ${isAILoading ? 'opacity-50' : ''}`}
          >
            {isAILoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="ml-1 text-sm">Style IA</span>
              </>
            )}
          </button>
          
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          
          <select
            value={docData.tone}
            onChange={(e) => setDocData({...docData, tone: e.target.value})}
            className="text-sm border rounded px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          
          <button className="p-2 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
          
          <button className="p-2 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[80vh] focus:outline-none text-gray-800 relative placeholder"
              style={docData.style ? JSON.parse(docData.style) : {}}
              onKeyDown={handleKeyDown}
              onInput={(e) =>
                setDocData({
                  ...docData,
                  content: (e.target as HTMLDivElement).textContent || "",
                })
              }
              suppressContentEditableWarning
              data-placeholder="Commencez à taper ici..."
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div>
          {wordCount} mots • {charCount} caractères
        </div>
        <div className="flex items-center space-x-4">
          <select className="text-xs border-none bg-transparent focus:outline-none">
            <option>100%</option>
            <option>75%</option>
            <option>50%</option>
          </select>
          <button className="hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </button>
        </div>
      </footer>

      {/* Share Dialog */}
      {shareUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Partager le document</h3>
              <button 
                onClick={() => setShareUrl("")}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien de partage</label>
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  {isCopied ? "Copié!" : "Copier"}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShareUrl("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Suggestions Dialog */}
      {showStyleSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Suggestions de style par l'IA</h3>
              <button 
                onClick={() => setShowStyleSuggestions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {styleSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium mb-2">{suggestion.description}</h4>
                  <div 
                    className="mb-3 p-3 border rounded"
                    style={{ 
                      fontFamily: 'sans-serif',
                      ...JSON.parse(suggestion.css) 
                    }}
                  >
                    Aperçu du style: {docData.content.substring(0, 50) || "Votre contenu ici..."}...
                  </div>
                  <button
                    onClick={() => applyStyle(suggestion.css)}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Appliquer ce style
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowStyleSuggestions(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}