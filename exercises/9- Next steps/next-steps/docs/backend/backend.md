# Backend Development Fundamentals

## Introduction to Backend Development

Backend development focuses on the server-side logic, databases, and infrastructure that power web applications. It handles data processing, authentication, authorization, and communication between the client and server. This document covers advanced backend concepts essential for building secure, scalable, and maintainable applications.

### Learning Objectives

- Master authentication and authorization patterns
- Understand relational database design and optimization
- Implement robust security measures for web applications
- Build scalable backend architectures with proper separation of concerns
- Learn logging, monitoring, and configuration management
- Apply data validation and error handling best practices

### The Role of Backend in Modern Web Development

Backend systems serve as the foundation of web applications by:

- Managing data persistence and retrieval
- Handling business logic and processing
- Securing applications through authentication and authorization
- Providing APIs for client-server communication
- Ensuring data integrity and consistency
- Scaling applications to handle increased load
- Monitoring application health and performance

In modern web development, backend systems must be:

- **Secure**: Protecting against common vulnerabilities and attacks
- **Scalable**: Handling growth in users and data
- **Maintainable**: Well-structured and documented code
- **Observable**: Providing insights into system behavior
- **Reliable**: Ensuring high availability and fault tolerance

## Authentication and Authorization

### Understanding Authentication vs Authorization

**Authentication** answers "Who are you?" - verifying the identity of a user.
**Authorization** answers "What can you do?" - determining what actions a user can perform.

### JWT (JSON Web Tokens)

JWT is a compact, URL-safe means of representing claims between two parties.

#### JWT Structure

A JWT consists of three parts separated by dots (`.`):

- **Header**: Contains token type and signing algorithm
- **Payload**: Contains claims (user data)
- **Signature**: Verifies the token hasn't been tampered with

```typescript
// JWT Example (TypeScript)
import jwt from "jsonwebtoken";

// It's a good practice to define an interface for your JWT payload
interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

// Creating a JWT
const payload: JwtPayload = {
  userId: 123,
  email: "user@example.com",
  role: "user",
};

// Use a non-null assertion (!) for environment variables you know are set
const token = jwt.sign(payload, process.env.JWT_SECRET!, {
  expiresIn: "24h",
  issuer: "your-app-name",
});

// Verifying a JWT
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  console.log(decoded.userId); // Access properties in a type-safe way
} catch (error) {
  console.error("Invalid token:", (error as Error).message);
}
```

#### JWT Best Practices

- Use strong, randomly generated secrets
- Set appropriate expiration times
- Include only necessary claims
- Validate tokens on every protected route
- Consider token refresh strategies
- Store sensitive data server-side, not in JWT

### HTTP-only Cookies

HTTP-only cookies provide a secure way to store authentication tokens:

```typescript
// HTTP-only Cookies (TypeScript)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Setting HTTP-only cookie
app.post("/login", async (req: Request, res: Response) => {
  // Authenticate user...
  const token = generateJWT(user); // Assume generateJWT exists

  res.cookie("authToken", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Helps prevent CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({ message: "Logged in successfully" });
});

// Reading HTTP-only cookie
app.get("/profile", authenticateToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// This middleware function now relies on the global Request type.
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as import("./types/express").UserPayload;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
```

### Password Hashing with Argon2

Never store plain text passwords. For modern applications, Argon2 is the recommended password-hashing algorithm. It won the Password Hashing Competition in 2015 and is designed to be resistant to both GPU cracking attacks and side-channel attacks.

```typescript
import argon2 from "argon2";
import { Request, Response } from "express";
import { User } from "./models/User"; // Assuming a User model

// Hashing a password
async function hashPassword(plainPassword: string): Promise<string> {
  // Argon2 handles salt generation automatically
  return await argon2.hash(plainPassword);
}

// Verifying a password
async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  // Note the argument order: hash first, then password
  return await argon2.verify(hashedPassword, plainPassword);
}

// Usage in registration
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Usage in login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateJWT(user); // Assume generateJWT exists
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});
```

### Extending the Express Request Object

To avoid repeatedly casting `req.user` and to get proper type safety across your application, you should extend Express's global `Request` interface.

Create a type definition file (e.g., `src/types/express/index.d.ts`) and add the following. Make sure your `tsconfig.json` includes this file.

