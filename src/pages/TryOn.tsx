import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Loader2, Image as ImageIcon, User } from "lucide-react";

// Your n8n webhook URL - UPDATE THIS WITH YOUR ACTUAL WEBHOOK URL
const WEBHOOK_URL = "https://n8n-unxypryv.ap-southeast-1.clawcloudrun.com/webhook/generate-model-image";


export default function TryOn() {
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<"male" | "female" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState<string | null>(null);

  const canGenerate = useMemo(() => !!clothingFile && !!selectedModel && !loading, [clothingFile, selectedModel, loading]);

  function filePreview(file: File | null) {
    return file ? URL.createObjectURL(file) : null;
  }

  function downloadImage() {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = resultFilename || `try-on-${selectedModel}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function onGenerate() {
    if (!clothingFile || !selectedModel) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    setResultFilename(null);

    try {
      // Create FormData with field names matching n8n webhook
      const form = new FormData();
      form.append('image', clothingFile, clothingFile.name);
      form.append('model', selectedModel);

      console.log("🚀 Sending to n8n webhook:", WEBHOOK_URL);
      console.log("📦 Model selected:", selectedModel);
      console.log("🖼️ Image file:", clothingFile.name, `(${(clothingFile.size / 1024).toFixed(2)} KB)`);

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: form,
        headers: {
          // Let the server know we can handle either an image blob or JSON metadata
          Accept: 'image/*,application/json;q=0.9,*/*;q=0.8',
        },
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      console.log("✅ Response status:", res.status);
      const contentType = res.headers.get("content-type") || "";
      const contentDisposition = res.headers.get("content-disposition") || "";
      const filenameMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
      if (filenameMatch && filenameMatch[1]) {
        setResultFilename(filenameMatch[1]);
      }
      console.log("📄 Content-Type:", contentType);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Webhook error:", errorText);
        throw new Error(`Workflow failed (${res.status}): ${errorText.substring(0, 200)}`);
      }

      // Handle possible response types from the webhook
      const contentLengthHeader = res.headers.get("content-length");
      const contentLength = contentLengthHeader ? Number(contentLengthHeader) : undefined;

      if (contentType.startsWith("image/")) {
        const blob = await res.blob();
        console.log("🎨 Received image blob:", blob.size, "bytes");
        if (blob.size === 0) throw new Error("Webhook returned an image with 0 bytes");
        setResultUrl(URL.createObjectURL(blob));
      } else if (contentType.includes("application/json")) {
        // Read once as text to avoid double-reading the response stream
        const rawText = await res.text();
        let json: any;
        try {
          json = rawText ? JSON.parse(rawText) : {};
        } catch (parseErr) {
          throw new Error(`Unexpected non-JSON body: ${rawText.substring(0, 200)}`);
        }
        console.log("📦 JSON response:", json);

        // Try common fields that may contain the image
        const possibleUrl: string | undefined = json?.imageUrl || json?.url || json?.image || json?.outputUrl;
        const possibleBase64: string | undefined = json?.base64 || json?.imageBase64 || json?.data;

        if (possibleUrl && typeof possibleUrl === 'string') {
          setResultUrl(possibleUrl);
        } else if (possibleBase64 && typeof possibleBase64 === 'string') {
          // Strip data URL prefix if present
          const base64 = possibleBase64.includes(',') ? possibleBase64.split(',')[1] : possibleBase64;
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes], { type: 'image/png' });
          setResultUrl(URL.createObjectURL(blob));
        } else {
          throw new Error("JSON response did not include an image URL or base64 data");
        }
      } else {
        // Unknown content type: try blob first
        const blob = await res.blob();
        if (blob.size > 0 && (contentType.startsWith("application/octet-stream") || !contentType)) {
          console.log("🎨 Treating octet-stream/unknown as image blob:", blob.size, "bytes");
          setResultUrl(URL.createObjectURL(blob));
        } else if (blob.size > 0) {
          // Not an image, show a snippet as error for diagnostics
          const text = await blob.text();
          throw new Error(`Unexpected content-type ${contentType}. Body: ${text.substring(0, 200)}`);
        } else {
          // Truly empty
          const lenInfo = contentLength !== undefined ? `content-length=${contentLength}` : 'no content-length header';
          throw new Error(`Empty response from webhook (${lenInfo}). Ensure your n8n node returns data.`);
        }
      }

      console.log("✨ Generation completed successfully!");
    } catch (e: any) {
      console.error("💥 Generation failed:", e);
      let errorMessage = e?.message || "Failed to generate image";

      if (e.name === 'TypeError' && e.message.includes('fetch')) {
        errorMessage = "Network error: Cannot connect to n8n webhook. Check CORS and URL.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Poppins']">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">AI Model Image Generator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your product and preview it with male or female models instantly.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Input */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Input</h2>

            {/* Clothing Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
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
                      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2 text-center">Upload a clear product image for best results.</p>
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
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Image...
                </>
              ) : (
                "Generate Product Image"
              )}
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">❌ Error</p>
                <p className="text-red-500 text-xs mt-1">{error}</p>
              </div>
            )}
          </div>

          {/* Right Section - Output */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generated Result</h2>

            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              {!resultUrl ? (
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                    {loading ? (
                      <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                    ) : (
                      <ImageIcon className="h-16 w-16 text-gray-300" />
                    )}
                  </div>
                  <p className="text-lg font-medium">
                    {loading ? "Generating your image..." : "Your generated image will appear here"}
                  </p>
                  {loading && (
                    <p className="text-sm text-gray-400 mt-2">This may take 10-30 seconds</p>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <div className="relative">
                    <img
                      src={resultUrl}
                      alt="generated result"
                      className="w-full max-h-[500px] object-contain rounded-xl border-2 border-gray-100 shadow-lg"
                    />
                  </div>

                  {/* Download Button */}
                  <div className="mt-6 flex gap-3 justify-center">
                    <Button
                      onClick={downloadImage}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </Button>
                    <Button
                      onClick={() => setResultUrl(null)}
                      variant="outline"
                      className="inline-flex items-center gap-2 px-6 py-2"
                    >
                      Generate New
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