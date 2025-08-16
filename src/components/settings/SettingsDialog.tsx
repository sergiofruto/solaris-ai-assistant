'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { Settings, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { AIProvider } from '@/lib/ai/types';

interface SettingsDialogProps {
  onProviderChange: (provider: AIProvider) => void;
  currentProvider: AIProvider | null;
}

export function SettingsDialog({ onProviderChange, currentProvider }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini'>('openai');
  const [selectedModel, setSelectedModel] = useState('');

  const openaiModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
  const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];

  const handleSave = () => {
    const apiKey = selectedProvider === 'openai' ? openaiKey : geminiKey;
    const model = selectedModel || (selectedProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
    
    if (!apiKey.trim()) {
      alert('Please enter an API key');
      return;
    }

    const provider: AIProvider = {
      name: selectedProvider,
      apiKey: apiKey.trim(),
      model
    };

    onProviderChange(provider);
    setOpen(false);
  };

  const handleProviderSelect = (provider: 'openai' | 'gemini') => {
    setSelectedProvider(provider);
    setSelectedModel('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Settings className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="w-5 h-5" />
            Solaris Settings
          </DialogTitle>
        </div>
        
        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              AI Provider
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleProviderSelect('openai')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedProvider === 'openai'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                OpenAI
              </button>
              <button
                onClick={() => handleProviderSelect('gemini')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedProvider === 'gemini'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                Gemini
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a model</option>
              {(selectedProvider === 'openai' ? openaiModels : geminiModels).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKeys ? 'text' : 'password'}
                value={selectedProvider === 'openai' ? openaiKey : geminiKey}
                onChange={(e) => {
                  if (selectedProvider === 'openai') {
                    setOpenaiKey(e.target.value);
                  } else {
                    setGeminiKey(e.target.value);
                  }
                }}
                placeholder={`Enter your ${selectedProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowKeys(!showKeys)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Current Provider Status */}
          {currentProvider && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Using {currentProvider.name} ({currentProvider.model})
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
