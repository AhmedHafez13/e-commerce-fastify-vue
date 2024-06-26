// General schemas
const idOptions = {
  type: 'integer',
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
};

// Request Schemas
export const singleIdParamSchema = {
  params: {
    type: 'object',
    properties: { id: idOptions },
  },
};

export const categoryDataSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 255 },
      picture: { type: 'string', maxLength: 512 },
      parentId: idOptions,
    },
    required: ['name'],
  },
};
