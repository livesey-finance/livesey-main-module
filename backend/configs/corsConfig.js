const corsHeaders = {
  // origin: ['https://trusteddomain.com', 'https://anothertrusteddomain.com'],
  'Access-Control-Allow-Origin': 'https://trusteddomain.com', // or a dynamic value based on request origin
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Max-Age': 2592000, // 30 days
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export const setCorsHeaders = (res) => {
  for (const [header, value] of Object.entries(corsHeaders)) {
    res.setHeader(header, value);
  }
};
