import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleUpload = async () => {
  //   if (!file) return;

  //   setLoading(true);
  //   setError(null);
  //   setResultUrl(null);

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('http://localhost:8000/upload/', formData);
  //     console.log('Response:', response.data);
  //     setResultUrl(response.data.result_url); // this must be a string

  //     setResultUrl(response.data.result_url);
  //   } catch (err) {
  //     setError('Failed to upload or process image.');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleUpload = async () => {
  //   if (!file) return;

  //   setLoading(true);
  //   setError(null);
  //   setResultUrl(null);

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('http://localhost:8000/upload/', formData);
  //     console.log('✅ Backend response:', response.data);
  //     setResultUrl(response.data.result_url);
  //   } catch (err: any) {
  //     console.error('❌ Upload error:', err);
  //     setError('Failed to upload or process image.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpload = async () => {
    if (!file) return;
  
    setLoading(true);
    setError(null);
    setResultUrl(null);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          // ❌ DON'T set 'Content-Type': let Axios handle it for FormData!
          // 'Content-Type': 'multipart/form-data', // <-- REMOVE THIS
        }
      });
  
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload & Modify'}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {resultUrl && (
          <div className="mt-4 space-y-2">
            <p className="font-semibold">Modified Image:</p>
            <img src={resultUrl} alt="Modified" className="rounded-lg mt-2 max-w-full" />

            <a
              href={resultUrl}
              download  // ✅ Forces download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