```typescript
// src/types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

// Define the shape of your user payload
interface UserPayload extends JwtPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
```

With this in place, `req.user` will be correctly typed in all your middleware and route handlers without needing a custom `AuthenticatedRequest` interface.

### Authentication Middleware

Create reusable middleware for protecting routes:

```typescript
// Authentication Middleware (TypeScript)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// This middleware now uses the globally typed Request object.
// No custom AuthenticatedRequest interface is needed.
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // The type from our global declaration is automatically applied.
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as import("./types/express").UserPayload;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// Usage
app.get(
  "/admin/users",
  authenticateToken,
  requireRole(["admin"]),
  (req, res) => {
    // Only authenticated admins can access this route
    res.json({ users: [] });
  }
);
```

### Role-Based Access Control (RBAC)

Implement a flexible permission system:

```javascript
// Database schema example
const UserSchema = {
  id: "integer",
  email: "string",
  password: "string",
  roles: ["array of role IDs"],
};

const RoleSchema = {
  id: "integer",
  name: "string", // 'admin', 'moderator', 'user'
  permissions: ["array of permission strings"],
};

// Permission checking middleware
const requirePermission = (permission: string) => {
  return async (
    req: Request, // No custom interface needed
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      // req.user is now strongly typed
      const user = await User.findById(req.user.userId).populate("roles");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const hasPermission = user.roles.some((role: any) =>
        role.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: `Permission '${permission}' required`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};

// Usage
app.delete(
  "/posts/:id",
  authenticateToken,
  requirePermission("posts:delete"),
  deletePost
);
```

## Relational Database Design

### Database Schema Design

Proper database design is crucial for performance and maintainability:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Relationships

#### One-to-Many Relationships

```sql
-- One user can have many posts
SELECT u.email, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.author_id;
```

#### Many-to-Many Relationships

```sql
-- Posts and tags relationship
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Query posts with their tags
SELECT p.title, array_agg(t.name) as tags
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, p.title;
```

### Database Indexes

Indexes improve query performance:

```sql
-- Single column index
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Composite index
CREATE INDEX idx_posts_status_created ON posts(status, created_at);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial index
CREATE INDEX idx_active_posts ON posts(created_at)
WHERE status = 'published';
```

### Database Migrations

Version control for database schemas:

```javascript
// Migration: 001_create_users_table.js
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

// Migration: 002_add_user_roles.js
exports.up = function (knex) {
  return knex.schema.table("users", (table) => {
    table.string("role").defaultTo("user");
    table.boolean("is_active").defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", (table) => {
    table.dropColumn("role");
    table.dropColumn("is_active");
  });
};
```

### ORM and Query Builders

Using an ORM like Sequelize or a query builder like Knex:

```typescript
// Sequelize ORM with TypeScript
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Assuming `sequelize` instance is configured elsewhere
const sequelize = new Sequelize("postgres://user:pass@example.com:5432/dbname");

// -- USER MODEL --
interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
}
// `id` is optional during creation
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public passwordHash!: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "User" }
);

// -- POST MODEL --
interface PostAttributes {
  id: number;
  title: string;
  content?: string;
  authorId: number;
}
interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public authorId!: number;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: DataTypes.TEXT,
    authorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Post" }
);

// -- ASSOCIATIONS --
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

// -- QUERY EXAMPLE --
async function getPostsWithAuthors() {
  const postsWithAuthors = await Post.findAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "email"], // Specify which user fields to include
      },
    ],
  });
  return postsWithAuthors;
}
```

## Web Security

### CORS (Cross-Origin Resource Sharing)

Configure CORS properly to control access:

```javascript
const cors = require("cors");

// Basic CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://yourdomain.com"],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Dynamic CORS based on environment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
```

### Input Validation and Sanitization

Validate and sanitize all user inputs:

```typescript
import { body, validationResult } from "express-validator";
import DOMPurify from "isomorphic-dompurify";
import { Request, Response, NextFunction } from "express";

// Validation middleware
const validateUser = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),

  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),

  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must be 2-50 characters, letters only"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
    next();
  },
];

// Sanitization for HTML content
const sanitizeHtml = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.content) {
    req.body.content = DOMPurify.sanitize(req.body.content);
  }
  next();
};

app.post("/users", validateUser, sanitizeHtml, createUser);
```

