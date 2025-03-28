import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expression, setExpression] = useState('happy');

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResultUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expression', expression); // ✅ add this
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload/`,
        formData
      );
      console.log('✅ Backend response:', response.data);
      setResultUrl(response.data.result_url);
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      setError('Failed to upload or process image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">EraseID Face Modifier</h1>

        {!file ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
            }}
            className="w-full border p-2 rounded"
          />
        ) : (
          <div className="flex items-center justify-between w-full border p-2 rounded bg-gray-50">
            <span className="text-gray-800 font-medium truncate">{file.name}</span>
            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setResultUrl(null);
                setError(null);
              }}
              className="text-blue-600 text-sm underline hover:text-blue-800 ml-2"
            >
              Change
            </button>
          </div>
        )}
        <div className="text-left w-full">
          <label htmlFor="expression" className="block text-sm font-medium mb-1">
            Choose expression:
          </label>
          <select
            id="expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          >
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="surprised">Surprised</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload & Modify'}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {previewUrl && resultUrl && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-2">Original Image:</p>
              <img src={previewUrl} alt="Original" className="rounded-lg max-w-full" />
            </div>

            <div>
              <p className="font-semibold mb-2">Modified Image:</p>
              <img src={resultUrl} alt="Modified" className="rounded-lg max-w-full" />

              <a
                href={resultUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
