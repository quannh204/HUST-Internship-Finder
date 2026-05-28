import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HUST Internship Finder API',
      version: '1.0.0',
      description: 'API docs for job listing, filtering, search, and detail endpoints.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Local development server',
      },
    ],
    components: {
      parameters: {
        PageParam: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Trang hien tai',
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'So ban ghi tren moi trang',
        },
      },
      schemas: {
        Skill: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        Major: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            companyName: { type: 'string' },
            title: { type: 'string' },
            jobType: { type: 'string', enum: ['PART_TIME', 'FULL_TIME'] },
            description: { type: 'string' },
            requirements: { type: 'string' },
            skills: { type: 'array', items: { $ref: '#/components/schemas/Skill' } },
            majors: { type: 'array', items: { $ref: '#/components/schemas/Major' } },
            foreignLanguageAbility: { type: 'string' },
            location: { type: 'string' },
            workType: { type: 'string', enum: ['OFFLINE', 'REMOTE', 'HYBRID'] },
            experience: { type: 'string' },
            fresherAccepted: { type: 'boolean' },
            salary: { type: 'string' },
            deadline: { type: 'string', format: 'date-time' },
            sourceLink: { type: 'string' },
            status: { type: 'string', enum: ['ACTIVE', 'EXPIRED', 'DRAFT'] },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
        PaginatedJobsResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Job' },
            },
            pagination: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});
