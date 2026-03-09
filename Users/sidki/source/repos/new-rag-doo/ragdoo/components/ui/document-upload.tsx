'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Code, 
  X, 
  Check, 
  Loader2,
  AlertCircle,
  Plus
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
}

export function DocumentUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('text') || type.includes('pdf')) return FileText;
    if (type.includes('code') || type.includes('javascript') || type.includes('typescript')) return Code;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (fileList: File[]) => {
    setIsUploading(true);
    
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    for (const file of newFiles) {
      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        }

        // Mark as success
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        console.error('File upload failed:', error);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        ));
      }
    }

    setIsUploading(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
          ${isDragOver 
            ? 'border-purple-400 bg-purple-500/10 scale-105' 
            : 'border-gray-600 hover:border-purple-500/50 hover:bg-purple-500/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.py,.js,.ts,.tsx,.jsx"
          title="Upload files"
          aria-label="Upload files"
        />
        
        <div className="text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center"
            animate={{ 
              scale: isDragOver ? 1.1 : 1,
              rotate: isDragOver ? 5 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-purple-400' : 'text-gray-400'}`} />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? 'Drop your files here' : 'Upload your documents'}
          </h3>
          
          <p className="text-gray-400 mb-4">
            Drag and drop files or <span className="text-purple-400 font-medium">browse</span> to upload
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-800 rounded">PDF</span>
            <span className="px-2 py-1 bg-gray-800 rounded">DOC</span>
            <span className="px-2 py-1 bg-gray-800 rounded">TXT</span>
            <span className="px-2 py-1 bg-gray-800 rounded">MD</span>
            <span className="px-2 py-1 bg-gray-800 rounded">CODE</span>
          </div>
        </div>

        {/* Upload Progress Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                <p className="text-white font-medium">Processing files...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-white flex items-center">
              <File className="w-5 h-5 mr-2 text-purple-400" />
              Uploaded Files ({files.length})
            </h4>
            
            <div className="space-y-2">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center p-4 glass rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                      <FileIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                      
                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      {file.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      )}
                      {file.status === 'success' && (
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-400 mr-2" />
                          <button
                            onClick={() => removeFile(file.id)}
                            className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                          <button
                            onClick={() => removeFile(file.id)}
                            className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-sm hover:scale-105 transition-transform">
            Process All
          </button>
          <button className="px-4 py-2 glass rounded-lg font-medium text-sm hover:bg-white/10 transition-all">
            Clear All
          </button>
          <button className="px-4 py-2 glass rounded-lg font-medium text-sm hover:bg-white/10 transition-all">
            <Plus className="w-4 h-4 mr-1 inline" />
            Add More
          </button>
        </motion.div>
      )}
    </div>
  );
}
