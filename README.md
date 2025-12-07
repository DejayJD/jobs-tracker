# Jobs Tracker - Kanban Board

A Next.js application for tracking job applications using a kanban-style board interface.

## Features

- **Kanban Board**: Organize job applications by status (Applied, Interviewing, Offer, Rejected, etc.)
- **Modern UI**: Built with Next.js and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Components**: Tamagui (configured for future use)
- **Code Quality**: ESLint + Prettier

## Code Quality

This project uses ESLint for linting and Prettier for code formatting:

- **ESLint**: Configured with Next.js recommended rules and Prettier compatibility
- **Prettier**: Automatic code formatting with consistent style
- **TypeScript**: Strict mode enabled with explicit `any` allowed

### Editor Setup

The project includes VS Code/Cursor settings that have been configured globally:
- Set Prettier as the default formatter for all relevant file types
- Enable format on save, paste, and type
- Point to project-specific `.prettierrc` and `.prettierignore` files when available

**Recommended Extensions:**
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer

**Format Document Command:**
- **VS Code/Cursor**: `Shift + Alt + F` (or `Shift + Option + F` on Mac)
- Files will also auto-format on save

**Note:** Global settings have been applied to your Cursor installation, so these formatting rules will work in all your projects!

## Getting Started

### Prerequisites

- Node.js 18+ (Note: Next.js 16+ requires Node.js 20.9.0+, so we're using Next.js 14 for compatibility)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
jobs-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   └── components/         # Reusable components
├── public/                 # Static assets
├── tamagui.config.ts       # Tamagui configuration (ready for future use)
└── next.config.js          # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted with Prettier

## Future Enhancements

- [ ] Add Tamagui UI components
- [ ] Implement kanban board functionality
- [ ] Add job application CRUD operations
- [ ] Database integration (PostgreSQL)
- [ ] User authentication
- [ ] Drag and drop functionality

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Tamagui](https://tamagui.dev/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
