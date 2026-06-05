# ChatAppWithAI - Backend

The backend server for the ChatAppWithAI workspace, providing real-time collaboration, database management, and AI integration.

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **Projects**: Create and manage isolated workspaces.
- **Real-Time Websockets**: Broadcast code changes and messages to collaborators instantly using Socket.io.
- **AI Integration**: Connects to the Google Gemini API to generate intelligent coding responses formatted in JSON.
- **Redis Caching**: Efficient session and state management.

## Tech Stack
- Node.js & Express
- MongoDB (Mongoose)
- Redis (ioredis)
- Socket.io
- @google/genai (Gemini 2.5 Flash)

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Create a \`.env\` file:
   \`\`\`
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/chatappwithai
   JWT_SECRET=your_jwt_secret
   REDIS_URI=your_redis_uri
   GOOGLE_AI_KEY=your_gemini_api_key
   \`\`\`

3. Start the server (with auto-reload):
   \`\`\`bash
   npm start
   \`\`\`
