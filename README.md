# Custom Authentication with Clean Architecture

A robust authentication system built from scratch without relying on third-party authentication libraries, following Clean Architecture principles for better separation of concerns and maintainability.

## Features

- 🔒 Custom authentication system (no Auth0, NextAuth, etc.)
- 🏗️ Clean Architecture implementation
- 🚀 Framework-agnostic core
- 🔄 Session management
- 🔑 Secure password hashing
- 🔄 Session-based authentication

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
