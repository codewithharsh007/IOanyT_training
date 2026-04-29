// Auth routes.
const express = require("express");
const {
  loginRateLimiter,
  registerRateLimiter,
  authRateLimiter,
} = require("../middleware/rateLimiter");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const authService = require("../services/authService");
const { successResponse } = require("../utils/response");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/register",
  registerRateLimiter,
  validateRegister,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const data = await authService.registerUser(name, email, password);
    return successResponse(
      res,
      201,
      "Registration successful. Please verify your email.",
      data,
    );
  }),
);

router.post(
  "/login",
  loginRateLimiter,
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return successResponse(res, 200, "Login successful", {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  }),
);

router.post(
  "/refresh",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.refreshTokens(refreshToken);
    return successResponse(res, 200, "Token refreshed", {
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }),
);

router.post(
  "/logout",
  protect,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(req.user.userId, refreshToken);
    return successResponse(res, 200, "Logged out successfully", {});
  }),
);

router.post(
  "/forgot-password",
  authRateLimiter,
  validateForgotPassword,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return successResponse(
      res,
      200,
      "If an account exists with this email, a reset link has been sent.",
      {},
    );
  }),
);

router.post(
  "/reset-password",
  authRateLimiter,
  validateResetPassword,
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return successResponse(res, 200, "Password reset successful", {});
  }),
);

router.get(
  "/verify-email",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { token } = req.query;
    await authService.verifyEmail(token);
    return successResponse(res, 200, "Email verified successfully", {});
  }),
);

router.post(
  "/client-portal/accept",
  authRateLimiter,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const data = await authService.acceptClientInvite(token, password);
    return successResponse(res, 200, "Portal access granted", {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  }),
);

module.exports = router;
