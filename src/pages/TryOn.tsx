import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2, Image as ImageIcon, User } from "lucide-react";

// Direct n8n webhook URL
const WEBHOOK_URL = "https://n8n-unxypryv.ap-southeast-1.clawcloudrun.com/webhook/118ec93b-9367-4c7f-af6c-2c9708d799a7";

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
            body: {
              image: base64,
              model: selectedModel
            }
          };

      // Debug logging
      console.log("Sending to webhook:", WEBHOOK_URL);
      console.log("Payload:", { body: { image: `base64(${base64.length} chars)`, model: payload.body.model } });

      const res = await fetch(WEBHOOK_URL, { 
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, image/*, */*',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
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
        if (data.image) {
          const mime = data.image.startsWith("/9j/") ? "image/jpeg" : "image/png";
          setResultUrl(`data:${mime};base64,${data.image}`);
        } else if (data.url) {
          setResultUrl(data.url);
        } else {
          setError("Webhook responded without image data.");
        }
      } else {
        // Fallback: treat body as raw binary even if Content-Type is missing
        try {
          const buffer = await res.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          console.log("Fallback binary length:", bytes.byteLength);
          if (bytes.byteLength > 0) {
            // Detect JPEG/PNG via magic numbers
            const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
            const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
            const guessedType = isJpeg ? "image/jpeg" : (isPng ? "image/png" : "application/octet-stream");
            const blob = new Blob([bytes], { type: guessedType });
            setResultUrl(URL.createObjectURL(blob));
          } else {
            // Try last resort: as text/base64
            const text = await res.text();
            if (text && text.length > 100 && !text.startsWith('http')) {
              const mime = text.startsWith("/9j/") ? "image/jpeg" : "image/png";
              setResultUrl(`data:${mime};base64,${text}`);
            } else {
              setError(`Unexpected response format. Content-Type: ${contentType || 'none'}`);
            }
          }
        } catch (fallbackErr) {
          console.error("Fallback parse error:", fallbackErr);
          setError("Unable to parse webhook response as image.");
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
              <label className="block text-sm font-medium text-gray-700 mb-3">Clothing Product Image</label>
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
                  <p className="text-gray-600 mb-1 font-medium">Click to upload clothing image</p>
                  <p className="text-sm text-gray-500">JPG or PNG files only</p>
                </label>
              </div>
              
              {filePreview(clothingFile) && (
                <div className="mt-4 flex justify-center">
                  <div className="relative">
                    <img 
                      src={filePreview(clothingFile) as string} 
                      alt="clothing preview" 
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
                {(["male", "female"] as const).map((option) => {
                  const isSelected = selectedModel === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedModel(option)}
                      className={`relative rounded-2xl border-2 p-5 text-left transition-all shadow-sm hover:shadow-md focus:outline-none ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                          <User className={`${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <div className="text-lg font-semibold capitalize text-gray-800">{option}</div>
                          <div className="text-sm text-gray-500">Use {option} model</div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">Selected</span>
                      )}
                    </button>
                  );
                })}
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
                  <p className="text-lg font-medium">Your generated try-on image will appear here.</p>
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


