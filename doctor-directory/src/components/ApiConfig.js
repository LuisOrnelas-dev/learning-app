import React, { useState } from 'react';

export default function ApiConfig({ onApiKeySet }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey || apiKey.length < 20) {
      setError('Please enter a valid OpenAI API key.');
      return;
    }
    localStorage.setItem('openai_api_key', apiKey);
    setError('');
    if (onApiKeySet) onApiKeySet(apiKey);
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    if (onApiKeySet) onApiKeySet('');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h2 className="text-xl font-bold mb-2">Configure OpenAI API Key</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Enter your OpenAI API key below. You can get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI dashboard</a>.
      </p>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="sk-..."
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        autoFocus
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Save
        </button>
        <button type="button" onClick={handleClear} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">
          Clear
        </button>
      </div>
    </form>
  );
} 