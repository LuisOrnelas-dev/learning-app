import resources from './resources.json';
import { WebSearchService } from './webSearchService';
import { InternalResourceService } from './internalResourceService';
import { ContentGenerationService } from './contentGenerationService';

export class ResourceEnrichmentService {
  // Enriquecer recursos con enlaces reales (locales + internet)
  static async enrichResourcesWithRealLinks(aiPlanMarkdown, formData) {
    let enriched = aiPlanMarkdown;
    
    // Primero enriquecer con recursos locales
    enriched = this.enrichWithLocalResources(enriched, formData);
    
    // Luego enriquecer con recursos de internet si es necesario
    if (formData?.knowledgeSource === 'public' || formData?.knowledgeSource === 'both') {
      enriched = await this.enrichWithInternetResources(enriched, formData);
    }
    
    return enriched;
  }

  // Enriquecer con recursos locales
  static async enrichWithLocalResources(aiPlanMarkdown, formData) {
    let enriched = aiPlanMarkdown;
    
    // Determinar qué recursos usar según knowledgeSource
    let resourceList = [];
    if (formData?.knowledgeSource === 'internal') {
      resourceList = InternalResourceService.getAllResources();
    } else if (formData?.knowledgeSource === 'public') {
      resourceList = resources;
    } else {
      // Both: combinar recursos
      resourceList = [...InternalResourceService.getAllResources(), ...resources];
    }
    
    // Extraer todos los recursos del markdown que no tienen enlaces
    const resourceRegex = /\*\*(video|pdf|interactive)\*\*:?\s*([^\n]+?)(?:\n|$)/gi;
    const matches = [...aiPlanMarkdown.matchAll(resourceRegex)];
    
    for (const match of matches) {
      const type = match[1].toLowerCase();
      const title = match[2].trim();
      
      // Si ya tiene un enlace, saltar
      if (title.includes('http') || title.includes('[')) continue;
      
      // Buscar el mejor recurso local que coincida
      let bestMatch = this.findBestLocalMatch(title, type, resourceList);
      
      // Si no se encontró coincidencia del tipo solicitado, buscar en cualquier tipo
      if (!bestMatch) {
        console.log(`No se encontró recurso ${type} para "${title}", buscando en cualquier tipo...`);
        bestMatch = this.findBestLocalMatch(title, 'any', resourceList);
      }
      
      // GARANTIZAR que siempre haya un enlace
      if (bestMatch) {
        // Reemplazar el recurso sin enlace con uno que tenga enlace
        const oldText = `**${type}:** ${title}`;
        const newText = `**${type}:** [${title}](${bestMatch.url})`;
        enriched = enriched.replace(oldText, newText);
        
        console.log(`Enriquecido con recurso local: ${title} -> ${bestMatch.url} (tipo original: ${type}, tipo encontrado: ${bestMatch.type})`);
      } else {
          // GENERATE REAL CONTENT when resource is not found
  console.log(`Generating real content for: ${title} (${type})`);
        
        try {
          // Extraer tema del título
          const topics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
          const foundTopic = topics.find(topic => title.toLowerCase().includes(topic)) || 'industrial';
          
          // Para videos, buscar en YouTube primero
          if (type === 'video') {
            console.log(`Buscando video real en YouTube para: ${title}`);
            const youtubeResults = await WebSearchService.searchYouTube(title, 1);
            
            if (youtubeResults.length > 0) {
              const video = youtubeResults[0];
              const oldText = `**${type}:** ${title}`;
              const newText = `**${type}:** [${title}](youtube:${video.videoId})`;
              enriched = enriched.replace(oldText, newText);
              
              console.log(`VIDEO REAL ENCONTRADO: ${title} -> YouTube ID: ${video.videoId}`);
              console.log('Video details:', video);
              continue;
            }
          }
          
          // For PDFs, ALWAYS generate real content
          if (type === 'pdf') {
            console.log(`Generating real content for PDF: ${title}`);
            const generatedContent = await ContentGenerationService.generateRealContent(title, type, foundTopic, formData);
            
            if (generatedContent) {
              const oldText = `**${type}:** ${title}`;
              const newText = `**${type}:** [${title}](generated:${encodeURIComponent(generatedContent.content)})`;
              enriched = enriched.replace(oldText, newText);
              
              console.log(`PDF GENERADO: ${title} con ${generatedContent.content.length} caracteres`);
              continue;
            }
          }
          
          // If not found on internet, generate content
          console.log(`Generating real content for: ${title} (${type})`);
          const generatedContent = await ContentGenerationService.generateRealContent(title, type, foundTopic, formData);
          
          if (generatedContent) {
            const oldText = `**${type}:** ${title}`;
            const newText = `**${type}:** [${title}](${generatedContent.url})`;
            enriched = enriched.replace(oldText, newText);
            
            console.log(`CONTENIDO GENERADO: ${title} -> ${generatedContent.url}`);
          } else {
            // FALLBACK FINAL: Asignar un recurso genérico
            const fallbackResource = resourceList.find(r => r.type === type) || resourceList[0];
            if (fallbackResource) {
              const oldText = `**${type}:** ${title}`;
              const newText = `**${type}:** [${title}](${fallbackResource.url})`;
              enriched = enriched.replace(oldText, newText);
              
              console.log(`FALLBACK: Asignado recurso genérico para ${title} -> ${fallbackResource.url}`);
            }
          }
        } catch (error) {
          console.error('Error generating content:', error);
          // FALLBACK FINAL: Asignar un recurso genérico
          const fallbackResource = resourceList.find(r => r.type === type) || resourceList[0];
          if (fallbackResource) {
            const oldText = `**${type}:** ${title}`;
            const newText = `**${type}:** [${title}](${fallbackResource.url})`;
            enriched = enriched.replace(oldText, newText);
            
            console.log(`FALLBACK: Asignado recurso genérico para ${title} -> ${fallbackResource.url}`);
          }
        }
      }
    }
    
    return enriched;
  }

