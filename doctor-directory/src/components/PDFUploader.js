import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEye, FaFilePdf } from 'react-icons/fa';
import ElegantNotification from './ElegantNotification';
import ElegantConfirmation from './ElegantConfirmation';
import { IntelligentPDFService } from '../services/intelligentPDFService';

const PDFUploader = ({ onPDFsChange }) => {
  const [uploadedPDFs, setUploadedPDFs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, pdfId: null, pdfTitle: '' });

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
            setNotification({
              message: `File "${file.name}" is too large. Maximum size is 10MB.`,
              type: 'error'
            });
            continue;
          }

          // Use intelligent PDF processing with AI
          console.log('🤖 Starting intelligent PDF processing for:', file.name);
          
          // For now, we'll use the local intelligent processing
          // In production, this would use OpenAI API if available
          const pdfData = await IntelligentPDFService.processPDFWithAI(file, {});
          
          console.log('✅ Intelligent processing completed for:', file.name);

          newPDFs.push(pdfData);
        } else {
          setNotification({
            message: `File "${file.name}" is not a PDF. Please upload only PDF files.`,
            type: 'warning'
          });
        }
      }

      if (newPDFs.length > 0) {
        setUploadedPDFs(prev => [...prev, ...newPDFs]);
        setNotification({
          message: `Successfully uploaded ${newPDFs.length} PDF(s)`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error uploading PDFs:', error);
      setNotification({
        message: 'Error uploading PDFs. Please try again.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Extract text from PDF with improved content extraction
  const extractTextFromPDF = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // For now, we'll simulate PDF content extraction
          // In a full implementation, you'd use pdf.js library
          const simulatedContent = this.generateSimulatedPDFContent(file.name);
          resolve(simulatedContent);
        } catch (error) {
          console.error('Error extracting PDF content:', error);
          // Fallback to basic content
          resolve(`Content extracted from ${file.name}. This document contains technical information relevant to industrial maintenance and operations.`);
        }
      };
      reader.readAsText(file);
    });
  };

  // Generate simulated PDF content based on filename
  const generateSimulatedPDFContent = (filename) => {
    const filenameLower = filename.toLowerCase();
    
    // Generate content based on filename patterns
    if (filenameLower.includes('hydraulic') || filenameLower.includes('hidráulico')) {
      return `Hydraulic Systems Operation Manual

This comprehensive manual covers hydraulic system components, operation procedures, maintenance protocols, and troubleshooting guidelines.

Key Topics:
- Hydraulic pump operation and maintenance
- Valve system procedures and controls
- Fluid management and filtration
- System troubleshooting and diagnostics
- Safety protocols for hydraulic operations
- Preventive maintenance schedules
- Component replacement procedures
- System performance optimization

This document provides essential information for technicians working with hydraulic systems in industrial environments.`;
    }
    
    if (filenameLower.includes('electrical') || filenameLower.includes('eléctrico')) {
      return `Electrical Systems Safety and Maintenance Guide

Comprehensive guide covering electrical safety, maintenance procedures, and operational protocols for industrial electrical systems.

Key Topics:
- Electrical safety protocols and procedures
- Lockout/tagout procedures
- Electrical maintenance schedules
- Troubleshooting electrical systems
- Safety standards compliance
- Equipment operation procedures
- Preventive maintenance guidelines
- Emergency response procedures

Essential reference for electrical technicians and maintenance personnel.`;
    }
    
    if (filenameLower.includes('plc') || filenameLower.includes('automation')) {
      return `PLC Programming and Automation Manual

Complete guide to PLC programming, automation systems, and industrial control procedures.

Key Topics:
- PLC programming fundamentals
- Automation system design
- Control system procedures
- Troubleshooting automation issues
- Maintenance and calibration
- Safety protocols for automated systems
- Programming best practices
- System integration procedures

Comprehensive resource for automation technicians and engineers.`;
    }
    
    if (filenameLower.includes('maintenance') || filenameLower.includes('mantenimiento')) {
      return `Industrial Maintenance Procedures Manual

Complete guide to industrial maintenance procedures, schedules, and best practices.

Key Topics:
- Preventive maintenance procedures
- Equipment maintenance schedules
- Maintenance safety protocols
- Troubleshooting procedures
- Parts management and inventory
- Quality control procedures
- Maintenance documentation
- Emergency repair procedures

Essential reference for maintenance technicians and supervisors.`;
    }
    
    // Default content for other PDFs
    return `Technical Documentation: ${filename}

This document contains technical information, procedures, and guidelines relevant to industrial operations and maintenance.

Key Topics:
- Technical procedures and protocols
- Operational guidelines
- Safety procedures
- Maintenance protocols
- Troubleshooting guides
- Quality standards
- Compliance requirements
- Best practices

Comprehensive technical reference for industrial personnel.`;
  };

  // Extract topics from text content with bilingual support
  const extractTopicsFromText = (text) => {
    const textLower = text.toLowerCase();
    const topics = [];
    
    // Bilingual keyword extraction
    const keywordMappings = {
      // PLC & Automation
      'plc': ['plc', 'automation', 'programming', 'control systems'],
      'programming': ['plc', 'automation', 'programming', 'control systems'],
      'automation': ['plc', 'automation', 'programming', 'control systems'],
      
      // Electrical & Safety
      'electrical': ['electrical', 'electricity', 'safety', 'ehs'],
      'safety': ['electrical', 'safety', 'ehs', 'security'],
      'seguridad': ['electrical', 'safety', 'ehs', 'security'],
      
      // Mechanical & Hydraulics
      'mechanical': ['mechanical', 'mechanics', 'maintenance', 'equipment'],
      'hydraulic': ['mechanical', 'hydraulic', 'hydraulics', 'fluid systems'],
      'hidráulico': ['mechanical', 'hydraulic', 'hydraulics', 'fluid systems'],
      'hidráulicos': ['mechanical', 'hydraulic', 'hydraulics', 'fluid systems'],
      
      // Maintenance & Procedures
      'maintenance': ['maintenance', 'servicing', 'procedures', 'operations'],
      'procedures': ['maintenance', 'procedures', 'operations', 'protocols'],
      'procedimientos': ['maintenance', 'procedures', 'operations', 'protocols'],
      'operación': ['maintenance', 'procedures', 'operations', 'protocols'],
      'operaciones': ['maintenance', 'procedures', 'operations', 'protocols'],
      
      // Pneumatics
      'pneumatic': ['pneumatic', 'pneumatics', 'air systems', 'compressed air'],
      'neumático': ['pneumatic', 'pneumatics', 'air systems', 'compressed air'],
      'neumáticos': ['pneumatic', 'pneumatics', 'air systems', 'compressed air'],
      
      // Controls
      'controls': ['controls', 'control systems', 'automation', 'monitoring'],
      'control': ['controls', 'control systems', 'automation', 'monitoring'],
      'controles': ['controls', 'control systems', 'automation', 'monitoring'],
      
      // Components
      'components': ['components', 'parts', 'equipment', 'systems'],
      'componentes': ['components', 'parts', 'equipment', 'systems'],
      'equipment': ['components', 'parts', 'equipment', 'systems'],
      'equipos': ['components', 'parts', 'equipment', 'systems']
    };
    
    // Extract topics based on keyword mappings
    Object.entries(keywordMappings).forEach(([keyword, topicList]) => {
      if (textLower.includes(keyword)) {
        topics.push(...topicList);
      }
    });
    
    // Always add general topics
    topics.push('industrial', 'training', 'technical');
    
    // Remove duplicates and return
    return [...new Set(topics)];
  };

  // Delete uploaded PDF
  const deletePDF = (id) => {
    const pdf = uploadedPDFs.find(p => p.id === id);
    setDeleteConfirmation({
      isOpen: true,
      pdfId: id,
      pdfTitle: pdf ? pdf.title : 'this PDF'
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteConfirmation.pdfId) {
      setUploadedPDFs(prev => prev.filter(pdf => pdf.id !== deleteConfirmation.pdfId));
      setNotification({
        message: 'PDF deleted successfully',
        type: 'success'
      });
    }
    setDeleteConfirmation({ isOpen: false, pdfId: null, pdfTitle: '' });
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, pdfId: null, pdfTitle: '' });
  };

  // View PDF content
  const viewPDF = (pdf) => {
    setNotification({
      message: `PDF Content Preview: ${pdf.title}`,
      type: 'info',
      duration: 8000
    });
    // For now, we'll just show the notification. In a full implementation, you might want to show a modal
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaFilePdf className="mr-2 text-red-500" />
        Upload Internal PDFs
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          🤖 AI-Enhanced
        </span>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>🤖 AI-Enhanced Processing:</strong> PDFs are automatically analyzed to extract topics, 
              generate bilingual search terms, and improve discoverability in both Spanish and English.
            </p>
          </div>
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
      
      {/* Elegant Notifications */}
      {notification && (
        <ElegantNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ElegantConfirmation
        isOpen={deleteConfirmation.isOpen}
        title="Delete PDF"
        message={`Are you sure you want to delete "${deleteConfirmation.pdfTitle}"? This action cannot be undone.`}
        confirmText="Delete PDF"
        cancelText="Cancel"
        confirmType="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default PDFUploader; 