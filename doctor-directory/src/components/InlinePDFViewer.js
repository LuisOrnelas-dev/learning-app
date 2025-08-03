import React, { useState } from 'react';

const InlinePDFViewer = ({ content, title, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convertir el contenido markdown a HTML simple
  const convertMarkdownToHTML = (markdown) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-3 text-blue-800">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold mb-2 mt-4 text-gray-800 border-b border-gray-200 pb-1">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-md font-medium mb-2 mt-3 text-gray-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-2 leading-relaxed text-sm">')
      .replace(/^/g, '<p class="mb-2 leading-relaxed text-sm">')
      .replace(/$/g, '</p>')
      .replace(/\n- (.*$)/gim, '</p><p class="mb-1 ml-4 text-sm">• $1</p>')
      .replace(/\n\d+\. (.*$)/gim, '</p><p class="mb-1 ml-4 text-sm">$&</p>');
  };

  const htmlContent = convertMarkdownToHTML(content);

  return (
    <div className="mt-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-none' : 'max-h-32'
      }`}>
        <div 
          className="p-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {!isExpanded && (
          <div className="text-center p-2 bg-gray-50 border-t">
            <span className="text-xs text-gray-500">
              Click "Expand" to see full content ({content.length} characters)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InlinePDFViewer; 