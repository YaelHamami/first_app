/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - userName
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         userName:
 *           type: string
 *           description: The user username
 *         firstName:
 *           type: string
 *           description: The user first name
 *         lastName:
 *           type: string
 *           description: The user last name
 *         phone_number:
 *           type: string
 *           description: The user phone number
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: The user date of birth
 *         gender:
 *           type: string
 *           description: The user gender
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *         userName: 'bobMan'
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - ownerId
 *       properties:
 *         title:
 *           type: string
 *           description: The post title
 *         content:
 *           type: string
 *           description: The post content
 *         ownerId:
 *           type: string
 *           description: The ID of the user who owns the post
 *       example:
 *         title: 'My First Post'
 *         content: 'This is the content of my first post.'
 *         ownerId: '648df123abc456'
 *     Comment:
 *       type: object
 *       required:
 *         - postId
 *         - content
 *         - ownerId
 *       properties:
 *         postId:
 *           type: string
 *           description: The ID of the post being commented on
 *         content:
 *           type: string
 *           description: The comment text
 *         ownerId:
 *           type: string
 *           description: The ID of the user who made the comment
 *       example:
 *         postId: '648df123abc456'
 *         content: 'This is a comment on the post.'
 *         ownerId: '123abc456def789'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Register success returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: The access token
 *                 refresh_token:
 *                   type: string
 *                   description: The refresh token
 *                 _id:
 *                   type: string
 *                   description: The user id
 *               example:
 *                 access_token: 'bob@gmail.com'
 *                 refresh_token: '123456'
 *                 _id: "adfasdfasdfasdfsd"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out a user
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 */

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Get a new access token using the refresh token
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieves a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Creates a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Retrieves a single post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Updates a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Deletes a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Creates a new comment on a post
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   get:
 *     summary: Retrieves a single comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Updates a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Deletes a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieves a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Retrieves a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Updates a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Deletes a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