### Protection Against Common Attacks

#### SQL Injection Prevention

```javascript
// BAD - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Using parameterized queries
const query = "SELECT * FROM users WHERE email = ?";
db.query(query, [email], (err, results) => {
  // Handle results
});

// With ORM
const user = await User.findOne({ where: { email: email } });
```

#### XSS Prevention

```typescript
import helmet from "helmet";
import { Request, Response } from "express";
import { User } from "../models/User"; // Assuming a User model
// These would be your own utility functions
import { escapeHtml, sanitizeHtml } from "../utils/sanitizers";

// Use Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Escape user input in templates
app.get("/profile/:userId", async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.userId);
  // Note: res.render is used with templating engines like Pug or EJS
  res.render("profile", {
    userName: user ? escapeHtml(user.name) : "",
    userBio: user ? sanitizeHtml(user.bio) : "",
  });
});
```

#### CSRF Prevention

```javascript
import csurf from "csurf";
import { Request, Response } from "express";

// This interface is needed to let TypeScript know about `req.csrfToken()`
interface CsurfRequest extends Request {
  csrfToken(): string;
}

// CSRF protection
const csrfProtection = csurf({ cookie: true });

app.use(csrfProtection);

app.get("/form", (req: CsurfRequest, res: Response) => {
  res.render("form", { csrfToken: req.csrfToken() });
});

// In your form template
// <input type="hidden" name="_csrf" value="{{csrfToken}}">
```

### Session Security

Secure session management:

```typescript
// Session Security with PostgreSQL (TypeScript)
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg"; // Assuming you use node-postgres (pg)

// Create a session store instance
const PgStore = connectPgSimple(session);

// Create a new PostgreSQL pool
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add any other pool configuration here
});

app.use(
  session({
    store: new PgStore({
      pool: pgPool,
      createTableIfMissing: true, // Automatically create the session table
    }),
    secret: process.env.SESSION_SECRET!, // Secret to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side access
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict", // Strict same-site policy
    },
  })
);
```

## Backend Architecture

### Middleware Architecture

Organize middleware in a logical order:

```typescript
import express from "express";
import helmet from "helmet";
import cors from "cors";
// The following imports are examples assuming you have these files
import { corsOptions } from "./config/cors";
import { requestLogger } from "./middleware/request-logger.middleware";
import { authenticateToken } from "./middleware/auth.middleware";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { postRoutes } from "./routes/post.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// 1. Security middleware (first)
app.use(helmet());
app.use(cors(corsOptions));

// 2. Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 3. Logging middleware
app.use(requestLogger);

// 4. Authentication middleware (for protected routes)
app.use("/api/protected", authenticateToken);

// 5. Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// 6. Error handling middleware (last)
app.use(errorHandler);
```

### Scalable Project Structure

Organize your project for maintainability:

```
src/
├── controllers/          # Route handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── post.controller.js
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── error.middleware.js
├── models/              # Database models
│   ├── User.js
│   └── Post.js
├── routes/              # Route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── post.routes.js
├── services/            # Business logic
│   ├── auth.service.js
│   ├── user.service.js
│   └── email.service.js
├── utils/               # Utility functions
│   ├── logger.js
│   ├── database.js
│   └── validation.js
├── config/              # Configuration files
│   ├── database.js
│   └── environment.js
└── app.js               # Application entry point
```

### Separation of Concerns

Implement proper layered architecture:

```typescript
// dtos/user.dto.ts
// A Data Transfer Object for creating a user
export interface CreateUserDto {
  email: string;
  password?: string;
  firstName?: string;
  // add other properties as needed
}

// controllers/user.controller.ts
import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dto";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: CreateUserDto = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    next(error); // Pass error to the centralized error handler
  }
};

// services/user.service.ts
import { User } from "../models/User"; // Your Sequelize User model
import * as emailService from "./email.service";
import { CreateUserDto } from "../dtos/user.dto";
import { AppError } from "../utils/errors";

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409); // 409 Conflict
  }

  // Create user in the database
  const user = await User.create(userData);

  // Send a welcome email (example of another service call)
  await emailService.sendWelcomeEmail(user);

  return user;
};

// models/User.ts (Sequelize model with TypeScript)
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UserAttributes {
  id: number;
  email: string;
  isActive: boolean;
  // ... other fields
}

// `id` is optional on creation, `isActive` has a default
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isActive"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // ... other fields
  },
  {
    sequelize,
    tableName: "users",
  }
);
```

