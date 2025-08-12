import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEye, FaFilePdf } from 'react-icons/fa';

const PDFUploader = ({ onPDFsChange }) => {
  const [uploadedPDFs, setUploadedPDFs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load uploaded PDFs from localStorage on component mount
  useEffect(() => {
    const savedPDFs = localStorage.getItem('uploadedPDFs');
    if (savedPDFs) {
      try {
        setUploadedPDFs(JSON.parse(savedPDFs));
      } catch (error) {
        console.error('Error loading uploaded PDFs:', error);
        setUploadedPDFs([]);
      }
    }
  }, []);

  // Save PDFs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedPDFs', JSON.stringify(uploadedPDFs));
    if (onPDFsChange) {
      onPDFsChange(uploadedPDFs);
    }
  }, [uploadedPDFs, onPDFsChange]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);

    try {
      const newPDFs = [];

      for (const file of files) {
        if (file.type === 'application/pdf') {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 10MB.`);
            continue;
          }

          // Extract text from PDF using pdf.js or similar
          const textContent = await extractTextFromPDF(file);
          
          const pdfData = {
            id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: file.name.replace('.pdf', ''),
            filename: file.name,
            content: textContent,
            topics: extractTopicsFromText(textContent),
            description: `Uploaded PDF: ${file.name}`,
            category: 'uploaded',
            uploadedAt: new Date().toISOString(),
            fileSize: file.size
          };

          newPDFs.push(pdfData);
        } else {
          alert(`File ${file.name} is not a PDF. Please upload only PDF files.`);
        }
      }

      if (newPDFs.length > 0) {
        setUploadedPDFs(prev => [...prev, ...newPDFs]);
        alert(`Successfully uploaded ${newPDFs.length} PDF(s)`);
      }
    } catch (error) {
      console.error('Error uploading PDFs:', error);
      alert('Error uploading PDFs. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Extract text from PDF (simplified version)
  const extractTextFromPDF = async (file) => {
    // For MVP, we'll use a simplified approach
    // In production, you'd use pdf.js or similar library
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For now, return a placeholder since we can't extract PDF text in browser without additional libraries
        resolve(`Content extracted from ${file.name}. This is a placeholder for the actual PDF content. In a full implementation, this would contain the actual text extracted from the PDF.`);
      };
      reader.readAsText(file);
    });
  };

  // Extract topics from text content
  const extractTopicsFromText = (text) => {
    const textLower = text.toLowerCase();
    const topics = [];
    
    // Simple keyword extraction
    if (textLower.includes('plc') || textLower.includes('programming') || textLower.includes('automation')) {
      topics.push('plc', 'automation', 'programming');
    }
    if (textLower.includes('electrical') || textLower.includes('safety')) {
      topics.push('electrical', 'safety');
    }
    if (textLower.includes('mechanical') || textLower.includes('hydraulic')) {
      topics.push('mechanical', 'hydraulic');
    }
    if (textLower.includes('maintenance') || textLower.includes('procedures')) {
      topics.push('maintenance', 'procedures');
    }
    
    // Always add some general topics
    topics.push('industrial', 'training');
    
    // Remove duplicates and return
    return [...new Set(topics)];
  };

  // Delete uploaded PDF
  const deletePDF = (id) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      setUploadedPDFs(prev => prev.filter(pdf => pdf.id !== id));
    }
  };

  // View PDF content
  const viewPDF = (pdf) => {
    alert(`PDF Content Preview:\n\nTitle: ${pdf.title}\n\nContent: ${pdf.content.substring(0, 200)}...`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaFilePdf className="mr-2 text-red-500" />
        Upload Internal PDFs
      </h3>
      
      {/* Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FaUpload className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-600 mb-2">
            Drag and drop PDF files here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Maximum file size: 10MB per file
          </p>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : 'Select PDF Files'}
          </label>
        </div>
      </div>

      {/* Uploaded PDFs List */}
      {uploadedPDFs.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Uploaded PDFs ({uploadedPDFs.length})
          </h4>
          <div className="space-y-3">
            {uploadedPDFs.map((pdf) => (
              <div key={pdf.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaFilePdf className="text-red-500 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">{pdf.title}</p>
                    <p className="text-sm text-gray-500">
                      {(pdf.fileSize / 1024 / 1024).toFixed(2)} MB • {pdf.topics.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewPDF(pdf)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    title="View content"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => deletePDF(pdf.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete PDF"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">How it works:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload your company's PDF documents (manuals, procedures, etc.)</li>
          <li>• When you select "internal" as knowledge source, these PDFs will be used</li>
          <li>• The system will generate content based on your internal documents</li>
          <li>• This saves money and ensures content is specific to your company</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFUploader; 