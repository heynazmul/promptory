import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2, Image as ImageIcon, User, User2 } from "lucide-react";

// n8n webhook URL (uses Vite proxy in dev to avoid CORS)
const WEBHOOK_PATH = "/api/webhook/118ec93b-9367-4c7f-af6c-2c9708d799a7";
const WEBHOOK_URL = (import.meta as any).env?.DEV
  ? WEBHOOK_PATH
  : "https://n8n-unxypryv.ap-southeast-1.clawcloudrun.com/webhook/118ec93b-9367-4c7f-af6c-2c9708d799a7";

export default function TryOn() {
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<"male" | "female" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const canGenerate = useMemo(() => !!clothingFile && !!selectedModel && !loading, [clothingFile, selectedModel, loading]);

  function filePreview(file: File | null) {
    return file ? URL.createObjectURL(file) : null;
  }

  function downloadImage() {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'try-on-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function onGenerate() {
    if (!clothingFile || !selectedModel) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    try {
      // Convert file to base64 for n8n
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(clothingFile);
      });

          const payload = {
            image: base64,
            model: selectedModel
          };

      // Debug logging
      console.log("Sending to webhook:", WEBHOOK_URL);
      console.log("Payload:", { image: `base64(${base64.length} chars)`, model: payload.model });

      const res = await fetch(WEBHOOK_URL, { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, image/*, */*',
        },
        body: JSON.stringify(payload),
        // Let proxy handle CORS in dev; prod should be CORS-enabled on server
      });
      
      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Webhook error response:", errorText);
        
        if (res.status === 500) {
          throw new Error(`n8n Workflow Error: ${errorText}. Check your n8n workflow configuration, API keys, and node settings.`);
        } else {
          throw new Error(`Request failed: ${res.status} - ${errorText}`);
        }
      }
      
      // Handle response from n8n EDIT node (binary image data)
      const contentType = res.headers.get("content-type") || "";
      console.log("Response content-type:", contentType);
      
      if (contentType.startsWith("image/")) {
        // Binary image response from EDIT node
        const blob = await res.blob();
        setResultUrl(URL.createObjectURL(blob));
        console.log("Received binary image, size:", blob.size);
      } else if (contentType.includes("application/json")) {
        // JSON response (fallback)
        const data = await res.json();
        console.log("JSON response:", data);

        // Try various common n8n shapes
        const tryGet = (obj: any, path: string[]): any => {
          return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
        };

        const candidates: Array<{ base64?: string; url?: string; mime?: string }> = [];

        // Flat keys
        if (data.image) candidates.push({ base64: data.image });
        if (data.url) candidates.push({ url: data.url });
        if (data.result) candidates.push({ base64: data.result });

        // Common nested structures
        const nestedOptions = [
          { base64: tryGet(data, ["data", "image", "data"]), mime: tryGet(data, ["data", "image", "mimeType"]) },
          { base64: tryGet(data, ["image", "data"]), mime: tryGet(data, ["image", "mimeType"]) },
          { base64: tryGet(data, ["binary", "image", "data"]), mime: tryGet(data, ["binary", "image", "mimeType"]) },
          { base64: tryGet(data, ["items", 0 as any, "binary", "image", "data"]), mime: tryGet(data, ["items", 0 as any, "binary", "image", "mimeType"]) },
          { url: tryGet(data, ["data", "url"]) },
        ];
        nestedOptions.forEach(o => candidates.push(o));

        // Pick the first valid candidate
        const found = candidates.find(c => (c.base64 && typeof c.base64 === 'string') || (c.url && typeof c.url === 'string'));
        if (found?.base64) {
          const b64 = found.base64.trim();
          const mime = found.mime || (b64.startsWith("/9j/") ? "image/jpeg" : "image/png");
          setResultUrl(`data:${mime};base64,${b64}`);
        } else if (found?.url) {
          setResultUrl(found.url);
        } else {
          const keys = Object.keys(data || {});
          setError(`Webhook responded without image data. JSON keys: ${keys.join(', ')}`);
        }
      } else {
        // Try to parse as base64 string or binary
        const text = await res.text();
        console.log("Text response length:", text.length);
        if (text && text.length > 100 && !text.startsWith('http')) {
          // Likely base64 image data
          const mime = text.startsWith("/9j/") ? "image/jpeg" : "image/png";
          setResultUrl(`data:${mime};base64,${text}`);
        } else {
          setError(`Unexpected response format. Content-Type: ${contentType}, Length: ${text.length}`);
        }
      }
    } catch (e: any) {
      console.error("Generation failed:", e);
      let errorMessage = e?.message || "Failed to generate image";
      
      if (e.name === 'TypeError' && e.message.includes('fetch')) {
        errorMessage = "Network error: Cannot connect to webhook. Check CORS settings in n8n.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Poppins'] overflow-hidden">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Model Image Generator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your product and preview it with male or female models instantly.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Section - Input */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Input</h2>
            
            {/* Clothing Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Product Image Upload</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors group">
                <input 
                  type="file" 
                  accept="image/jpeg,image/png" 
                  onChange={(e) => setClothingFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="clothing-upload"
                />
                <label htmlFor="clothing-upload" className="cursor-pointer block">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <p className="text-gray-600 mb-1 font-medium">Click to upload product image</p>
                  <p className="text-sm text-gray-500">JPG or PNG files only</p>
                </label>
              </div>
              
              {filePreview(clothingFile) && (
                <div className="mt-4 flex justify-center">
                  <div className="relative">
                    <img 
                      src={filePreview(clothingFile) as string} 
                      alt="product preview" 
                      className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm" 
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2 text-center">Upload a clear product image.</p>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Model Selection</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedModel('male')}
                  className={`rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow ${selectedModel === 'male' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                >
                  <User className={`h-6 w-6 ${selectedModel === 'male' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${selectedModel === 'male' ? 'text-blue-700' : 'text-gray-700'}`}>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel('female')}
                  className={`rounded-xl border-2 p-4 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow ${selectedModel === 'female' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-300'}`}
                >
                  <User2 className={`h-6 w-6 ${selectedModel === 'female' ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${selectedModel === 'female' ? 'text-pink-700' : 'text-gray-700'}`}>Female</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              disabled={!canGenerate} 
              onClick={onGenerate} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Product Image"
              )}
            </Button>
            
            {error && <p className="mt-3 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          </div>

          {/* Right Section - Output */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generated Result</h2>
            
            <div className="flex-1 flex items-center justify-center">
              {!resultUrl ? (
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium">Your generated image will appear here.</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="relative">
                    <img 
                      src={resultUrl} 
                      alt="generated try-on" 
                      className="w-full max-h-80 object-contain rounded-xl border-2 border-gray-100 shadow-lg" 
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Download Button */}
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={downloadImage}
                      variant="outline"
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


