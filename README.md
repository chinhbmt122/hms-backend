# Hospital Management System - Backend

A microservices-based hospital management system built with **Nx Monorepo**, **NestJS**, and **Spring Boot**.

---

## ��� Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Infrastructure (Docker)](#-infrastructure-docker)
- [Development Workflow](#-development-workflow)
- [Creating New Services](#-creating-new-services)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Useful Commands](#-useful-commands)
- [Troubleshooting](#-troubleshooting)

---

## ��� Tech Stack

### **Frameworks**
- **Nx** - Monorepo build system
- **NestJS** - Node.js framework (TypeScript)
- **Spring Boot** - Java framework

### **Databases**
- **PostgreSQL** - Primary database
- **Redis** - Caching & sessions

### **Message Broker**
- **RabbitMQ** - Inter-service communication

### **Tools**
- **Docker** - Containerization
- **TypeORM** - ORM for NestJS
- **JPA/Hibernate** - ORM for Spring Boot
- **Jest** - Testing framework

---

## ��� Project Structure
```
hms-backend/
├── .github/workflows/         # CI/CD pipelines
├── apps/                       # Microservices
│   ├── api-gateway/           # NestJS - API Gateway
│   ├── patient-service/       # NestJS - Patient Management
│   └── auth-service/          # Spring Boot - Authentication
├── libs/                       # Shared libraries
│   └── shared/                # Common utilities
├── docker-compose.yml         # Infrastructure setup
├── .env                       # Environment variables
├── nx.json                    # Nx configuration
└── package.json               # Dependencies
```

---

## ��� Prerequisites

### **Required Software**

| Tool | Version | Installation |
|------|---------|--------------|
| **Node.js** | 20.x | [Download](https://nodejs.org/) |
| **Java** | 21 | [Download](https://adoptium.net/) |
| **Docker** | 24.x+ | [Download](https://www.docker.com/) |
| **npm** | 10.x+ | Comes with Node.js |
| **Git** | Latest | [Download](https://git-scm.com/) |

### **Verify Installation**
```bash
node --version    # Should show v20.x.x
java --version    # Should show 21.x.x
docker --version  # Should show 24.x.x or higher
npm --version     # Should show 10.x.x
```

---

## ��� Getting Started

### **1. Clone the Repository**
```bash
git clone https://github.com/chinhbmt122/hms-backend.git
cd hms-backend
```

### **2. Install Dependencies**
```bash
npm install
```

This will install:
- Nx CLI
- NestJS dependencies
- Development tools
- Testing frameworks

### **3. Setup Environment Variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# (Default values work for local development)
```

### **4. Start Infrastructure**
```bash
# Start all infrastructure services (PostgreSQL, Redis, RabbitMQ)
docker-compose up -d

# Verify all services are running
docker-compose ps

# Expected output: All services should show "Up (healthy)"
```

### **5. Start Development Servers**
```bash
# Start all services in development mode
npx nx run-many -t serve --all

# Or start specific service
npx nx serve api-gateway
npx nx serve patient-service
```

### **6. Verify Setup**
```bash
# Check API Gateway
curl http://localhost:3000/api

# Check Patient Service
curl http://localhost:3001/api

# Access RabbitMQ Management
open http://localhost:15672
# Login: hospital / rabbitmq_hospital_pass_2024

# Access pgAdmin
open http://localhost:5050
# Login: admin@hospital.com / pgadmin_hospital_pass_2024
```

---

## ��� Infrastructure (Docker)

### **Services Overview**

| Service | Port | Description | Credentials |
|---------|------|-------------|-------------|
| **PostgreSQL (Patient)** | 5433 | Patient service database | hospital / hospital123 |
| **PostgreSQL (Auth)** | 5434 | Auth service database | hospital / hospital123 |
| **Redis** | 6379 | Cache & sessions | Password: redis_hospital_pass_2024 |
| **RabbitMQ** | 5672 | Message broker | hospital / rabbitmq_hospital_pass_2024 |
| **RabbitMQ Management** | 15672 | Web UI | http://localhost:15672 |
| **pgAdmin** | 5050 | Database management | http://localhost:5050 |

### **Docker Commands**
```bash
# Start all infrastructure
docker-compose up -d

# Stop all infrastructure
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres-patient
docker-compose logs -f rabbitmq
docker-compose logs -f redis

# Restart a service
docker-compose restart postgres-patient

# Stop and remove everything (including volumes)
docker-compose down -v

# Check service health
docker-compose ps
```

### **Database Connection Strings**
```bash
# Patient Database
postgresql://hospital:hospital123@localhost:5433/patient_db

# Auth Database
postgresql://hospital:hospital123@localhost:5434/auth_db

# Redis
redis://:redis_hospital_pass_2024@localhost:6379

# RabbitMQ
amqp://hospital:rabbitmq_hospital_pass_2024@localhost:5672
```

---

## ��� Development Workflow

### **Working on a Feature**
```bash
# 1. Create feature branch
git checkout -b feature/patient-registration

# 2. Make changes to patient-service
# Edit files in apps/patient-service/

# 3. Run tests for affected projects
npx nx affected -t test

# 4. Run linting
npx nx affected -t lint

# 5. Commit changes
git add .
git commit -m "feat(patient): add patient registration endpoint"

# 6. Push and create PR
git push origin feature/patient-registration
```

### **Team Collaboration (Multiple Developers on Same Feature)**
```bash
# Lead developer creates feature branch
git checkout -b feature/patient-management
git push origin feature/patient-management

# Other developers pull the branch
git checkout feature/patient-management
git pull origin feature/patient-management

# Everyone works and commits regularly
git add .
git commit -m "feat(patient): add create endpoint"
git pull --rebase origin feature/patient-management
git push origin feature/patient-management

# Sync every 1-2 hours
git pull --rebase origin feature/patient-management
```

---

## ���️ Creating New Services

### **Create NestJS Service**
```bash
# Generate new NestJS application
npx nx g @nx/nest:application apps/billing-service

# Options during generation:
# - Directory: apps/billing-service
# - Framework: NestJS
# - Unit test runner: Jest

# The generated structure:
apps/billing-service/
├── src/
│   ├── app/
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── app.module.ts
│   └── main.ts
├── project.json          # Nx configuration
└── tsconfig.json

# Start the service
npx nx serve billing-service
```

### **Create Spring Boot Service**
```bash
# 1. Navigate to apps directory
cd apps

# 2. Create Spring Boot project using Spring Initializr
# Visit: https://start.spring.io/
# Or use curl:
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,lombok \
  -d type=gradle-project \
  -d language=java \
  -d bootVersion=3.4.0 \
  -d baseDir=billing-service \
  -d groupId=com.hospital \
  -d artifactId=billing-service \
  -o billing-service.zip

unzip billing-service.zip
rm billing-service.zip
cd ..

# 3. Create project.json for Nx integration
cat > apps/billing-service/project.json << 'JSON'
{
  "name": "billing-service",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/billing-service/src",
  "targets": {
    "build": {
      "executor": "@nx/gradle:gradle",
      "options": {
        "taskName": "build",
        "cwd": "apps/billing-service"
      }
    },
    "test": {
      "executor": "@nx/gradle:gradle",
      "options": {
        "taskName": "test"
      }
    },
    "serve": {
      "executor": "@nx/gradle:gradle",
      "options": {
        "taskName": "bootRun"
      }
    }
  },
  "tags": ["type:spring-boot", "scope:backend", "lang:java"]
}
JSON

# 4. Test the service
npx nx test billing-service
npx nx serve billing-service
```

### **Create Shared Library**
```bash
# Generate TypeScript library
npx nx g @nx/js:library shared-utils --directory=libs/shared-utils

# Structure:
libs/shared-utils/
├── src/
│   ├── index.ts
│   └── lib/
│       └── shared-utils.ts
├── project.json
└── tsconfig.json

# Use in services
import { utilityFunction } from '@hms-backend/shared-utils';
```

---

## ��� Testing

### **Run Tests**
```bash
# Test all projects
npx nx run-many -t test --all

# Test only affected projects (changed code)
npx nx affected -t test

# Test specific service
npx nx test patient-service
npx nx test auth-service

# Test with coverage
npx nx test patient-service --coverage

# Watch mode for development
npx nx test patient-service --watch
```

### **Run Linting**
```bash
# Lint all projects
npx nx run-many -t lint --all

# Lint only affected
npx nx affected -t lint

# Lint specific service
npx nx lint patient-service

# Auto-fix issues
npx nx lint patient-service --fix
```

### **Run All Quality Checks**
```bash
# Run lint + test for all affected projects
npx nx affected -t lint test
```

---

## ��� CI/CD

### **Continuous Integration**

The project uses **GitHub Actions** for CI. On every push/PR:

1. ✅ Detects changed files
2. ✅ Runs lint on affected projects
3. ✅ Runs tests on affected projects
4. ✅ Caches dependencies for faster runs

**CI runs only on code changes, not on:**
- Documentation updates (`.md` files)
- Editor config changes (`.vscode`, `.editorconfig`)
- Formatting config (`.prettierrc`)

### **View CI Status**
```bash
# Check CI status on GitHub
# Go to: Actions tab in your repository

# Or using GitHub CLI
gh run list
gh run view [run-id]
```

### **Branch Protection**

Branches `main` and `develop` are protected:
- ✅ CI must pass before merge
- ✅ Requires 1 approval
- ✅ Must be up to date with base branch

---

## ���️ Useful Commands

### **Nx Commands**
```bash
# View project graph (visualize dependencies)
npx nx graph

# Show all projects
npx nx show projects

# Show affected projects
npx nx affected:apps
npx nx affected:libs

# Run command on all projects
npx nx run-many -t [target] --all

# Run command on affected projects
npx nx affected -t [target]

# Clear Nx cache
npx nx reset
```

### **Development Commands**
```bash
# Start service in development mode
npx nx serve [service-name]

# Build service for production
npx nx build [service-name] --configuration=production

# Generate code
npx nx g @nx/nest:controller users --project=patient-service
npx nx g @nx/nest:service users --project=patient-service
npx nx g @nx/nest:module users --project=patient-service
```

### **Docker Quick Commands**
```bash
# One-liner to restart everything
docker-compose down && docker-compose up -d

# View all container logs together
docker-compose logs -f --tail=100

# Execute command in container
docker exec -it postgres-patient psql -U hospital -d patient_db
docker exec -it redis redis-cli -a redis_hospital_pass_2024
```

---

## ��� Troubleshooting

### **Problem: Port already in use**
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 [PID]  # macOS/Linux
taskkill /PID [PID] /F  # Windows

# Or change port in .env file
```

### **Problem: Docker containers won't start**
```bash
# Check logs
docker-compose logs [service-name]

# Common fixes:
# 1. Remove all containers and volumes
docker-compose down -v

# 2. Restart Docker Desktop

# 3. Check disk space
docker system df

# 4. Clean up unused resources
docker system prune -a
```

### **Problem: Nx cache issues**
```bash
# Clear Nx cache
npx nx reset

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Problem: Tests failing**
```bash
# Clear Jest cache
npx jest --clearCache

# Update snapshots
npx nx test [service-name] --updateSnapshot

# Run tests in verbose mode
npx nx test [service-name] --verbose
```

### **Problem: Gradle issues (Java services)**
```bash
# Clean and rebuild
cd apps/auth-service
./gradlew clean build

# Update Gradle wrapper
./gradlew wrapper --gradle-version=8.11.1

# Check dependencies
./gradlew dependencies
```

### **Problem: Database connection errors**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres-patient

# Check logs
docker-compose logs postgres-patient

# Restart database
docker-compose restart postgres-patient

# Connect manually to verify
docker exec -it postgres-patient psql -U hospital -d patient_db
```

---

## ��� Additional Resources

### **Documentation**
- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [TypeORM Documentation](https://typeorm.io)
- [Docker Documentation](https://docs.docker.com)

### **Architecture Diagrams**
- View project dependencies: `npx nx graph`
- Infrastructure overview: See `docker-compose.yml`

### **Code Style**
- **TypeScript/JavaScript**: Prettier + ESLint
- **Java**: Google Java Style Guide
- Run formatters: `npm run format`

---

## ��� Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and commit: `git commit -m 'feat: add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Create Pull Request
5. Wait for CI to pass
6. Request review from team
7. Merge when approved

### **Commit Message Format**
```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
chore(scope): update dependencies
test(scope): add tests
refactor(scope): refactor code

Examples:
feat(patient): add patient registration endpoint
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
```


## ��� License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---