  // Encontrar el mejor recurso local que coincida
  static findBestLocalMatch(title, type, resourceList) {
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const cleanTitle = normalize(title);
    
    // Estrategia 1: Búsqueda por palabras clave principales
    const titleWords = cleanTitle.split(' ').filter(word => word.length > 2);
    const typeMatches = type === 'any' ? resourceList : resourceList.filter(r => r.type === type);
    
    // Buscar recursos que contengan palabras clave del título
    for (const word of titleWords) {
      const matches = typeMatches.filter(r => {
        const rTitle = normalize(r.title);
        const rTopic = normalize(r.topic);
        return rTitle.includes(word) || rTopic.includes(word);
      });
      
      if (matches.length > 0) {
        // Retornar el que tenga más palabras en común
        return matches.sort((a, b) => {
          const aTitle = normalize(a.title);
          const bTitle = normalize(b.title);
          const aMatches = titleWords.filter(word => aTitle.includes(word)).length;
          const bMatches = titleWords.filter(word => bTitle.includes(word)).length;
          return bMatches - aMatches;
        })[0];
      }
    }
    
    // Estrategia 2: Búsqueda por tema general
    const topics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
    const foundTopic = topics.find(topic => cleanTitle.includes(topic));
    
    if (foundTopic) {
      const topicMatches = typeMatches.filter(r => normalize(r.topic).includes(foundTopic));
      if (topicMatches.length > 0) {
        return topicMatches[0];
      }
    }
    
    // Estrategia 3: Cualquier recurso del tipo solicitado
    if (typeMatches.length > 0) {
      return typeMatches[0];
    }
    
    // Estrategia 4: FALLBACK GARANTIZADO - Buscar en cualquier tipo si no hay del tipo solicitado
    const allMatches = resourceList.filter(r => {
      const rTitle = normalize(r.title);
      const rTopic = normalize(r.topic);
      return titleWords.some(word => rTitle.includes(word) || rTopic.includes(word));
    });
    
    if (allMatches.length > 0) {
      return allMatches[0];
    }
    
    // Estrategia 5: ÚLTIMO FALLBACK - Cualquier recurso del tema más cercano
    if (foundTopic) {
      const anyTopicMatches = resourceList.filter(r => normalize(r.topic).includes(foundTopic));
      if (anyTopicMatches.length > 0) {
        return anyTopicMatches[0];
      }
    }
    
    // Estrategia 6: FALLBACK FINAL - Cualquier recurso disponible
    return resourceList[0] || null;
  }

