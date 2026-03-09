// app/dashboard/form-fill/page.tsx - AI Form Filling & Data Completion Interface
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Brain, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  Plus,
  Trash2,
  X
} from 'lucide-react';

interface MissingCell {
  row: number;
  column: number;
  question: string;
  context: string;
  suggestion?: string;
  confidence?: number;
}

interface TableData {
  headers: string[];
  rows: (string | null)[][];
  missingCells: MissingCell[];
  completionRate: number;
  totalCells: number;
  missingCount: number;
}

interface CompletionStats {
  totalRows: number;
  completedRows: number;
  missingFields: number;
  completionRate: number;
}

interface CompletionTarget {
  id: string;
  name: string;
  targetRate: number;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
}

export default function FormFillPage() {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCell, setSelectedCell] = useState<MissingCell | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'missing' | 'completed'>('all');
  const [showTargets, setShowTargets] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRowActions, setShowRowActions] = useState<number | null>(null);
  const [completionTargets, setCompletionTargets] = useState<CompletionTarget[]>([
    { id: '1', name: 'Basic Completion', targetRate: 0.8, priority: 'medium', deadline: '2024-01-15' },
    { id: '2', name: 'Full Dataset', targetRate: 1.0, priority: 'high', deadline: '2024-01-30' }
  ]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/form-fill', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setTableData(result);
    } catch (error) {
      console.error('Error processing file:', error);
    }

    setIsProcessing(false);
  };

  const handleCellUpdate = (row: number, col: number, value: string) => {
    if (!tableData) return;

    const newRows = [...tableData.rows];
    newRows[row][col] = value;

    // Remove from missing cells
    const newMissingCells = tableData.missingCells.filter(
      cell => !(cell.row === row && cell.column === col)
    );

    // Recalculate completion rate
    const totalCells = tableData.headers.length * tableData.rows.length;
    const filledCells = newRows.flat().filter(cell => cell !== null && cell !== '').length;
    const completionRate = filledCells / totalCells;

    setTableData({
      ...tableData,
      rows: newRows,
      missingCells: newMissingCells,
      completionRate,
      missingCount: newMissingCells.length
    });

    // Clear selected cell if it was the one being updated
    if (selectedCell && selectedCell.row === row && selectedCell.column === col) {
      setSelectedCell(null);
    }
  };

  const applySuggestion = (missingCell: MissingCell) => {
    if (missingCell.suggestion) {
      handleCellUpdate(missingCell.row, missingCell.column, missingCell.suggestion);
    }
  };

  const handleCellClick = (missingCell: MissingCell) => {
    setSelectedCell(selectedCell?.row === missingCell.row && selectedCell?.column === missingCell.column ? null : missingCell);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setTableData(null);
    setSelectedCell(null);
    setSelectedRows(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addCompletionTarget = () => {
    const newTarget: CompletionTarget = {
      id: Date.now().toString(),
      name: `Target ${completionTargets.length + 1}`,
      targetRate: 0.9,
      priority: 'medium'
    };
    setCompletionTargets([...completionTargets, newTarget]);
  };

  const removeCompletionTarget = (targetId: string) => {
    setCompletionTargets(completionTargets.filter(target => target.id !== targetId));
  };

  const addNewRow = () => {
    if (!tableData) return;
    
    const newRow = new Array(tableData.headers.length).fill('');
    const newRows = [...tableData.rows, newRow];
    
    setTableData({
      ...tableData,
      rows: newRows
    });
  };

  const deleteSelectedRows = () => {
    if (!tableData || selectedRows.size === 0) return;
    
    const rowsToKeep = tableData.rows.filter((_, index) => !selectedRows.has(index));
    const newMissingCells = tableData.missingCells.filter(cell => !selectedRows.has(cell.row));
    
    setTableData({
      ...tableData,
      rows: rowsToKeep,
      missingCells: newMissingCells
    });
    
    setSelectedRows(new Set());
    setSelectedCell(null);
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowIndex)) {
      newSelection.delete(rowIndex);
    } else {
      newSelection.add(rowIndex);
    }
    setSelectedRows(newSelection);
  };

  const exportData = () => {
    if (!tableData) return;
    
    // Convert to CSV and download
    const csvContent = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.map(cell => cell || '').join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `completed_${selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'data'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 0.9) return 'text-green-400 bg-green-500/20';
    if (rate >= 0.7) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getTargetStatus = (target: CompletionTarget, currentRate: number) => {
    if (currentRate >= target.targetRate) return 'achieved';
    if (currentRate >= target.targetRate * 0.8) return 'close';
    return 'behind';
  };

  const stats: CompletionStats = tableData ? {
    totalRows: tableData.rows.length,
    completedRows: tableData.rows.filter(row => 
      row.every(cell => cell !== null && cell !== '')
    ).length,
    missingFields: tableData.missingCount,
    completionRate: tableData.completionRate
  } : { totalRows: 0, completedRows: 0, missingFields: 0, completionRate: 0 };

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
                <Table className="w-10 h-10 mr-4 text-purple-400" />
                Smart Form Filler
              </h1>
              <p className="text-gray-400 text-lg">
                AI-powered data completion and form filling assistant
              </p>
              {selectedFile && (
                <div className="flex items-center mt-2 text-sm text-gray-300">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  <span>Current file: {selectedFile.name}</span>
                  <button
                    onClick={clearSelectedFile}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Clear file and start over"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {tableData && (
                <>
                  <motion.button
                    onClick={() => setShowTargets(!showTargets)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg font-semibold text-white flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Target className="w-5 h-5" />
                    <span>Targets</span>
                  </motion.button>
                  <motion.button
                    onClick={exportData}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold text-white flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Export CSV</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {!tableData ? (
          /* Upload Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <FileSpreadsheet className="w-12 h-12 text-purple-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Upload Your Data</h2>
              <p className="text-gray-400 mb-8">
                Upload a CSV or Excel file and let AI identify and fill missing data points
              </p>

              <input
                title="Upload your data"
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />

              <motion.button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
                  </>
                )}
              </motion.button>

              <div className="mt-6 text-sm text-gray-500">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </div>
            </div>
          </motion.div>
        ) : (
          /* Data Analysis Interface */
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Rows</p>
                    <p className="text-2xl font-bold text-white">{stats.totalRows}</p>
                  </div>
                  <Table className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed Rows</p>
                    <p className="text-2xl font-bold text-white">{stats.completedRows}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Missing Fields</p>
                    <p className="text-2xl font-bold text-white">{stats.missingFields}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completion Rate</p>
                    <p className={`text-2xl font-bold ${getCompletionColor(stats.completionRate).split(' ')[0]}`}>
                      {Math.round(stats.completionRate * 100)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>
            </div>

            {/* Selected Cell Details */}
            <AnimatePresence>
              {selectedCell && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      Cell Details - Row {selectedCell.row + 1}, {tableData.headers[selectedCell.column]}
                    </h3>
                    <button
                      title="Close cell details"
                      onClick={() => setSelectedCell(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Context:</p>
                        <p className="text-white">{selectedCell.context}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Question:</p>
                        <p className="text-purple-400">{selectedCell.question}</p>
                      </div>
                      {selectedCell.suggestion && (
                        <div>
                          <p className="text-gray-400 text-sm">AI Suggestion:</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-green-400">{selectedCell.suggestion}</span>
                            <div className="flex items-center space-x-2">
                              {selectedCell.confidence && (
                                <span className={`px-2 py-1 rounded text-xs ${getCompletionColor(selectedCell.confidence)}`}>
                                  {Math.round(selectedCell.confidence * 100)}% confidence
                                </span>
                              )}
                              <button
                                onClick={() => applySuggestion(selectedCell)}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all"
                              >
                                Apply Suggestion
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completion Targets Panel */}
            <AnimatePresence>
              {showTargets && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-400" />
                      Completion Targets
                    </h3>
                    <button
                      onClick={addCompletionTarget}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Target</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completionTargets.map((target) => {
                      const status = getTargetStatus(target, stats.completionRate);
                      return (
                        <div key={target.id} className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{target.name}</h4>
                            <button
                              title="Remove target"
                              onClick={() => removeCompletionTarget(target.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Target:</span>
                              <span className="text-white">{Math.round(target.targetRate * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Current:</span>
                              <span className="text-white">{Math.round(stats.completionRate * 100)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Status:</span>
                              <span className={`capitalize ${
                                status === 'achieved' ? 'text-green-400' :
                                status === 'close' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {status}
                              </span>
                            </div>
                            {target.deadline && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Deadline:</span>
                                <span className="text-white">{target.deadline}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between glass rounded-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search data..."
                    className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-3 py-2 glass rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-white text-sm">Filters</span>
                  </button>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-black/90 border border-gray-600 rounded-lg p-3 z-10 min-w-[200px]"
                      >
                        <div className="space-y-2">
                          {['all', 'missing', 'completed'].map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                setFilterType(type as 'all' | 'missing' | 'completed');
                                setShowFilters(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-all capitalize ${
                                filterType === type
                                  ? 'bg-purple-600 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {type} rows
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedRows.size > 0 && (
                  <button
                    onClick={deleteSelectedRows}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete ({selectedRows.size})</span>
                  </button>
                )}

                <button
                  onClick={addNewRow}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Row</span>
                </button>

                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  {showSuggestions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-white text-sm">
                    {showSuggestions ? 'Hide' : 'Show'} Suggestions
                  </span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left">
                        <input
                          title="Select all rows"
                          type="checkbox"
                          checked={selectedRows.size === tableData.rows.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(new Set(Array.from({ length: tableData.rows.length }, (_, i) => i)));
                            } else {
                              setSelectedRows(new Set());
                            }
                          }}
                          className="rounded border-gray-600 bg-black/50 text-purple-600 focus:ring-purple-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-white font-medium">#</th>
                      {tableData.headers.map((header, index) => (
                        <th key={index} className="px-4 py-3 text-left text-white font-medium">
                          {header}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`border-b border-gray-800 hover:bg-white/5 ${selectedRows.has(rowIndex) ? 'bg-purple-500/10' : ''}`}>
                        <td className="px-4 py-3">
                          <input
                            title="Select row"
                            type="checkbox"
                            checked={selectedRows.has(rowIndex)}
                            onChange={() => toggleRowSelection(rowIndex)}
                            className="rounded border-gray-600 bg-black/50 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-400">{rowIndex + 1}</td>
                        {row.map((cell, colIndex) => {
                          const isMissing = cell === null || cell === '';
                          const missingCell = tableData.missingCells.find(
                            mc => mc.row === rowIndex && mc.column === colIndex
                          );
                          const isSelected = selectedCell?.row === rowIndex && selectedCell?.column === colIndex;

                          return (
                            <td key={colIndex} className="px-4 py-3 relative group">
                              {isMissing ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Missing data"
                                    aria-label="Fill missing data"
                                    className={`bg-red-500/10 border rounded px-2 py-1 text-white placeholder-red-400 text-sm focus:outline-none ${
                                      isSelected ? 'border-purple-400 bg-purple-500/10' : 'border-red-500/30 focus:border-red-400'
                                    }`}
                                    onChange={(e) => handleCellUpdate(rowIndex, colIndex, e.target.value)}
                                    onClick={() => missingCell && handleCellClick(missingCell)}
                                  />
                                  {showSuggestions && missingCell?.suggestion && (
                                    <motion.button
                                      onClick={() => applySuggestion(missingCell)}
                                      className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs hover:bg-purple-600/30 transition-all"
                                      whileHover={{ scale: 1.05 }}
                                      title={`Suggestion: ${missingCell.suggestion}`}
                                    >
                                      <Sparkles className="w-3 h-3" />
                                    </motion.button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-white">{cell}</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 relative">
                          <button
                            title="Show row actions"
                            onClick={() => setShowRowActions(showRowActions === rowIndex ? null : rowIndex)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          <AnimatePresence>
                            {showRowActions === rowIndex && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 bg-black/90 border border-gray-600 rounded-lg p-2 z-10 min-w-[120px]"
                              >
                                <button
                                  onClick={() => {
                                    toggleRowSelection(rowIndex);
                                    setShowRowActions(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-all"
                                >
                                  {selectedRows.has(rowIndex) ? 'Deselect' : 'Select'}
                                </button>
                                <button
                                  onClick={() => {
                                    const newRows = tableData.rows.filter((_, i) => i !== rowIndex);
                                    setTableData({ ...tableData, rows: newRows });
                                    setShowRowActions(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                                >
                                  Delete Row
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <AnimatePresence>
              {showSuggestions && tableData.missingCells.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Suggestions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tableData.missingCells.slice(0, 6).map((missingCell, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-black/30 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedCell?.row === missingCell.row && selectedCell?.column === missingCell.column
                            ? 'ring-2 ring-purple-500 bg-purple-500/10'
                            : 'hover:bg-black/50'
                        }`}
                        onClick={() => handleCellClick(missingCell)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium text-sm">
                              Row {missingCell.row + 1}, Column {tableData.headers[missingCell.column]}
                            </p>
                            <p className="text-gray-400 text-xs">{missingCell.context}</p>
                          </div>
                          {missingCell.confidence && (
                            <span className={`px-2 py-1 rounded text-xs ${getCompletionColor(missingCell.confidence)}`}>
                              {Math.round(missingCell.confidence * 100)}%
                            </span>
                          )}
                        </div>
                        <p className="text-purple-400 text-sm mb-3">{missingCell.question}</p>
                        {missingCell.suggestion && (
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 text-sm">{missingCell.suggestion}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                applySuggestion(missingCell);
                              }}
                              className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-all"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
