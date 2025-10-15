# Hospital Management System - Backend

Microservices-based hospital management system built with Nx monorepo.

## Tech Stack

- **Node.js Services**: NestJS + TypeScript
- **Java Services**: Spring Boot
- **Build System**: Nx
- **Databases**: PostgreSQL
- **Caching**: Redis
- **Message Broker**: RabbitMQ

## Prerequisites

- Node.js 20+
- Java 21+
- Docker & Docker Compose
- npm

## Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/chinhbmt122/hms-backend.git
cd hms-backend

# Install dependencies
npm install
```

### Verify Setup
```bash
# Check Nx version
npx nx --version

# View project graph
npx nx graph
```

## Project Structure
```
hms-backend/
├── apps/           # Microservices applications
├── libs/           # Shared libraries
├── tools/          # Custom tools and scripts
├── nx.json         # Nx configuration
└── package.json    # Dependencies
```

## Team Members

- Setup Lead: [Name]
- Backend Team: [Names]
- Java Team: [Names]
- DevOps: [Name]

## Development Workflow

1. Create feature branch from `develop`
2. Make changes
3. Run tests: `npx nx affected -t test`
4. Run lint: `npx nx affected -t lint`
5. Commit with conventional commits
6. Push and create PR

## Useful Commands
```bash
# Generate a new NestJS app
npx nx g @nx/nest:app <app-name>

# Generate a new library
npx nx g @nx/nest:lib <lib-name>

# Run specific app
npx nx serve <app-name>

# Test affected projects
npx nx affected -t test

# Build all projects
npx nx run-many -t build --all

# View project dependencies
npx nx graph
```

## Status

🚧 **Phase 1: Foundation Setup** - ✅ COMPLETE
- [x] Nx workspace created
- [x] Plugins installed (@nx/nest, @nx/gradle)
- [x] GitHub repository configured
- [x] Documentation initialized

⏳ **Phase 2: Service Architecture** - In Progress

## Support

For questions, contact [team lead name/email]