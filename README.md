# Redis Tutorial

An application built with **Node.js**, **Express**, and **Redis** for learning purpose. We will learn to create "Site banner", "OTP generate with TTL" and many more using Redis.

## Features

- Generate site banner using Redis
- Redis-based OTP storage with expiration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis

## Installation

```bash
git clone <repository-url>
cd redis-tutorial
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/redis_demo
REDIS_URL=redis://localhost:6379
```

Start the server:

```bash
npm start
```

## License

MIT
