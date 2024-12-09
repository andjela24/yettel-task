/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */
const { authentication, restrictTo } = require("../controllers/authController");
const { updateUser } = require("../controllers/userController");

const router = require("express").Router();

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update a user's details by their ID. Only the user or an admin can perform this action.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 *         description: Bearer token for authorization
 *       - in: body
 *         name: user
 *         required: true
 *         description: User details to update
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               minLength: 8
 *             confirmPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router
  .route("/:id")
  .patch(authentication, restrictTo("BASIC", "ADMIN"), updateUser);

module.exports = router;
