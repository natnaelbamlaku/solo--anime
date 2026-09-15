# Solo Anime - Complete Anime Streaming Platform

A full-stack anime streaming application with metadata integration via Jikan API and streaming sources via Kuhi API.

## Features

✨ **Search Anime** - Search from thousands of anime using Jikan API  
📺 **Stream Episodes** - Watch anime episodes with HLS.js player  
📖 **Detailed Information** - View full anime details, synopsis, genres, and more  
🎬 **Episode List** - Browse and select episodes to watch  
🔄 **CORS Proxy** - Backend handles CORS issues and proxies streams  

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS for styling
- Wouter for routing
- HLS.js for video playback
- Vite for bundling

**Backend:**
- Node.js with Express
- tRPC for type-safe API
- Drizzle ORM for database
- CORS proxy for external APIs

**APIs Used:**
- [Jikan API](https://jikan.moe/) - Anime metadata
- [Kuhi API](https://github.com/Eltik/Kuhi) - Streaming sources

## Project Structure

```
solo-anime/
├── src/
│   ├── pages/
│   │   ├── SearchPage.tsx      # Anime search interface
│   │   └── AnimeDetailsPage.tsx # Details and episode player
│   ├── components/
│   │   └── VideoPlayer.tsx      # HLS video player component
│   └── ...
├── server/
│   ├── routes/
│   │   └── api.ts              # Jikan & Kuhi proxy routes
│   ├── _core/
│   │   └── index.ts            # Express server setup
│   └── ...
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Kuhi API running on `http://127.0.0.1:8000` (optional for testing)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/natnaelbamlaku/solo-anime.git
cd solo-anime
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Environment Variables**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
```

4. **Development**
```bash
pnpm dev
# Server runs on http://localhost:3000
```

5. **Build for Production**
```bash
pnpm build
```

6. **Start Production Server**
```bash
pnpm start
```

## API Endpoints

### Anime Search
```
GET /api/search?query={searchTerm}
```
Searches anime using Jikan API

### Anime Details & Episodes
```
GET /api/anime/{animeId}
```
Returns detailed anime info and episode list

### Stream Extraction
```
GET /api/stream?animeName={name}&episode={number}
```
Gets streaming URL from Kuhi API with CORS proxy

### CORS Proxy
```
GET /api/proxy?url={encodedUrl}
```
Proxies external content and rewrites m3u8 playlists

## Key Features Explained

### 1. Search Page (`SearchPage.tsx`)
- Real-time anime search powered by Jikan API
- Displays anime posters, titles, synopsis, and status
- Click to navigate to anime details page

### 2. Anime Details Page (`AnimeDetailsPage.tsx`)
- Full anime information (genres, studios, score, etc.)
- Episode list with clickable selection
- Integrated video player

### 3. Video Player (`VideoPlayer.tsx`)
- Uses HLS.js for adaptive bitrate streaming
- Handles m3u8 playlist loading
- Error states and loading indicators
- Full video controls

### 4. Backend Proxy (`server/routes/api.ts`)
- **Jikan Search Proxy**: `/api/search`
- **Anime Details Proxy**: `/api/anime/:id`
- **Stream Extraction**: `/api/stream`
- **CORS Proxy**: `/api/proxy` - Rewrites m3u8 URLs to go through proxy

## Important Notes

### Kuhi API Setup
If you want to stream videos, you'll need to run Kuhi API locally:
```bash
pip install kuhi
uvicorn kuhi:app --reload --port 8000
```

**Note:** Kuhi API requires valid streaming sources. Some sources may be geo-blocked or require specific conditions.

### CORS Proxy Explained
The `/api/proxy` endpoint is critical for streaming:
1. Browser requests m3u8 playlist from `/api/proxy`
2. Backend fetches actual playlist from external source
3. Backend rewrites all segment URLs to go through proxy
4. Segments are fetched through proxy, bypassing CORS issues

### Legal Note
This project is for educational purposes. Ensure you have legal rights to stream content in your region.

## Testing the Setup

### 1. Test Jikan API
```bash
curl "http://localhost:3000/api/search?query=naruto"
```

### 2. Test Anime Details
```bash
curl "http://localhost:3000/api/anime/20"
```

### 3. Test with Demo Stream
For testing without Kuhi API, use a public test stream in VideoPlayer:
```typescript
const testUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Complete anime streaming setup"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects the setup

3. **Configure Environment**
   - Set `NODE_ENV=production`
   - Set `PORT` (Vercel assigns automatically)

4. **Deploy**
   - Click "Deploy"
   - Your site is live!

### Deploy to Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

2. **Configure**
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`
   - Environment: `NODE_ENV=production`

3. **Deploy**
   - Railway automatically deploys on push

### Deploy to Render

1. **Create Service**
   - Go to [render.com](https://render.com)
   - Create "New Web Service"
   - Connect GitHub

2. **Configure**
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`

3. **Deploy**
   - Render handles everything automatically

## Troubleshooting

### "Stream not found"
- Ensure Kuhi API is running on `http://127.0.0.1:8000`
- Check anime name and episode number are correct

### HLS.js errors
- Check network tab in browser DevTools
- Verify proxy is rewriting playlist URLs correctly

### CORS errors
- Ensure `/api/proxy` endpoint is working
- Check that all segment URLs are being proxied

### Search returns no results
- Verify Jikan API is accessible
- Try different search terms

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Application environment |
| PORT | 3000 | Server port |
| KUHI_API_URL | http://127.0.0.1:8000 | Kuhi API endpoint (optional) |

## Contributing

Pull requests are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT - See LICENSE file for details

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check existing issues for solutions

## Disclaimer

This project is for educational purposes only. Users are responsible for ensuring legal compliance in their jurisdiction when streaming content.

---

**Made with ❤️ for anime lovers**