### Centralized Error Handling

Implement consistent error handling to manage exceptions gracefully and provide meaningful feedback to clients. A centralized error handler is a middleware that catches all errors from your application, logs them, and formats a consistent response.

#### Custom Error Classes

First, define custom error classes to represent different types of operational errors. This makes error handling more predictable.

```typescript
// utils/errors.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input data") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
```

#### Generic Error Handling Middleware

This middleware should be the last one you `app.use()` in your Express application. It catches errors passed via `next(error)` from anywhere in your application.

This example shows how to handle both generic application errors and specific errors from an ORM like Sequelize.

```typescript
// middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors";
import { BaseError as SequelizeError } from "sequelize";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  let error: AppError;

  // Handle known operational errors first
  if (err instanceof AppError) {
    error = err;
  }
  // Handle Sequelize-specific errors
  else if (err instanceof SequelizeError) {
    if (err.name === "SequelizeValidationError") {
      const messages = (err as any).errors.map((e: any) => e.message);
      error = new ValidationError(`Validation Error: ${messages.join(", ")}`);
    } else if (err.name === "SequelizeUniqueConstraintError") {
      const messages = (err as any).errors.map(
        (e: any) => `${e.path} must be unique.`
      );
      error = new ValidationError(`Database Error: ${messages.join(", ")}`);
    } else {
      // Handle other DB errors, but don't leak details in production
      error = new AppError("A database error occurred.", 500);
    }
  }
  // Handle unexpected errors
  else {
    const message =
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred."
        : err.message;
    error = new AppError(message, 500);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
```

## Logging and Monitoring

### Structured Logging with Winston

Implement comprehensive logging:

```typescript
// utils/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
```

### Request Logging Middleware

Track all requests for monitoring:

```typescript
// middleware/request-logger.middleware.ts
import { Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { AuthenticatedRequest } from "./auth.middleware"; // Assuming this type is defined

const requestLogger = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log request
  logger.info("Request started", {
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    userId: req.user?.id,
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });
  });

  next();
};

module.exports = requestLogger;
```

### Security Logging

Log security-related events:

```typescript
// services/security-logger.service.ts
import { logger } from "../utils/logger";

export const logFailedLogin = (email: string, ip: string) => {
  logger.warn("Failed login attempt", {
    event: "FAILED_LOGIN",
    email,
    ip,
    timestamp: new Date().toISOString(),
  });
};

export const logSuccessfulLogin = (
  userId: number,
  email: string,
  ip: string
) => {
  logger.info("Successful login", {
    event: "SUCCESSFUL_LOGIN",
    userId,
    email,
    ip,
    timestamp: new Date().toISOString(),
  });
};

export const logPasswordChange = (userId: number, ip: string) => {
  logger.info("Password changed", {
    event: "PASSWORD_CHANGE",
    userId,
    ip,
    timestamp: new Date().toISOString(),
  });
};

export const logSuspiciousActivity = (
  userId: number | null,
  activity: string,
  details: object
) => {
  logger.warn("Suspicious activity detected", {
    event: "SUSPICIOUS_ACTIVITY",
    userId,
    activity,
    details,
    timestamp: new Date().toISOString(),
  });
};
```

## Environment Configuration

### Environment Variables Management

Use dotenv for configuration:

```typescript
// config/environment.ts
import "dotenv/config"; // For loading .env file

// For robust validation, consider using a library like Zod.

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "myapp",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    url: process.env.DATABASE_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
};

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export default config;
```

### Environment-Specific Configuration

```typescript
// .env.development
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
LOG_LEVEL=debug
JWT_SECRET=dev-secret-key
CORS_ORIGIN=http://localhost:3000

// .env.production
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:port/dbname
LOG_LEVEL=info
JWT_SECRET=super-secure-production-secret
CORS_ORIGIN=https://yourdomain.com
```

### Database Connection Management

