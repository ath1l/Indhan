/**
 * Mock Auth Middleware for prototype
 * In a real app, this would verify JWT tokens.
 */
const authMiddleware = (req, res, next) => {
  // For the hackathon prototype, we might just bypass strict checking
  // or mock a user context.
  req.user = {
    id: 'mock_user_id',
    name: 'Test User'
  };
  next();
};

module.exports = authMiddleware;
