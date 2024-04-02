// General schemas
const positiveInt = {
  type: 'integer',
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
};

// Request Schemas
export const paginationSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: positiveInt,
      pageSize: positiveInt,
    },
  },
};

export const singleIdParamSchema = {
  params: {
    type: 'object',
    properties: { id: positiveInt },
  },
};

export const productDataSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 255 },
      picture: { type: 'string', maxLength: 512 },
      categoryId: positiveInt,
    },
    required: ['name', 'categoryId'],
  },
};
