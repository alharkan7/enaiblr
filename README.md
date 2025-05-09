# enaiblr

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/alharkan7/enaiblr)

Enaiblr is a growing AI tools platform currently featuring a search engine, disposable chatbot, and image generator - all designed with simplicity and functionality in mind.

## Features

### 🔍 AI Tools Search Engine
- Simple and straightforward search interface for finding AI tools and resources
- Tag-based filtering system for quick access to specific categories
- Real-time search results with detailed tool descriptions
- Mobile-responsive design

### 💬 Disposable AI Chat
- No login required, completely anonymous chat experience
- Image upload and analysis capabilities
- Real-time streaming responses
- Mobile-optimized with special handling for keyboard interactions
- Chat history is never stored - truly disposable

### 🎨 AI Image Generator
- Create AI-generated images from text descriptions
- Multiple aspect ratio options (wide, square, portrait)
- Example prompts for inspiration
- One-click image download
- Modal view for detailed image inspection
- Support for various artistic styles

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Together AI API for chat and image generation
- Exa API for search functionality
- Vercel Analytics & Speed Insights

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/alharkan7/enaiblr.git
cd enaiblr
```


2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
TOGETHER_API_KEY=your_together_ai_key
EXASEARCH_API_KEY=your_exa_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

The main pages are organized as follows:

- `/app/page.tsx` - AI Tools Search Engine
- `/app/chat/page.tsx` - Disposable AI Chat
- `/app/imagen/page.tsx` - AI Image Generator

Each feature is built as a standalone module while sharing common components and utilities.

## API Routes

- `/api/search` - Handles AI tools search queries
- `/api/chat` - Manages chat interactions with streaming responses
- `/api/generate` - Processes image generation requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Bug Reports

Found a bug? Please email us at enaiblr@gmail.com or open an issue on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by [Al Harkan](https://github.com/alharkan7)
