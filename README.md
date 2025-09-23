# Promptify – AI Prompt Collection Platform

A modern React application built with Vite, TypeScript, and Tailwind CSS for sharing and discovering AI prompts.

## Features

- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- ⚡ Fast development with Vite
- 🔧 TypeScript for type safety
- 📱 Responsive design
- 🎯 Copy-to-clipboard functionality for prompts
- 🖼️ Image gallery with hover effects
- 🚀 Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd promptify
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## Deployment

### Deploy to Vercel

This project is optimized for Vercel deployment:

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Deploy**: Vercel will automatically build and deploy your project

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Lucide React** - Icons

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_APP_TITLE=Promptify
VITE_APP_DESCRIPTION=Transform Your thought into a reality with Promptify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