```typescript
// config/database.ts
import { Sequelize } from "sequelize";
import config from "./environment";
import { logger } from "../utils/logger";

const connectionUrl = config.database.url;

if (!connectionUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const sequelize = new Sequelize(connectionUrl, {
  dialect: "postgres",
  logging: config.nodeEnv === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");

    if (config.nodeEnv === "development") {
      await sequelize.sync({ alter: true });
      logger.info("Database synchronized");
    }
  } catch (error) {
    logger.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

export { sequelize, connectDatabase };
```

## Data Validation

### Input Validation with Joi

Comprehensive data validation:

```typescript
// utils/validation.ts
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required(),

  age: Joi.number().integer().min(13).max(120).optional(),

  role: Joi.string().valid("user", "admin", "moderator").default("user"),
});

export const postSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),

  content: Joi.string().min(10).max(10000).required(),

  status: Joi.string().valid("draft", "published", "archived").default("draft"),

  tags: Joi.array().items(Joi.string().min(2).max(30)).max(10).optional(),
});

// Validation middleware factory
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: errorDetails,
      });
    }

    req.body = value; // Use validated and sanitized data
    next();
  };
};

export { userSchema, postSchema, validateBody };
```

### Business Logic Validation

Validate business rules in service layer:

```typescript
// services/post.service.ts
import { Post } from "../models/Post";
import { User } from "../models/User";
import { ValidationError } from "../utils/errors";
import { Op } from "sequelize";

// A DTO for creating posts
interface CreatePostDto {
  title: string;
  // other post properties...
}

export const createPost = async (userId: number, postData: CreatePostDto) => {
  // Validate user exists and is active
  const user = await User.findByPk(userId);
  if (!user || !user.isActive) {
    throw new ValidationError("User not found or inactive");
  }

  // Validate user hasn't exceeded daily post limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysPosts = await Post.count({
    where: {
      authorId: userId,
      createdAt: { [Op.gte]: today },
    },
  });

  if (todaysPosts >= 10) {
    throw new ValidationError("Daily post limit exceeded");
  }

  // Validate unique title for user
  const existingPost = await Post.findOne({
    where: {
      authorId: userId,
      title: postData.title,
    },
  });

  if (existingPost) {
    throw new ValidationError("You already have a post with this title");
  }

  return await Post.create({
    ...postData,
    authorId: userId,
  });
};
```

### Data Sanitization

Clean and normalize input data:

```typescript
// utils/sanitization.ts
import DOMPurify from "isomorphic-dompurify";
import validator from "validator";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  website?: string;
}

interface PostData {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
}

export const sanitizeUser = (userData: UserData) => {
  return {
    email: validator.normalizeEmail(userData.email.toLowerCase()) || "",
    firstName: validator.escape(userData.firstName.trim()),
    lastName: validator.escape(userData.lastName.trim()),
    bio: DOMPurify.sanitize(userData.bio || ""),
    website: userData.website
      ? validator.isURL(userData.website)
        ? userData.website
        : ""
      : "",
  };
};

export const sanitizePost = (postData: PostData) => {
  return {
    title: validator.escape(postData.title.trim()),
    content: DOMPurify.sanitize(postData.content),
    excerpt: postData.excerpt ? validator.escape(postData.excerpt.trim()) : "",
    tags: postData.tags
      ? postData.tags.map((tag) => validator.escape(tag.trim().toLowerCase()))
      : [],
  };
};
```

## Best Practices Summary

### Security Checklist

- ✅ Use HTTPS in production
- ✅ Implement proper authentication and authorization
- ✅ Validate and sanitize all inputs
- ✅ Use parameterized queries to prevent SQL injection
- ✅ Implement rate limiting
- ✅ Set secure HTTP headers
- ✅ Use environment variables for secrets
- ✅ Log security events
- ✅ Keep dependencies updated
- ✅ Implement proper error handling

### Performance Considerations

- Use database indexes appropriately
- Implement caching strategies (Redis, in-memory)
- Optimize database queries
- Use connection pooling
- Implement pagination for large datasets
- Consider using CDNs for static assets
- Monitor application performance
- Use compression middleware

### Maintainability Guidelines

- Follow consistent code structure
- Write comprehensive tests
- Document APIs thoroughly
- Use TypeScript for better type safety
- Implement proper logging
- Follow semantic versioning
- Use code linting and formatting tools
- Regular security audits
