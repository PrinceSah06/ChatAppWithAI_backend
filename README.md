# 🧠 Collaborative AI-Agent Chat & IDE Backend

A highly scalable Express server designed as the orchestrator for a multi-user collaborative workspace and cloud-based IDE. It integrates **Socket.IO** for real-time synchronization, **Redis** for token-blacklisting, **MongoDB** for workspace storage, and **Google Gemini API** (`gemini-2.5-flash`) for AI agent assistance.

This repository serves as a showcase of backend systems engineering, featuring secure room-based WebSockets, AI model structuring, stateless validation, and token revocation patterns.

---

## 🚀 Key Architectural Features & Design Patterns

1. **Room-Based Socket.IO Synchronization**
   - Implements room isolation using MongoDB Project IDs: clients connecting to the socket are authenticated via JWT, verified against database collaborators, and placed into a dedicated project room (`socket.join(projectId)`).
   - Broadcasts real-time messages and file tree edits strictly within the project namespace, protecting workspace privacy.

2. **Google Gemini AI Agent Integration (`@google/genai`)**
   - Listens for messages containing the `@ai` tag. Triggers the Google Gemini SDK (`gemini-2.5-flash`) to generate software engineering suggestions.
   - **JSON Mode System Prompt**: Enforces the AI to respond in a strict JSON format containing both markdown explanations (`text`) and code structure payloads (`fileTree`), which are automatically parsed and mounted on the client-side sandbox.
   - Built-in error wrappers gracefully catch API quotas/limit limits (returning a structured `429` JSON notification to the frontend).

3. **Stateless JWT Security & Redis Blacklisting**
   - **Double Protection**: JWT validates client identity state, while **Redis** manages revocation state.
   - **Token Invalidation**: To logout immediately in a stateless architecture, the token is added to a Redis memory cache with a 24-hour Time-to-Live (TTL). The `authUser` middleware queries Redis first before evaluating JWT validity, denying access to blacklisted tokens.

4. **Input Verification (Express Validator)**
   - Utilizes declarative validation chains (e.g. `body('email').isEmail()`) to sanitize and reject invalid HTTP request payloads before they hit the controller level.

5. **MongoDB/Mongoose Schemas**
   - **User Schema**: Secure pre-save bcrypt hashing hooks and instance methods for checking passwords (`isValidPassword`) and generating JWT signatures (`generateJWT`).
   - **Project Schema**: Defines relational structures associating projects to array fields of collaborator user IDs.

---

## 📁 Repository Directory Structure

```text
ChatAppWithAI_backend/
├── .env.example             # Example environment variable keys
├── .gitignore               # git exclude rules
├── app.js                   # Express application setup and REST endpoint declarations
├── server.js                # HTTP server launcher and Socket.IO connection handlers
├── package.json             # Scripts & backend dependencies manifest
├── demo.env                 # Dummy config template for fast testing
├── Db/
│   └── Db.js                # Database connection helper (Mongoose)
├── constolers/              # Express API handlers
│   ├── ai.contoller.js      # Direct AI prompt endpoints handler
│   ├── project.controler.js # Project CRUD and collaborator handlers
│   └── user.controler.js    # User registration, login, profile, and logout handlers
├── middleware/
│   └── auth.middleware.ts   # Express request protector & Redis blacklist evaluator
├── models/
│   ├── projec.model.js      # Project workspace schema definition
│   └── user.models.js       # User credentials schema definition
├── routes/
│   ├── ai.route.js          # Router for AI operations
│   ├── project.routes.js    # Router for Workspace actions
│   └── user.routes.js       # Router for Authentication operations
└── services/
    ├── ai.service.js        # Gemini API integration wrapper
    ├── project.service.js   # DB actions for Project updates and user additions
    ├── radis.servies.js     # Redis/Valkey cache initialization client
    └── user.services.js     # DB actions for User creation and lookups
```

---

## 🛠️ API Endpoint Specifications

### 👤 User Endpoints (`/user`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/user/register` | No | Creates a new user with bcrypt-hashed credentials. Returns JWT. |
| `POST` | `/user/login` | No | Authenticates login input. Returns token. |
| `GET` | `/user/profile` | Yes | Retrieves the profile payload of the current user. |
| `GET` | `/user/logout` | Yes | Blacklists the active JWT token in Redis for 24 hours. |
| `GET` | `/user/get-all` | Yes | Retrieves list of all registered users (excluding current user). |

### 📁 Project Endpoints (`/projects`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/projects/create` | Yes | Initializes a new workspace project. |
| `GET` | `/projects/all` | Yes | Fetches all projects where the user is listed as a collaborator. |
| `PUT` | `/projects/add-user` | Yes | Adds new users to a project's collaborator roster. |
| `GET` | `/projects/get-project/:projectId` | Yes | Returns details of a specific project, including its user details. |

---

## 🔧 Getting Started

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env` file using the configuration template:
   ```bash
   cp .env.example .env
   ```
   Provide the following parameters:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/chatappwithai
   JWT_SECRET=your_super_secret_jwt_key
   REDIS_URI=redis://127.0.0.1:6379
   GOOGLE_AI_KEY=your_gemini_api_key
   ```

3. **Start the Express server (Development mode)**
   ```bash
   npm run dev
   ```
   The server launches using `nodemon` on port `4000`.

---

## 💡 Tech Interview Q&A Cheatsheet (Prep Material)

### Q1: How does the backend prevent cross-project socket pollution?
- When a user joins a socket room, the backend extracts the `projectId` from the handshake query and checks if it matches a valid database project.
- The user is placed into a specific socket room: `socket.roomId = socket.project._id.toString()`.
- Real-time updates and messages are transmitted strictly within that room: `socket.broadcast.to(socket.roomId).emit(...)`. This prevents users in Project A from receiving messages from Project B.

### Q2: How do you force Gemini to return structured JSON instead of standard markdown text?
- We instruct the model using a strict system instruction detailing the exact schema required:
  ```json
  {
    "text": "markdown explanation",
    "fileTree": { "filename": { "file": { "contents": "..." } } }
  }
  ```
- In addition, we configure the request options inside `ai.models.generateContent` with: `responseMimeType: "application/json"`. This leverages the model's native JSON output mode to guarantee that the response is a machine-readable JSON structure, minimizing parsing errors.

### Q3: How does Redis invalidation prevent stateless JWT hijacking?
- A standard JWT is stateless: it remains valid until its expiration time. If a user logs out, they simply delete the token from the client. However, if the token is stolen, it can still be used until it expires.
- To address this, the logout controller takes the token and caches it in Redis with an `EX` (expiration) timeout equal to the token's remaining lifespan.
- When any route tries to call `authUser` middleware, it first runs `redis.get(token)`. If the key is found, it immediately returns `401 Unauthorized` without even verifying the signature, effectively blacklisting the token.

---

## 🔒 License
This project is open-source and available under the [MIT License](LICENSE).
