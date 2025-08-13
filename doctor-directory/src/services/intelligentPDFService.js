// Intelligent PDF Processing Service using AI for dynamic bilingual search
export class IntelligentPDFService {
  
  // Process PDF content with AI to extract intelligent metadata
  static async processPDFWithAI(file, formData) {
    try {
      console.log('🤖 AI Processing PDF:', file.name);
      
      // Extract text content from PDF
      const textContent = await this.extractTextFromPDF(file);
      
      // Use AI to analyze content and extract intelligent metadata
      const aiMetadata = await this.analyzeContentWithAI(textContent, file.name, formData);
      
      // Create enhanced resource object
      const enhancedResource = {
        id: `ai-processed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: aiMetadata.title,
        filename: file.name,
        content: textContent,
        topics: aiMetadata.topics,
        description: aiMetadata.description,
        category: aiMetadata.category,
        bilingualTerms: aiMetadata.bilingualTerms,
        searchKeywords: aiMetadata.searchKeywords,
        category: 'uploaded',
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        aiProcessed: true,
        language: aiMetadata.detectedLanguage
      };
      
      console.log('✅ AI Processing completed:', enhancedResource.title);
      return enhancedResource;
      
    } catch (error) {
      console.error('❌ AI Processing failed:', error);
      // Fallback to basic processing
      return this.createBasicResource(file);
    }
  }
  
  // Extract text from PDF (simplified for now)
  static async extractTextFromPDF(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For now, simulate PDF content based on filename
        // In production, use pdf.js library for real text extraction
        const simulatedContent = this.generateSimulatedContent(file.name);
        resolve(simulatedContent);
      };
      reader.readAsText(file);
    });
  }
  
  // Generate simulated content for testing
  static generateSimulatedContent(filename) {
    const filenameLower = filename.toLowerCase();
    
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
    
    // Default content
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
  }
  
  // Analyze content with AI to extract intelligent metadata
  static async analyzeContentWithAI(content, filename, formData) {
    try {
      // Check if we have OpenAI API available
      if (formData.apiKey && formData.apiKey.startsWith('sk-')) {
        return await this.analyzeWithOpenAI(content, filename, formData);
      } else {
        // Fallback to intelligent local processing
        return this.analyzeLocally(content, filename);
      }
    } catch (error) {
      console.error('❌ AI Analysis failed, using local fallback:', error);
      return this.analyzeLocally(content, filename);
    }
  }
  
  // Analyze with OpenAI API
  static async analyzeWithOpenAI(content, filename, formData) {
    try {
      const prompt = `Analyze this technical document and provide structured metadata in JSON format:

Document: ${filename}
Content: ${content.substring(0, 2000)}...

Please provide:
1. A clear, descriptive title
2. Key topics and concepts (as array)
3. A concise description
4. Bilingual search terms (Spanish-English mapping)
5. Search keywords for better discovery
6. Main category (maintenance, safety, electrical, mechanical, hydraulic, pneumatic, plc, automation)
7. Detected language of content

Format as valid JSON with these exact keys: title, topics, description, bilingualTerms, searchKeywords, category, detectedLanguage

Example bilingualTerms format:
{
  "procedimientos de operación": ["operation procedures", "operating procedures"],
  "componentes hidráulicos": ["hydraulic components", "hydraulic parts"],
  "mantenimiento preventivo": ["preventive maintenance", "scheduled maintenance"]
}`;

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          apiKey: formData.apiKey,
          model: 'gpt-3.5-turbo',
          maxTokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const aiResponse = data.response || data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      // Parse AI response
      const metadata = this.parseAIResponse(aiResponse);
      console.log('🤖 OpenAI analysis successful:', metadata);
      
      return metadata;
      
    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error);
      throw error;
    }
  }
  
  // Parse AI response and extract metadata
  static parseAIResponse(aiResponse) {
    try {
      // Try to extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const metadata = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize metadata
        return {
          title: metadata.title || 'Technical Document',
          topics: Array.isArray(metadata.topics) ? metadata.topics : ['technical', 'industrial'],
          description: metadata.description || 'Technical documentation for industrial operations',
          bilingualTerms: metadata.bilingualTerms || {},
          searchKeywords: Array.isArray(metadata.searchKeywords) ? metadata.searchKeywords : [],
          category: metadata.category || 'general',
          detectedLanguage: metadata.detectedLanguage || 'English'
        };
      }
      
      throw new Error('No JSON found in AI response');
      
    } catch (error) {
      console.error('❌ Failed to parse AI response:', error);
      throw error;
    }
  }
  
  // Local intelligent analysis as fallback
  static analyzeLocally(content, filename) {
    console.log('🔍 Using local intelligent analysis for:', filename);
    
    const contentLower = content.toLowerCase();
    const filenameLower = filename.toLowerCase();
    
    // Detect language
    const spanishWords = ['procedimientos', 'componentes', 'mantenimiento', 'seguridad', 'operación'];
    const hasSpanish = spanishWords.some(word => contentLower.includes(word));
    const detectedLanguage = hasSpanish ? 'Spanish' : 'English';
    
    // Extract topics based on content analysis
    const topics = this.extractTopicsIntelligently(contentLower);
    
    // Generate bilingual terms based on content
    const bilingualTerms = this.generateBilingualTerms(contentLower, detectedLanguage);
    
    // Determine category
    const category = this.determineCategory(contentLower, filenameLower);
    
    // Generate title
    const title = this.generateTitle(filename, category, detectedLanguage);
    
    // Generate description
    const description = this.generateDescription(content, category, detectedLanguage);
    
    return {
      title,
      topics,
      description,
      bilingualTerms,
      searchKeywords: [...topics, ...Object.keys(bilingualTerms)],
      category,
      detectedLanguage
    };
  }
  
  // Extract topics intelligently from content
  static extractTopicsIntelligently(content) {
    const topics = new Set();
    
    // Technical areas
    if (content.includes('hydraulic') || content.includes('hidráulico')) {
      topics.add('hydraulic', 'fluid systems', 'pump systems');
    }
    if (content.includes('electrical') || content.includes('eléctrico')) {
      topics.add('electrical', 'electrical systems', 'power systems');
    }
    if (content.includes('pneumatic') || content.includes('neumático')) {
      topics.add('pneumatic', 'air systems', 'compressed air');
    }
    if (content.includes('plc') || content.includes('automation')) {
      topics.add('plc', 'automation', 'control systems');
    }
    if (content.includes('maintenance') || content.includes('mantenimiento')) {
      topics.add('maintenance', 'servicing', 'upkeep');
    }
    if (content.includes('safety') || content.includes('seguridad')) {
      topics.add('safety', 'security', 'protection');
    }
    if (content.includes('procedures') || content.includes('procedimientos')) {
      topics.add('procedures', 'protocols', 'methods');
    }
    
    // Always add general topics
    topics.add('industrial', 'technical', 'operations');
    
    return Array.from(topics);
  }
  
  // Generate bilingual terms based on content
  static generateBilingualTerms(content, language) {
    const terms = {};
    
    if (language === 'Spanish') {
      // Spanish content, generate English equivalents
      if (content.includes('procedimientos')) {
        terms['procedimientos'] = ['procedures', 'protocols', 'methods'];
      }
      if (content.includes('mantenimiento')) {
        terms['mantenimiento'] = ['maintenance', 'servicing', 'upkeep'];
      }
      if (content.includes('seguridad')) {
        terms['seguridad'] = ['safety', 'security', 'protection'];
      }
      if (content.includes('operación')) {
        terms['operación'] = ['operation', 'operating', 'operational'];
      }
      if (content.includes('componentes')) {
        terms['componentes'] = ['components', 'parts', 'elements'];
      }
    } else {
      // English content, generate Spanish equivalents
      if (content.includes('procedures')) {
        terms['procedures'] = ['procedimientos', 'protocolos', 'métodos'];
      }
      if (content.includes('maintenance')) {
        terms['maintenance'] = ['mantenimiento', 'servicio', 'cuidado'];
      }
      if (content.includes('safety')) {
        terms['safety'] = ['seguridad', 'protección', 'resguardo'];
      }
      if (content.includes('operation')) {
        terms['operation'] = ['operación', 'funcionamiento', 'operativo'];
      }
      if (content.includes('components')) {
        terms['components'] = ['componentes', 'partes', 'elementos'];
      }
    }
    
    return terms;
  }
  
  // Determine document category
  static determineCategory(content, filename) {
    if (content.includes('hydraulic') || content.includes('hidráulico') || filename.includes('hydraulic')) {
      return 'hydraulic';
    }
    if (content.includes('electrical') || content.includes('eléctrico') || filename.includes('electrical')) {
      return 'electrical';
    }
    if (content.includes('pneumatic') || content.includes('neumático') || filename.includes('pneumatic')) {
      return 'pneumatic';
    }
    if (content.includes('plc') || content.includes('automation') || filename.includes('plc')) {
      return 'plc';
    }
    if (content.includes('maintenance') || content.includes('mantenimiento') || filename.includes('maintenance')) {
      return 'maintenance';
    }
    if (content.includes('safety') || content.includes('seguridad') || filename.includes('safety')) {
      return 'safety';
    }
    
    return 'general';
  }
  
  // Generate descriptive title
  static generateTitle(filename, category, language) {
    const baseName = filename.replace('.pdf', '').replace(/[-_]/g, ' ');
    
    if (language === 'Spanish') {
      const categoryNames = {
        'hydraulic': 'Sistemas Hidráulicos',
        'electrical': 'Sistemas Eléctricos',
        'pneumatic': 'Sistemas Neumáticos',
        'plc': 'PLC y Automatización',
        'maintenance': 'Mantenimiento Industrial',
        'safety': 'Seguridad Industrial'
      };
      
      return `${categoryNames[category] || 'Documento Técnico'}: ${baseName}`;
    } else {
      const categoryNames = {
        'hydraulic': 'Hydraulic Systems',
        'electrical': 'Electrical Systems',
        'pneumatic': 'Pneumatic Systems',
        'plc': 'PLC & Automation',
        'maintenance': 'Industrial Maintenance',
        'safety': 'Industrial Safety'
      };
      
      return `${categoryNames[category] || 'Technical Document'}: ${baseName}`;
    }
  }
  
  // Generate description
  static generateDescription(content, category, language) {
    const descriptions = {
      'hydraulic': language === 'Spanish' ? 'Manual de sistemas hidráulicos' : 'Hydraulic systems manual',
      'electrical': language === 'Spanish' ? 'Guía de sistemas eléctricos' : 'Electrical systems guide',
      'pneumatic': language === 'Spanish' ? 'Manual de sistemas neumáticos' : 'Pneumatic systems manual',
      'plc': language === 'Spanish' ? 'Guía de PLC y automatización' : 'PLC and automation guide',
      'maintenance': language === 'Spanish' ? 'Manual de mantenimiento industrial' : 'Industrial maintenance manual',
      'safety': language === 'Spanish' ? 'Guía de seguridad industrial' : 'Industrial safety guide'
    };
    
    return descriptions[category] || (language === 'Spanish' ? 'Documento técnico industrial' : 'Industrial technical document');
  }
  
  // Create basic resource as fallback
  static createBasicResource(file) {
    return {
      id: `basic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: file.name.replace('.pdf', ''),
      filename: file.name,
      content: `Content extracted from ${file.name}`,
      topics: ['technical', 'industrial'],
      description: `Technical document: ${file.name}`,
      category: 'uploaded',
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      aiProcessed: false,
      language: 'Unknown'
    };
  }
} 