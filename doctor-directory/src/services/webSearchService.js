// Servicio para buscar recursos reales de la web
export class WebSearchService {
  // YouTube Data API Key - necesitarás configurar esto
  static YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';
  
  // Google Custom Search API Key - necesitarás configurar esto
  static GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';
  static GOOGLE_CSE_ID = process.env.REACT_APP_GOOGLE_CSE_ID || '';

  // Buscar videos en YouTube
  static async searchYouTube(query, maxResults = 3, language = 'en') {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API Key no configurada');
      return [];
    }

    try {
      // Mejorar la búsqueda con términos más específicos según idioma y tema
      let enhancedQuery;
      if (language === 'es') {
        enhancedQuery = `${query} capacitación industrial tutorial español mantenimiento`;
      } else {
        enhancedQuery = `${query} industrial training tutorial maintenance`;
      }
      
      // Agregar términos específicos según el tema para mejorar relevancia
      const topicKeywords = this.extractTopicKeywords(query);
      if (topicKeywords.length > 0) {
        enhancedQuery = `${enhancedQuery} ${topicKeywords.join(' ')}`;
      }
      
      console.log(`🔍 Enhanced YouTube search query: ${enhancedQuery}`);
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(enhancedQuery)}&type=video&maxResults=${maxResults}&key=${this.YOUTUBE_API_KEY}&videoDuration=medium&relevanceLanguage=${language}&order=relevance`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filtrar resultados por relevancia del título
      const relevantVideos = data.items
        .map(item => ({
          title: item.snippet.title,
          description: item.snippet.description,
          videoId: item.id.videoId,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?rel=0&modestbranding=1`,
          type: 'video',
          thumbnail: item.snippet.thumbnails?.medium?.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          relevanceScore: this.calculateRelevanceScore(query, item.snippet.title, item.snippet.description)
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
      
