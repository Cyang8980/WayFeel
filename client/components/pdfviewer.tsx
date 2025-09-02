// components/pdfviewer.tsx - Text extraction from PDF
import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Search, Copy, Check } from 'lucide-react';
import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

interface PdfViewerProps {
  file: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    extractTextFromPdf();
  }, [file]);

  const extractTextFromPdf = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Load PDF.js
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Add page header
        fullText += `\n\n--- PAGE ${pageNum} ---\n\n`;
        
        // Extract text items
        const pageText = textContent.items
          .map((item: TextItem | TextMarkedContent)=>
          "str" in item ? item.str : ""
        )
          .join(' ')
          .replace(/\s+/g, ' ') // Clean up multiple spaces
          .trim();
        
        fullText += pageText;
      }
      
      setTextContent(fullText.trim());
      setLoading(false);
    } catch (err: unknown) {
      console.error("Error extracting PDF text:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to extract text from PDF");
      }
      setLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
  };

  const getWordCount = (): number => {
    return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = (): number => {
    return textContent.length;
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Controls Header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">
              {loading ? 'Extracting text...' : 'Document Text'}
            </span>
            {!loading && !error && (
              <span className="text-sm text-gray-500">
                ({getWordCount()} words, {getCharCount()} characters)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {!loading && !error && (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </>
            )}
            
            {/* External Links */}
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              PDF
            </a>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="h-96 overflow-y-auto p-6 bg-white dark:bg-gray-800">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Extracting text from PDF...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-red-500 font-medium mb-2">Cannot extract text</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <div className="space-x-2">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View PDF
              </a>
              <a
                href={file}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div 
              className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ 
                __html: highlightText(textContent, searchTerm) 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;