  // Enriquecer con recursos de internet
  static async enrichWithInternetResources(aiPlanMarkdown, formData) {
    let enriched = aiPlanMarkdown;
    
    // Extraer recursos sin enlaces del markdown
    const resourceRegex = /\*\*(video|pdf|interactive)\*\*:?\s*([^\n]+?)(?:\n|$)/gi;
    const matches = [...aiPlanMarkdown.matchAll(resourceRegex)];
    
    for (const match of matches) {
      const type = match[1].toLowerCase();
      const title = match[2].trim();
      
      // Si ya tiene un enlace, saltar
      if (title.includes('http') || title.includes('[')) continue;
      
      // Buscar en internet
      try {
        const topics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
        const foundTopic = topics.find(topic => title.toLowerCase().includes(topic)) || 'industrial';
        
        const internetUrl = await WebSearchService.findSpecificResource(title, type, foundTopic);
        
        if (internetUrl) {
          // Reemplazar el recurso sin enlace con uno que tenga enlace
          const oldText = `**${type}:** ${title}`;
          const newText = `**${type}:** [${title}](${internetUrl})`;
          enriched = enriched.replace(oldText, newText);
          
          console.log(`Enriquecido con enlace de internet: ${title} -> ${internetUrl}`);
        }
      } catch (error) {
        console.error(`Error buscando en internet para ${title}:`, error);
      }
    }
    
    return enriched;
  }

  // Función para obtener enlace real de un recurso específico
  static async getRealResourceLink(title, type, formData) {
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const cleanNorm = normalize(title);
    
    // Buscar en recursos locales primero
    let foundUrl = this.searchInLocalResources(title, type, formData);
    
    // Si no se encontró y es 'public' o 'both', buscar en internet
    if (!foundUrl && (formData?.knowledgeSource === 'public' || formData?.knowledgeSource === 'both')) {
      try {
        const topics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
        const foundTopic = topics.find(topic => cleanNorm.includes(topic)) || 'industrial';
        
        foundUrl = await WebSearchService.findSpecificResource(title, type, foundTopic);
        console.log(`Buscando en internet: ${title} (${type}) - ${foundTopic} -> ${foundUrl}`);
      } catch (error) {
        console.error('Error buscando en internet:', error);
      }
    }
    
    return foundUrl;
  }

  // Buscar en recursos locales
  static searchInLocalResources(title, type, formData) {
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const cleanNorm = normalize(title);
    
    const searchInResources = (resourceList) => {
      // Estrategia 1: Búsqueda exacta por tipo
      let match = resourceList.find(r => {
        if (r.type !== type) return false;
        const rNorm = normalize(r.title);
        const tWords = cleanNorm.split(' ').filter(word => word.length > 2);
        const rWords = rNorm.split(' ').filter(word => word.length > 2);
        
        // Coincidencia de palabras clave
        const keywordMatches = tWords.filter(word => 
          rWords.some(rWord => rWord.includes(word) || word.includes(rWord))
        );
        
        // Búsqueda en topic
        const topicNorm = normalize(r.topic);
        const topicMatches = tWords.some(word => topicNorm.includes(word));
        
        return keywordMatches.length >= 1 || topicMatches;
      });
      
      if (match) return match;
      
      // Estrategia 2: Búsqueda flexible por tipo similar
      if (type === 'video') {
        match = resourceList.find(r => r.type === 'video' && 
          (cleanNorm.includes('tutorial') || cleanNorm.includes('guide') || cleanNorm.includes('basics')));
      } else if (type === 'pdf') {
        match = resourceList.find(r => r.type === 'pdf' && 
          (cleanNorm.includes('manual') || cleanNorm.includes('guide') || cleanNorm.includes('document')));
      } else if (type === 'interactive') {
        match = resourceList.find(r => r.type === 'interactive' && 
          (cleanNorm.includes('simulator') || cleanNorm.includes('practice') || cleanNorm.includes('exercise')));
      }
      
      if (match) return match;
      
      // Estrategia 3: Búsqueda por tema general
      const generalTopics = ['plc', 'electrical', 'mechanical', 'hydraulics', 'pneumatics', 'safety', 'controls', 'automation', 'manufacturing'];
      const foundTopic = generalTopics.find(topic => cleanNorm.includes(topic));
      
      if (foundTopic) {
        match = resourceList.find(r => 
          normalize(r.topic).includes(foundTopic) && r.type === type
        );
      }
      
      // Estrategia 4: Búsqueda por tipo sin restricción de tema (fallback)
      if (!match) {
        match = resourceList.find(r => r.type === type);
      }
      
      return match;
    };
    
            // Search according to form configuration
    if (formData?.knowledgeSource === 'internal') {
      const internalMatch = searchInResources(InternalResourceService.getAllResources());
      return internalMatch?.url || null;
    } else if (formData?.knowledgeSource === 'public') {
      const externalMatch = searchInResources(resources);
      return externalMatch?.url || null;
    } else {
      // Both o default: primero internos, luego externos
      const internalMatch = searchInResources(InternalResourceService.getAllResources());
      if (internalMatch) return internalMatch.url;
      
      const externalMatch = searchInResources(resources);
      return externalMatch?.url || null;
    }
  }
} 