      console.log(`✅ Found ${relevantVideos.length} relevant videos for: ${query}`);
      return relevantVideos;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }

  // Extraer palabras clave del tema para mejorar la búsqueda
  static extractTopicKeywords(query) {
    const queryLower = query.toLowerCase();
    const keywords = [];
    
    // Palabras clave específicas por tema
    if (queryLower.includes('lockout') || queryLower.includes('tagout') || queryLower.includes('loto')) {
      keywords.push('safety', 'lockout', 'tagout', 'maintenance', 'procedures');
    } else if (queryLower.includes('plc') || queryLower.includes('siemens')) {
      keywords.push('plc', 'programming', 'automation', 'control', 'siemens');
    } else if (queryLower.includes('hydraulic') || queryLower.includes('hidráulico')) {
      keywords.push('hydraulic', 'fluid', 'power', 'pump', 'valve');
    } else if (queryLower.includes('pneumatic') || queryLower.includes('neumático')) {
      keywords.push('pneumatic', 'air', 'compressor', 'cylinder', 'valve');
    } else if (queryLower.includes('electrical') || queryLower.includes('eléctrico')) {
      keywords.push('electrical', 'circuit', 'wiring', 'control', 'safety');
    } else if (queryLower.includes('troubleshooting') || queryLower.includes('diagnóstico')) {
      keywords.push('troubleshooting', 'diagnostic', 'repair', 'maintenance', 'problems');
    }
    
    return keywords;
  }

  // Calcular puntuación de relevancia del video
  static calculateRelevanceScore(query, title, description) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const titleLower = title.toLowerCase();
    const descriptionLower = description.toLowerCase();
    
    let score = 0;
    
    // Puntuación por coincidencias en el título
    queryWords.forEach(word => {
      if (titleLower.includes(word)) score += 3;
      if (descriptionLower.includes(word)) score += 1;
    });
    
    // Bonus por coincidencias exactas
    if (titleLower.includes(query.toLowerCase())) score += 5;
    
    // Penalización por palabras irrelevantes
    const irrelevantWords = ['music', 'song', 'game', 'movie', 'entertainment'];
    irrelevantWords.forEach(word => {
      if (titleLower.includes(word) || descriptionLower.includes(word)) score -= 2;
    });
    
    return Math.max(0, score);
  }

  // Buscar documentos/PDFs con Google Custom Search
  static async searchGoogleDocs(query, maxResults = 3) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google API Keys no configuradas');
      return [];
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.GOOGLE_API_KEY}&cx=${this.GOOGLE_CSE_ID}&q=${encodeURIComponent(query + ' filetype:pdf')}&num=${maxResults}`
      );
      
      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json();
      return (data.items || []).map(item => ({
        title: item.title,
        description: item.snippet,
        url: item.link,
        type: 'pdf'
      }));
    } catch (error) {
      console.error('Error searching Google:', error);
      return [];
    }
  }

  // Buscar recursos interactivos (simuladores, cursos online)
  static async searchInteractiveResources(query, maxResults = 2) {
    if (!this.GOOGLE_API_KEY || !this.GOOGLE_CSE_ID) {
      console.warn('Google API Keys no configuradas');
      return [];
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.GOOGLE_API_KEY}&cx=${this.GOOGLE_CSE_ID}&q=${encodeURIComponent(query + ' simulator interactive training')}&num=${maxResults}`
      );
      
      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json();
      return (data.items || []).map(item => ({
        title: item.title,
        description: item.snippet,
        url: item.link,
        type: 'interactive'
      }));
    } catch (error) {
      console.error('Error searching interactive resources:', error);
      return [];
    }
  }

  // Función principal para buscar recursos externos
  static async searchExternalResources(topic, resourceType = 'all', maxResults = 3) {
    const searchQuery = `${topic} industrial training maintenance`;
    
    try {
      let results = [];
      
      switch (resourceType) {
        case 'video':
          results = await this.searchYouTube(searchQuery, maxResults);
          break;
        case 'pdf':
          results = await this.searchGoogleDocs(searchQuery, maxResults);
          break;
        case 'interactive':
          results = await this.searchInteractiveResources(searchQuery, maxResults);
          break;
        case 'all':
        default:
          const [videos, pdfs, interactive] = await Promise.all([
            this.searchYouTube(searchQuery, Math.ceil(maxResults / 3)),
            this.searchGoogleDocs(searchQuery, Math.ceil(maxResults / 3)),
            this.searchInteractiveResources(searchQuery, Math.ceil(maxResults / 3))
          ]);
          results = [...videos, ...pdfs, ...interactive];
          break;
      }
      
      return results;
    } catch (error) {
      console.error('Error searching external resources:', error);
      return [];
    }
  }

  // Función para buscar un recurso específico en internet
  static async findSpecificResource(title, type, topic) {
    try {
      const searchQuery = `${title} ${topic} industrial training`;
      let results = [];
      
      switch (type) {
        case 'video':
          results = await this.searchYouTube(searchQuery, 1);
          break;
        case 'pdf':
          results = await this.searchGoogleDocs(searchQuery, 1);
          break;
        case 'interactive':
          results = await this.searchInteractiveResources(searchQuery, 1);
          break;
        default:
          // Si no se especifica tipo, buscar en todos
          const [videos, pdfs, interactive] = await Promise.all([
            this.searchYouTube(searchQuery, 1),
            this.searchGoogleDocs(searchQuery, 1),
            this.searchInteractiveResources(searchQuery, 1)
          ]);
          results = [...videos, ...pdfs, ...interactive];
          break;
      }
      
      return results.length > 0 ? results[0].url : null;
    } catch (error) {
      console.error('Error finding specific resource:', error);
      return null;
    }
  }

  // Función para enriquecer el markdown con recursos externos
  static async enrichWithExternalResources(aiPlanMarkdown, formData) {
    if (formData.knowledgeSource !== 'public' && formData.knowledgeSource !== 'both') {
      return aiPlanMarkdown;
    }

    let enriched = aiPlanMarkdown;
    
    // Extraer módulos del markdown
    const moduleRegex = /##\s*(.+?)(?=\n##|\n$)/gs;
    const modules = [...aiPlanMarkdown.matchAll(moduleRegex)];
    
    for (const moduleMatch of modules) {
      const moduleTitle = moduleMatch[1].trim();
      
      // Buscar recursos externos para este módulo
      const externalResources = await this.searchExternalResources(moduleTitle, 'all', 3);
      
      if (externalResources.length > 0) {
        // Reemplazar o agregar recursos en el módulo
        const moduleContent = moduleMatch[0];
        const resourceList = externalResources.map(resource => 
          `- **${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}:** [${resource.title}](${resource.url}) - ${resource.description}`
        ).join('\n');
        
        // Buscar si ya hay una lista de recursos y reemplazarla
        const resourceSectionRegex = /(\n- \*\*.*?\*\*:.*?\n)+/gs;
        if (resourceSectionRegex.test(moduleContent)) {
          enriched = enriched.replace(moduleContent, 
            moduleContent.replace(resourceSectionRegex, `\n${resourceList}\n`)
          );
        } else {
          // Agregar nueva sección de recursos
          enriched = enriched.replace(moduleContent, 
            `${moduleContent}\n\n${resourceList}\n`
          );
        }
      }
    }
    
    return enriched;
  }
} 