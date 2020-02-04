module.exports = {
  origin: process.env.CORS_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
};