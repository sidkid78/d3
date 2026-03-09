// app/dashboard/images/page.tsx - AI Image Generation Interface
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Wand2, 
  Download, 
  Share2, 
  Copy, 
  Heart,
  Eye,
  Sparkles,
  Settings,
  Palette,
  Camera,
  Zap,
  Clock,
  Star,
  Loader2,
  RefreshCw,
  Grid3X3,
  Maximize2,
  X,
  ChevronDown,
  Filter
} from 'lucide-react';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  style: string;
  dimensions: string;
  timestamp: Date;
  isLiked: boolean;
  isStarred: boolean;
  downloads: number;
}

interface ImageStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'realistic' | 'artistic' | 'abstract' | 'digital';
}

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-image-preview');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedDimensions, setSelectedDimensions] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop',
      prompt: 'A futuristic cityscape with neon lights and flying cars at sunset',
      model: 'gemini-3-pro-image-preview',
      style: 'cyberpunk',
      dimensions: '1024x1024',
      timestamp: new Date(Date.now() - 3600000),
      isLiked: true,
      isStarred: false,
      downloads: 5
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=512&h=512&fit=crop',
      prompt: 'Abstract geometric patterns in purple and blue gradients',
      model: 'gemini-3.1-flash-image-preview',
      style: 'abstract',
      dimensions: '512x512',
      timestamp: new Date(Date.now() - 7200000),
      isLiked: false,
      isStarred: true,
      downloads: 12
    }
  ]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'liked' | 'starred'>('all');

  const models = [
    { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro', description: 'Highest quality, detailed images', speed: 'Slow', quality: 'Excellent' },
    { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash', description: 'Balanced quality and speed', speed: 'Medium', quality: 'Good' },
    { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Nano', description: 'Fastest generation', speed: 'Fast', quality: 'Standard' }
  ];

  const styles: ImageStyle[] = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic images', preview: '📸', category: 'realistic' },
    { id: 'artistic', name: 'Artistic', description: 'Painterly and artistic style', preview: '🎨', category: 'artistic' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic neon aesthetic', preview: '🌃', category: 'digital' },
    { id: 'abstract', name: 'Abstract', description: 'Abstract and geometric', preview: '🔮', category: 'abstract' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style', preview: '🎭', category: 'artistic' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple', preview: '⚪', category: 'abstract' }
  ];

  const dimensions = [
    '512x512', '1024x1024', '1024x768', '768x1024', '1536x1024', '1024x1536'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const [width, height] = selectedDimensions.split('x').map(Number);
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          style: selectedStyle,
          quality: selectedModel === 'gemini-3-pro-image-preview' ? 'high' : 'standard',
          width,
          height,
          numImages: 1
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }
      
      const imageUrl = result.data.images?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned');
      }
      
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: imageUrl,
        prompt,
        model: selectedModel,
        style: selectedStyle,
        dimensions: selectedDimensions,
        timestamp: new Date(),
        isLiked: false,
        isStarred: false,
        downloads: 0
      };

      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Image generation failed:', error);
    }

    setIsGenerating(false);
  };

  const toggleLike = (imageId: string) => {
    setGeneratedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isLiked: !img.isLiked } : img
    ));
  };

  const toggleStar = (imageId: string) => {
    setGeneratedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isStarred: !img.isStarred } : img
    ));
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${image.id}.png`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      setGeneratedImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, downloads: img.downloads + 1 } : img
      ));
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const filteredImages = generatedImages.filter(img => {
    switch (filterCategory) {
      case 'liked': return img.isLiked;
      case 'starred': return img.isStarred;
      default: return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center">
                <Palette className="w-10 h-10 mr-4 text-purple-400" />
                AI Image Studio
              </h1>
              <p className="text-gray-400 text-lg">
                Create stunning images with state-of-the-art AI models
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 glass rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">Gemini Powered</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Generation Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Prompt Input */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                Create Image
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    className="w-full h-24 bg-black/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Model</label>
                  <div className="space-y-2">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-full p-3 rounded-lg transition-all text-left ${
                          selectedModel === model.id
                            ? 'bg-purple-600 text-white'
                            : 'glass hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs opacity-70">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-lg transition-all text-center ${
                          selectedStyle === style.id
                            ? 'bg-purple-600 text-white'
                            : 'glass hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{style.preview}</div>
                        <div className="text-xs font-medium">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-purple-400 text-sm hover:text-purple-300 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Advanced Settings
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <label className="block text-white font-medium mb-2">Dimensions</label>
                          <select
                            value={selectedDimensions}
                            onChange={(e) => setSelectedDimensions(e.target.value)}
                            className="w-full p-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                            aria-label="Select image dimensions"
                          >
                            {dimensions.map((dim) => (
                              <option key={dim} value={dim}>{dim}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Image</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Generated</span>
                  <span className="text-white font-medium">{generatedImages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Liked</span>
                  <span className="text-red-400 font-medium">
                    {generatedImages.filter(img => img.isLiked).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Downloads</span>
                  <span className="text-green-400 font-medium">
                    {generatedImages.reduce((acc, img) => acc + img.downloads, 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gallery */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-white">Gallery</h2>
                <div className="flex items-center space-x-2">
                  {['all', 'liked', 'starred'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category as 'all' | 'liked' | 'starred')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all capitalize ${
                        filterCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                {filteredImages.length} images
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredImages.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass rounded-xl overflow-hidden group hover:bg-white/10 transition-all"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-3">
                        <motion.button
                          onClick={() => setSelectedImage(image)}
                          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Maximize2 className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => downloadImage(image)}
                          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Download image"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => copyPrompt(image.prompt)}
                          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Copy prompt"
                        >
                          <Copy className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>

                      {/* Status Indicators */}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        {image.isStarred && (
                          <div className="p-1 bg-yellow-500/20 rounded-full">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          </div>
                        )}
                        {image.isLiked && (
                          <div className="p-1 bg-red-500/20 rounded-full">
                            <Heart className="w-3 h-3 text-red-400 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <p className="text-white font-medium text-sm mb-2 line-clamp-2">
                        {image.prompt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>{image.model}</span>
                        <span>{image.dimensions}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleLike(image.id)}
                            className={`flex items-center space-x-1 ${
                              image.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                            } transition-colors`}
                            title={image.isLiked ? 'Unlike image' : 'Like image'}
                          >
                            <Heart className={`w-4 h-4 ${image.isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => toggleStar(image.id)}
                            className={`flex items-center space-x-1 ${
                              image.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                            } transition-colors`}
                            title={image.isStarred ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star className={`w-4 h-4 ${image.isStarred ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            {image.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredImages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
                <p className="text-gray-400">
                  {filterCategory === 'all' 
                    ? 'Generate your first image to get started'
                    : `No ${filterCategory} images found`
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-4xl max-h-full bg-black rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                    title="Close modal"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2">{selectedImage.prompt}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Model: {selectedImage.model}</span>
                    <span>Style: {selectedImage.style}</span>
                    <span>Size: {selectedImage.dimensions}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
