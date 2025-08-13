// Service to handle internal resources (PDFs) when knowledge source is internal
import { BilingualSearchService } from './bilingualSearchService';

export class InternalResourceService {
  
  // List of available internal resources
  static internalResources = [
    {
      id: 'plc-basics',
      title: 'Siemens PLC Basics Guide',
      filename: 'siemens-plc-basics.pdf',
      topics: ['plc', 'siemens', 'programming', 'automation', 'control', 'troubleshooting', 'maintenance'],
      description: 'Basic guide to Siemens PLC programming and troubleshooting',
      category: 'plc'
    },
    {
      id: 'lockout-tagout',
      title: 'Lockout Tagout Safety Procedures',
      filename: 'lockout-tagout-procedures.pdf',
      topics: ['safety', 'lockout', 'tagout', 'loto', 'maintenance', 'procedures', 'electrical', 'mechanical'],
      description: 'Complete lockout tagout procedures and safety guidelines',
      category: 'safety'
    },
    {
      id: 'hydraulic-systems',
      title: 'Hydraulic Systems Maintenance',
      filename: 'hydraulic-systems-maintenance.pdf',
      topics: ['hydraulic', 'hydraulics', 'maintenance', 'systems', 'fluid', 'pump', 'mechanical', 'industrial'],
      description: 'Hydraulic system maintenance and troubleshooting guide',
      category: 'hydraulic'
    },
    {
      id: 'electrical-safety',
      title: 'Electrical Safety Standards',
      filename: 'electrical-safety-standards.pdf',
      topics: ['electrical', 'safety', 'standards', 'procedures', 'maintenance', 'industrial', 'equipment'],
      description: 'Electrical safety standards and maintenance procedures',
      category: 'electrical'
    },
    {
      id: 'maintenance-checklist',
      title: 'Preventive Maintenance Checklist',
      filename: 'maintenance-checklist.pdf',
      topics: ['maintenance', 'preventive', 'checklist', 'procedures', 'inspection', 'industrial', 'equipment', 'safety'],
      description: 'Comprehensive preventive maintenance checklist and procedures',
      category: 'maintenance'
    },
    {
      id: 'industrial-overview',
      title: 'Industrial Equipment Overview',
      filename: 'industrial-equipment-overview.pdf',
      topics: ['industrial', 'equipment', 'overview', 'maintenance', 'safety', 'procedures', 'general'],
      description: 'General overview of industrial equipment and maintenance procedures',
      category: 'general'
    }
  ];

  // Search for internal resources relevant to a topic
  static async searchInternalResources(topic, formData) {
    console.log('🔍 DEBUG: Searching internal resources for topic:', topic);
    
    // Get both built-in and uploaded resources
    const allResources = [...this.internalResources];
    
    // Add uploaded PDFs from localStorage
    try {
      const uploadedPDFs = localStorage.getItem('uploadedPDFs');
      if (uploadedPDFs) {
        const parsedPDFs = JSON.parse(uploadedPDFs);
        allResources.push(...parsedPDFs);
        console.log('🔍 DEBUG: Added uploaded PDFs:', parsedPDFs.length);
      }
    } catch (error) {
      console.error('Error loading uploaded PDFs:', error);
    }
    
    console.log('🔍 DEBUG: Total available resources:', allResources.length);
    console.log('🔍 DEBUG: Available resources:', allResources.map(r => ({ id: r.id, title: r.title, topics: r.topics })));
    
    const topicLower = topic.toLowerCase();
    
    // Use bilingual search service for intelligent search
    console.log('🔍 DEBUG: Using bilingual search for topic:', topic);
    console.log('🌐 DEBUG: Bilingual search activated - searching in both Spanish and English');
    
    let relevantResources = BilingualSearchService.searchBilingual(topic, allResources);
    
    console.log('🔍 DEBUG: Bilingual search results:', relevantResources.length);
    console.log('🌐 DEBUG: Found resources:', relevantResources.map(r => r.title));
    
    // Show bilingual search details
    if (relevantResources.length > 0) {
      console.log('✅ DEBUG: Bilingual search successful!');
    } else {
      console.log('⚠️ DEBUG: No results from bilingual search, trying fallback...');
    }

    // If no results from bilingual search, try broader category matching as fallback
    if (relevantResources.length === 0) {
      console.log('🔍 DEBUG: No bilingual results, trying broader category matching...');
      
      // Try to find resources based on broader categories
      if (topicLower.includes('plc') || topicLower.includes('programming') || topicLower.includes('automation')) {
        relevantResources = allResources.filter(resource => 
          resource.category === 'plc' || resource.topics.includes('plc') || resource.topics.includes('automation')
        );
      } else if (topicLower.includes('electrical') || topicLower.includes('safety')) {
        relevantResources = allResources.filter(resource => 
          resource.category === 'safety' || resource.topics.includes('electrical') || resource.topics.includes('safety')
        );
      } else if (topicLower.includes('mechanical') || topicLower.includes('hydraulic') || topicLower.includes('pneumatic')) {
        relevantResources = allResources.filter(resource => 
          resource.category === 'hydraulic' || resource.topics.includes('maintenance')
        );
      } else {
        // No relevant resources found for this specific topic
        console.log('🔍 DEBUG: No relevant resources found for topic:', topic);
        relevantResources = [];
      }
    }

    console.log('🔍 DEBUG: Final relevant resources found:', relevantResources.length);
    console.log('🔍 DEBUG: Final relevant resources:', relevantResources.map(r => r.title));

    return relevantResources;
  }

  // Get resource content (simulated for now - in real implementation this would read PDF content)
  static async getResourceContent(resourceId) {
    // First check built-in resources
    let resource = this.internalResources.find(r => r.id === resourceId);
    
    // If not found in built-in, check uploaded PDFs
    if (!resource) {
      try {
        const uploadedPDFs = localStorage.getItem('uploadedPDFs');
        if (uploadedPDFs) {
          const parsedPDFs = JSON.parse(uploadedPDFs);
          resource = parsedPDFs.find(r => r.id === resourceId);
        }
      } catch (error) {
        console.error('Error loading uploaded PDFs:', error);
      }
    }
    
    if (!resource) {
      throw new Error('Resource not found');
    }

    // For uploaded PDFs, return the actual content
    if (resource.category === 'uploaded') {
      return {
        id: resource.id,
        title: resource.title,
        content: resource.content,
        topics: resource.topics,
        category: resource.category
      };
    }

    // For built-in resources, return a summary
    return {
      id: resource.id,
      title: resource.title,
      content: `Content summary for ${resource.title}. This document covers ${resource.description.toLowerCase()}.`,
      topics: resource.topics,
      category: resource.category
    };
  }

  // Check if internal resources are available for a topic
  static async hasInternalResources(topic) {
    console.log('🔍 DEBUG: hasInternalResources called for topic:', topic);
    const resources = await this.searchInternalResources(topic);
    const hasResources = resources.length > 0;
    console.log('🔍 DEBUG: hasInternalResources result:', hasResources, 'resources found:', resources.length);
    
    return hasResources;
  }

  // Get all available internal resources
  static getAllInternalResources() {
    return this.internalResources;
  }

  // Get resource by ID
  static getResourceById(resourceId) {
    return this.internalResources.find(r => r.id === resourceId);
  }
} 