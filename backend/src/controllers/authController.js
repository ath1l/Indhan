// authController.js - mocked for prototype
exports.register = async (req, res) => {
  res.status(201).json({ message: "User registered successfully", user: { id: "mock_user_id", name: req.body.name } });
};

exports.login = async (req, res) => {
  res.status(200).json({ token: "mock_jwt_token", user: { id: "mock_user_id", name: req.body.email } });
};

exports.getUserProfile = async (req, res) => {
  res.status(200).json({ id: req.params.userId, name: "Test User", email: "test@example.com" });
};
