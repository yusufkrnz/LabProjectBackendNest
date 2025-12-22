# GitHub GraphQL Integration - README

## 🚀 Quick Start

### 1. Setup GitHub Token

Create a GitHub Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` and `read:user`
4. Copy the generated token

Add to your `.env` file:
```bash
GITHUB_TOKEN=ghp_your_token_here
MONGODB_URI=mongodb://localhost:27017/github_scanner
```

### 2. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
mongod
```

### 3. Start the Server

```bash
npm run start:dev
```

## 📡 API Endpoints

### Scan User Repositories
```bash
POST http://localhost:3000/github-ql/scan/user
Content-Type: application/json

{
  "username": "torvalds",
  "maxRepos": 50,
  "forceRefresh": false
}
```

### Scan Single Repository
```bash
POST http://localhost:3000/github-ql/scan/repository
Content-Type: application/json

{
  "owner": "torvalds",
  "name": "linux",
  "forceRefresh": false
}
```

### Get Stored Repositories
```bash
GET http://localhost:3000/github-ql/repositories/torvalds
```

### Get Single Repository
```bash
GET http://localhost:3000/github-ql/repository/torvalds/linux
```

### Get User Statistics
```bash
GET http://localhost:3000/github-ql/stats/torvalds
```

### Delete Cached Data
```bash
DELETE http://localhost:3000/github-ql/repositories/torvalds
```

## 📊 Data Stored

For each repository, the following data is collected:
- Basic info (name, description, URL)
- Owner details (username, avatar, type)
- Statistics (stars, forks, watchers)
- Languages (with size and percentage)
- Topics/tags
- Recent commits (last 5)
- License information
- Timestamps (created, updated, pushed, scanned)

## 🔍 Features

- **Smart Caching**: Data is cached for 24 hours to reduce API calls
- **Force Refresh**: Option to bypass cache and fetch fresh data
- **Pagination Support**: Limit number of repos to scan
- **Error Handling**: Comprehensive error messages
- **Statistics**: Aggregated stats for users
- **MongoDB Storage**: Persistent data storage
- **Swagger Documentation**: Available at `/api`

## 📝 Example Response

```json
{
  "cached": false,
  "count": 10,
  "totalCount": 50,
  "hasMore": true,
  "repositories": [
    {
      "githubId": "MDEwOlJlcG9zaXRvcnkx",
      "name": "linux",
      "fullName": "torvalds/linux",
      "description": "Linux kernel source tree",
      "owner": {
        "login": "torvalds",
        "avatarUrl": "https://avatars.githubusercontent.com/u/1024025",
        "type": "User"
      },
      "stargazersCount": 150000,
      "forksCount": 45000,
      "primaryLanguage": {
        "name": "C",
        "color": "#555555"
      },
      "languages": [
        { "name": "C", "size": 50000000, "percentage": 95.5 },
        { "name": "Assembly", "size": 2000000, "percentage": 3.8 }
      ],
      "topics": ["linux", "kernel", "operating-system"],
      "recentCommits": [
        {
          "sha": "abc123",
          "message": "Fix bug in scheduler",
          "author": "Linus Torvalds",
          "date": "2025-12-22T10:30:00Z"
        }
      ]
    }
  ]
}
```
