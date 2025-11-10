# Custom Authentication with Clean Architecture

A robust authentication system built from scratch without relying on third-party authentication libraries, following Clean Architecture principles for better separation of concerns and maintainability. The system supports both traditional email/password and OAuth authentication strategies.

## Features

- 🔒 Custom authentication system (no Auth0, NextAuth, etc.)
- 🔄 Multiple OAuth providers support (Google, GitHub, etc.)
- 🏗️ Clean Architecture implementation
- 🚀 Framework-agnostic core
- 🔄 Session management
- 🔑 Secure password hashing
- 💉 Dependency Injection for better testability

## Project Structure

```
/
├── src/                    # Framework-agnostic core (Clean Architecture)
│   ├── domain/            # Enterprise business rules
│   ├── application/       # Application business rules
│   ├── infrastructure/    # Framework & external concerns
│   └── interfaces/        # Interface adapters
├── app/                   # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (authenticated)/   # Protected routes
│   └── api/               # API routes
├── components/            # UI components
├── lib/                   # Shared utilities
│   └── di/                # Dependency Injection container and bindings
└── middleware.ts          # Authentication middleware
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local` and update values)
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Clean Architecture

This project follows Clean Architecture principles:

- **Domain Layer**: Contains enterprise business rules and entities
- **Application Layer**: Contains use cases and application-specific business rules
- **Interface Layer**: Contains controllers and presenters
- **Infrastructure Layer**: Contains frameworks, databases, and external services

The core authentication logic is framework-agnostic, making it easy to switch between different frameworks or adapt to different interfaces.

## OAuth Implementation

The system supports OAuth authentication through multiple providers. The OAuth flow is implemented in a provider-agnostic way, making it easy to add new providers.

### Supported OAuth Providers
- Google
- GitHub
- (More can be easily added)

### Adding a New OAuth Provider
1. Create a new strategy in `src/infrastructure/auth/strategies/`
2. Register the strategy in the DI container under `lib/di/auth.ts`
3. Add the required environment variables for the provider

## Dependency Injection

The project uses a lightweight dependency injection container to manage dependencies and improve testability. The DI configuration is located in `lib/di/`.

### Key Features
- Centralized dependency registration
- Easy mocking for testing
- Lazy initialization of services
- Type-safe dependency resolution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
