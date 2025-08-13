// Bilingual Search Service for handling searches in multiple languages
export class BilingualSearchService {
  
  // Bilingual term mappings for technical concepts
  static bilingualMappings = {
    // Operation & Procedures
    'procedimientos': ['procedures', 'protocols', 'methods', 'operations'],
    'procedimientos de operación': ['operation procedures', 'operating procedures', 'operational protocols'],
    'operación': ['operation', 'operation procedures', 'operating'],
    'operaciones': ['operations', 'operating procedures', 'operational'],
    
    // Components
    'componentes': ['components', 'parts', 'elements', 'units'],
    'componentes hidráulicos': ['hydraulic components', 'hydraulic parts', 'hydraulic elements'],
    'componentes neumáticos': ['pneumatic components', 'pneumatic parts', 'pneumatic elements'],
    'componentes eléctricos': ['electrical components', 'electrical parts', 'electrical elements'],
    
    // Hydraulics
    'hidráulico': ['hydraulic', 'hydraulics', 'fluid power', 'fluid systems'],
    'hidráulicos': ['hydraulic', 'hydraulics', 'fluid power', 'fluid systems'],
    'sistemas hidráulicos': ['hydraulic systems', 'fluid power systems', 'hydraulic circuits'],
    
    // Pneumatics
    'neumático': ['pneumatic', 'pneumatics', 'air systems', 'compressed air'],
    'neumáticos': ['pneumatic', 'pneumatics', 'air systems', 'compressed air'],
    'sistemas neumáticos': ['pneumatic systems', 'air power systems', 'pneumatic circuits'],
    
    // Electrical
    'eléctrico': ['electrical', 'electric', 'electrical systems', 'electrical circuits'],
    'eléctricos': ['electrical', 'electric', 'electrical systems', 'electrical circuits'],
    'sistemas eléctricos': ['electrical systems', 'electrical circuits', 'electrical power'],
    
    // Maintenance
    'mantenimiento': ['maintenance', 'servicing', 'upkeep', 'care'],
    'mantenimiento preventivo': ['preventive maintenance', 'preventative maintenance', 'scheduled maintenance'],
    'mantenimiento correctivo': ['corrective maintenance', 'repair maintenance', 'fix maintenance'],
    
    // Safety
    'seguridad': ['safety', 'security', 'protection', 'safeguarding'],
    'protocolos de seguridad': ['safety protocols', 'safety procedures', 'safety guidelines'],
    'procedimientos de seguridad': ['safety procedures', 'safety protocols', 'safety guidelines'],
    
    // Controls
    'control': ['control', 'controls', 'control systems', 'automation'],
    'controles': ['control', 'controls', 'control systems', 'automation'],
    'sistemas de control': ['control systems', 'automation systems', 'control circuits'],
    
    // PLC & Automation
    'plc': ['plc', 'programmable logic controller', 'automation', 'control systems'],
    'automatización': ['automation', 'automated systems', 'control systems', 'plc'],
    'programación': ['programming', 'programming procedures', 'code development', 'software'],
    
    // Equipment
    'equipos': ['equipment', 'machinery', 'devices', 'tools'],
    'maquinaria': ['machinery', 'equipment', 'industrial equipment', 'machines'],
    'dispositivos': ['devices', 'equipment', 'tools', 'instruments']
  };

  // Search query in both languages
  static searchBilingual(query, resources) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Direct search in original language
    const directResults = this.searchDirect(queryLower, resources);
    results.push(...directResults);
    
    // Search using bilingual mappings
    const bilingualResults = this.searchWithMappings(queryLower, resources);
    results.push(...bilingualResults);
    
    // Search using AI-generated bilingual terms from PDFs
    const aiResults = this.searchWithAITerms(queryLower, resources);
    results.push(...aiResults);
    
    // Remove duplicates and return
    return this.removeDuplicates(results);
  }

  // Direct search in original language
  static searchDirect(query, resources) {
    return resources.filter(resource => {
      const searchableText = [
        resource.title?.toLowerCase() || '',
        resource.description?.toLowerCase() || '',
        resource.content?.toLowerCase() || '',
        ...(resource.topics || []).map(topic => topic.toLowerCase())
      ].join(' ');
      
      return searchableText.includes(query);
    });
  }

  // Search using bilingual mappings
  static searchWithMappings(query, resources) {
    const results = [];
    
    // Find matching bilingual terms
    Object.entries(this.bilingualMappings).forEach(([spanishTerm, englishTerms]) => {
      if (query.includes(spanishTerm) || spanishTerm.includes(query)) {
        // Search with English equivalents
        englishTerms.forEach(englishTerm => {
          const englishResults = this.searchDirect(englishTerm, resources);
          results.push(...englishResults);
        });
      }
    });
    
    // Reverse search: English to Spanish
    Object.entries(this.bilingualMappings).forEach(([spanishTerm, englishTerms]) => {
      englishTerms.forEach(englishTerm => {
        if (query.includes(englishTerm) || englishTerm.includes(query)) {
          // Search with Spanish equivalents
          const spanishResults = this.searchDirect(spanishTerm, resources);
          results.push(...spanishResults);
        }
      });
    });
    
    return results;
  }

  // Remove duplicate resources
  static removeDuplicates(resources) {
    const seen = new Set();
    return resources.filter(resource => {
      if (seen.has(resource.id)) {
        return false;
      }
      seen.add(resource.id);
      return true;
    });
  }

  // Get bilingual suggestions for a query
  static getBilingualSuggestions(query) {
    const suggestions = [];
    const queryLower = query.toLowerCase();
    
    Object.entries(this.bilingualMappings).forEach(([spanishTerm, englishTerms]) => {
      if (spanishTerm.includes(queryLower) || queryLower.includes(spanishTerm)) {
        suggestions.push({
          original: spanishTerm,
          translations: englishTerms,
          type: 'spanish-to-english'
        });
      }
      
      englishTerms.forEach(englishTerm => {
        if (englishTerm.includes(queryLower) || queryLower.includes(englishTerm)) {
          suggestions.push({
            original: englishTerm,
            translations: [spanishTerm],
            type: 'english-to-spanish'
          });
        }
      });
    });
    
    return suggestions;
  }

  // Search using AI-generated bilingual terms from PDFs
  static searchWithAITerms(query, resources) {
    const results = [];
    
    // Find resources that have AI-generated bilingual terms
    resources.forEach(resource => {
      if (resource.bilingualTerms && typeof resource.bilingualTerms === 'object') {
        // Search in AI-generated bilingual terms
        Object.entries(resource.bilingualTerms).forEach(([term, translations]) => {
          const termLower = term.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Check if query matches the term or any of its translations
          if (termLower.includes(queryLower) || queryLower.includes(termLower)) {
            results.push(resource);
            return; // Add resource only once per match
          }
          
          // Check translations
          if (Array.isArray(translations)) {
            translations.forEach(translation => {
              const translationLower = translation.toLowerCase();
              if (translationLower.includes(queryLower) || queryLower.includes(translationLower)) {
                results.push(resource);
                return; // Add resource only once per match
              }
            });
          }
        });
      }
    });
    
    return results;
  }

  // Enhanced search with context
  static searchWithContext(query, resources, context = {}) {
    const results = this.searchBilingual(query, resources);
    
    // Apply context filters if available
    if (context.category) {
      return results.filter(resource => 
        resource.category === context.category || 
        resource.topics?.includes(context.category)
      );
    }
    
    return results;
  }
} 