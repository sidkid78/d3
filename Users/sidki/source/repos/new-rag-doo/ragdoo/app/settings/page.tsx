// app/settings/page.tsx - Futuristic Settings Page
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  Brain, 
  Zap,
  Bell,
  Palette,
  Key,
  Globe,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  LucideIcon
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  status: string;
  cost: string;
  description: string;
  capabilities: string[];
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [apiKey, setApiKey] = useState('sk-1234567890abcdef1234567890abcdef');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [databaseConnected, setDatabaseConnected] = useState(true);
  const [globalSync, setGlobalSync] = useState(false);
  const [displayMode, setDisplayMode] = useState('auto');
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sections = [
    { id: 'general', title: 'General', icon: Settings },
    { id: 'account', title: 'Account', icon: User },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'database', title: 'Database', icon: Database },
    { id: 'ai', title: 'AI Models', icon: Brain },
    { id: 'performance', title: 'Performance', icon: Zap },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'appearance', title: 'Appearance', icon: Palette },
    { id: 'api', title: 'API Keys', icon: Key },
  ];

  const models: Model[] = [
    { 
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro', 
      provider: 'Google', 
      status: 'available', 
      cost: '$0.00125/1K tokens',
      description: 'Highest capability for complex reasoning and ultra-long context',
      capabilities: ['Text', 'Code', 'Analysis', 'Long Context']
    },
    { 
      id: 'gemini-3-flash-preview',
      name: 'Gemini 3 Flash', 
      provider: 'Google', 
      status: 'active', 
      cost: '$0.0001/1K tokens',
      description: 'Optimized for speed and efficiency without compromising quality',
      capabilities: ['Text', 'Multimodal', 'Fast Response', 'Tool Use']
    },
    { 
      id: 'gemini-3.1-flash-lite-preview',
      name: 'Gemini 3.1 Flash-Lite', 
      provider: 'Google', 
      status: 'available', 
      cost: '$0.000075/1K tokens',
      description: 'Ultra-fast, cost-effective model for high-volume tasks',
      capabilities: ['Text', 'Fast Response', 'Efficiency']
    },
    { 
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo', 
      provider: 'OpenAI', 
      status: 'available', 
      cost: '$0.01/1K tokens',
      description: 'Most capable model for complex reasoning',
      capabilities: ['Text', 'Code', 'Analysis', 'Creative Writing']
    }
  ];

  const handleSaveSettings = () => {
    setUnsavedChanges(false);
    // Simulate save operation
    console.log('Settings saved');
  };

  const handleDiscardChanges = () => {
    setUnsavedChanges(false);
    // Reset to previous values
    console.log('Changes discarded');
  };

  const handleDeleteData = (dataType: string) => {
    console.log(`Deleting ${dataType} data`);
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label, 
    description 
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all">
      <div className="flex-1">
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-gray-400 text-sm">{description}</div>}
      </div>
      <motion.button
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-purple-600' : 'bg-gray-600'
        }`}
        onClick={() => {
          onChange(!enabled);
          setUnsavedChanges(true);
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: enabled ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  const ActionButton = ({ 
    icon: Icon, 
    label, 
    description, 
    variant = 'default',
    onClick 
  }: {
    icon: LucideIcon;
    label: string;
    description?: string;
    variant?: 'default' | 'danger' | 'success';
    onClick?: () => void;
  }) => (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
        variant === 'danger' 
          ? 'glass hover:bg-red-500/10 border border-red-500/20' 
          : variant === 'success'
          ? 'glass hover:bg-green-500/10 border border-green-500/20'
          : 'glass hover:bg-white/5'
      }`}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${
          variant === 'danger' 
            ? 'bg-red-500/20 text-red-400' 
            : variant === 'success'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-purple-500/20 text-purple-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-white font-medium">{label}</div>
          {description && <div className="text-gray-400 text-sm">{description}</div>}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </motion.button>
  );

  const ModelCard = ({ model }: { model: Model }) => (
    <motion.div
      className={`glass rounded-xl p-6 transition-all cursor-pointer ${
        selectedModel === model.id ? 'ring-2 ring-purple-500 bg-purple-500/10' : 'hover:bg-white/5'
      }`}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => setSelectedModel(model.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{model.name}</h4>
          <p className="text-purple-400 text-sm">{model.provider}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedModel === model.id && (
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            model.status === 'active' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {model.status}
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-4">{model.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {model.capabilities.map((capability: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
            {capability}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white font-mono text-sm">{model.cost}</span>
        <span className="text-gray-400 text-xs">per 1K tokens</span>
      </div>
    </motion.div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">General Settings</h3>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={autoSave}
                  onChange={setAutoSave}
                  label="Auto-save documents"
                  description="Automatically save uploaded documents to your library"
                />
                <ToggleSwitch
                  enabled={notifications}
                  onChange={setNotifications}
                  label="Enable notifications"
                  description="Receive updates about query results and system status"
                />
                <ToggleSwitch
                  enabled={sounds}
                  onChange={setSounds}
                  label="Sound effects"
                  description="Play sounds for actions and notifications"
                />
                <ToggleSwitch
                  enabled={globalSync}
                  onChange={setGlobalSync}
                  label="Global synchronization"
                  description="Sync settings and data across all devices"
                />
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                Audio Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Master Volume</span>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 glass rounded-lg hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                    </motion.button>
                    <span className="text-white font-mono text-sm w-8">{isMuted ? 0 : volume}%</span>
                  </div>
                </div>
                <input
                  aria-label="Master Volume"
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value));
                    setIsMuted(false);
                    setUnsavedChanges(true);
                  }}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isMuted}
                />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Actions</h4>
              <div className="space-y-3">
                <ActionButton
                  icon={Download}
                  label="Export Data"
                  description="Download all your documents and query history"
                  variant="default"
                />
                <ActionButton
                  icon={Upload}
                  label="Import Configuration"
                  description="Restore settings from a backup file"
                  variant="default"
                />
                <ActionButton
                  icon={RefreshCw}
                  label="Reset to Defaults"
                  description="Restore all settings to their default values"
                  variant="danger"
                />
                <ActionButton
                  icon={ExternalLink}
                  label="Open Documentation"
                  description="View the complete user guide and API documentation"
                  variant="default"
                  onClick={() => window.open('https://docs.ragdoo.com', '_blank')}
                />
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Database Management</h3>
              <p className="text-gray-400 mb-6">
                Manage your document database and vector storage settings.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Connection Status
                </h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${databaseConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm ${databaseConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {databaseConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <div className="text-gray-400 text-sm">Documents</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">45.2 GB</div>
                  <div className="text-gray-400 text-sm">Storage Used</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">98.5%</div>
                  <div className="text-gray-400 text-sm">Index Health</div>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 p-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Optimize Database
                </motion.button>
                <motion.button
                  className="flex-1 p-3 glass text-white rounded-lg font-medium hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Backup Now
                </motion.button>
              </div>
            </div>

            <div className="space-y-4">
              <ActionButton
                icon={Info}
                label="Database Information"
                description="View detailed database statistics and performance metrics"
                variant="default"
              />
              <ActionButton
                icon={Trash2}
                label="Clear Cache"
                description="Remove temporary files and cached data"
                variant="danger"
                onClick={() => handleDeleteData('cache')}
              />
              <ActionButton
                icon={Trash2}
                label="Delete All Documents"
                description="Permanently remove all uploaded documents"
                variant="danger"
                onClick={() => handleDeleteData('documents')}
              />
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Model Configuration</h3>
              <p className="text-gray-400 mb-6">
                Choose the AI model that best fits your needs. Different models excel at different tasks.
              </p>
            </div>

            <div className="grid gap-6">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Model Parameters</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temperature: 0.7
                  </label>
                  <input
                    aria-label="Temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Tokens: 4000
                  </label>
                  <input
                    aria-label="Max Tokens"
                    type="range"
                    min="100"
                    max="8000"
                    step="100"
                    defaultValue="4000"
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">API Keys</h3>
              <p className="text-gray-400 mb-6">
                Manage your API keys for different AI providers and services.
              </p>
            </div>

            <div className="space-y-6">
              {['OpenAI', 'Anthropic', 'Google'].map((provider) => (
                <div key={provider} className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{provider}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setUnsavedChanges(true);
                        }}
                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter API key..."
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <motion.button
                      className="p-3 glass rounded-lg hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveSettings}
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-lg font-semibold text-white">Security Notice</h4>
              </div>
              <p className="text-gray-300 text-sm">
                API keys are encrypted and stored securely. Never share your keys with others. 
                If you suspect a key has been compromised, revoke it immediately and generate a new one.
              </p>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Appearance Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isDarkMode ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'
                    }`}
                    onClick={() => {
                      setIsDarkMode(true);
                      setUnsavedChanges(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <Moon className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">Dark</div>
                        <div className="text-gray-400 text-sm">Easy on the eyes</div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      !isDarkMode ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'
                    }`}
                    onClick={() => {
                      setIsDarkMode(false);
                      setUnsavedChanges(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <Sun className="w-6 h-6 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">Light</div>
                        <div className="text-gray-400 text-sm">Classic interface</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  Display Settings
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Mode
                    </label>
                    <select
                      aria-label="Select display mode"
                      value={displayMode}
                      onChange={(e) => {
                        setDisplayMode(e.target.value);
                        setUnsavedChanges(true);
                      }}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="auto">Auto (System)</option>
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Globalization
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      aria-label="Select language"
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={() => setUnsavedChanges(true)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time Zone
                    </label>
                    <select
                      aria-label="Select time zone"
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={() => setUnsavedChanges(true)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Color Accent</h4>
                <div className="flex gap-3">
                  {[
                    { name: 'Purple', color: 'bg-purple-500' },
                    { name: 'Blue', color: 'bg-blue-500' },
                    { name: 'Green', color: 'bg-green-500' },
                    { name: 'Orange', color: 'bg-orange-500' },
                    { name: 'Pink', color: 'bg-pink-500' },
                    { name: 'Cyan', color: 'bg-cyan-500' },
                  ].map((accent) => (
                    <motion.button
                      key={accent.name}
                      className={`w-8 h-8 rounded-full ${accent.color} ring-2 ring-purple-500 ring-offset-2 ring-offset-black`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setUnsavedChanges(true)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Unsaved Changes Banner */}
      <AnimatePresence>
        {unsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-0 right-0 z-50 bg-yellow-600/90 backdrop-blur-sm border-b border-yellow-500/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-yellow-200" />
                  <span className="text-yellow-100 font-medium">You have unsaved changes</span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-700 text-yellow-100 rounded-lg font-medium hover:bg-yellow-800 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={handleDiscardChanges}
                    className="p-2 text-yellow-200 hover:text-yellow-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full glass mb-6">
              <Settings className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-400">
                System Configuration
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Customize your RAGDoo experience with advanced configuration options
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <section.icon className="w-5 h-5 mr-3" />
                    {section.title}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
