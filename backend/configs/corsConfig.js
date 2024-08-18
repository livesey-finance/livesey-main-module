export const corsConfig = {
  // origin: ['https://trusteddomain.com', 'https://anothertrusteddomain.com'],
  origin: ["*"], // HAVE TO BE CHANGED
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
