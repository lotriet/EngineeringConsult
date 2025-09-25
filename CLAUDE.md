# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional AI engineering consulting landing page built with Next.js, TypeScript, and Tailwind CSS. The project features a conversion-focused design with prominent email signup CTAs, responsive layout, and modern development tooling with hot reload capabilities.

## Project Structure

```
├── components/
│   ├── EmailSignup.tsx     - Email signup form with validation
│   ├── Hero.tsx            - Hero section with main CTA
│   ├── Services.tsx        - Services overview component
│   └── ValueProposition.tsx - Value proposition section
├── pages/
│   ├── _app.tsx            - Next.js app wrapper
│   ├── _document.tsx       - HTML document structure
│   └── index.tsx           - Main landing page
├── styles/
│   └── globals.css         - Global styles with Tailwind CSS
├── package.json            - Dependencies and scripts
├── next.config.js          - Next.js configuration
├── tailwind.config.js      - Tailwind CSS configuration
├── tsconfig.json          - TypeScript configuration
└── postcss.config.js      - PostCSS configuration
```

## Development

This Next.js application requires Node.js and npm/yarn for development.

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## Key Features

- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Email Signup Forms**: Functional forms with validation using react-hook-form
- **TypeScript**: Type safety throughout the application
- **SEO Optimized**: Meta tags and semantic HTML structure
- **Hot Reload**: Instant updates during development
- **Component Architecture**: Modular, reusable components

## Deployment

Build the production version:
```bash
npm run build
```

The application can be deployed to any hosting platform that supports Next.js (Vercel, Netlify, etc.).