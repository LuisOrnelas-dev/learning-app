// Servicio para gestionar recursos internos
export class InternalResourceService {
  // Simular base de datos de recursos internos
  static internalResources = [
    {
      id: 'int-001',
      topic: 'PLC Programming',
      type: 'video',
      title: 'PLC Programming Fundamentals',
      description: 'Internal training video on PLC programming basics',
      url: '/internal-resources/videos/plc-fundamentals.mp4',
      uploadedBy: 'admin',
      uploadDate: '2024-01-15',
      fileSize: '45MB',
      duration: '25 min'
    },
    {
      id: 'int-002',
      topic: 'Electrical Systems',
      type: 'pdf',
      title: 'Electrical Safety Manual',
      description: 'Internal electrical safety procedures and guidelines',
      url: '/internal-resources/pdfs/electrical-safety-manual.pdf',
      uploadedBy: 'admin',
      uploadDate: '2024-01-10',
      fileSize: '2.3MB',
      pages: 45
    },
    {
      id: 'int-003',
      topic: 'Hydraulics',
      type: 'interactive',
      title: 'Hydraulic System Simulator',
      description: 'Internal interactive simulator for hydraulic systems',
      url: '/internal-resources/simulators/hydraulic-simulator.html',
      uploadedBy: 'admin',
      uploadDate: '2024-01-20',
      fileSize: '15MB'
    }
  ];

  // Obtener todos los recursos internos
  static getAllResources() {
    return this.internalResources;
  }

  // Buscar recursos por tema
  static getResourcesByTopic(topic) {
    return this.internalResources.filter(resource => 
      resource.topic.toLowerCase().includes(topic.toLowerCase())
    );
  }

  // Buscar recursos por tipo
  static getResourcesByType(type) {
    return this.internalResources.filter(resource => 
      resource.type === type
    );
  }

  // Buscar recursos por palabras clave
  static searchResources(keywords) {
    const searchTerms = keywords.toLowerCase().split(' ');
    return this.internalResources.filter(resource => {
      const searchableText = `${resource.title} ${resource.description} ${resource.topic}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  }

  // Agregar nuevo recurso interno
  static addResource(resource) {
    const newResource = {
      id: `int-${Date.now()}`,
      ...resource,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    this.internalResources.push(newResource);
    return newResource;
  }

  // Eliminar recurso interno
  static removeResource(id) {
    const index = this.internalResources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.internalResources.splice(index, 1);
      return true;
    }
    return false;
  }

  // Obtener estadísticas de recursos internos
  static getStats() {
    const total = this.internalResources.length;
    const byType = this.internalResources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      byType,
      totalSize: this.internalResources.reduce((sum, r) => sum + (parseFloat(r.fileSize) || 0), 0)
    };
  }
} 