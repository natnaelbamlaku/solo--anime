import express from 'express';

const router = express.Router();

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const KUHI_BASE_URL = 'http://127.0.0.1:8000';

// 1. Jikan Search Proxy - Search for anime
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(String(query))}&limit=20`
    );
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search anime' });
  }
});

// 2. Get Anime Details & Episodes (Jikan)
router.get('/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [detailsRes, episodesRes] = await Promise.all([
      fetch(`${JIKAN_BASE_URL}/anime/${id}`),
      fetch(`${JIKAN_BASE_URL}/anime/${id}/episodes`)
    ]);

    const details = await detailsRes.json();
    const episodes = await episodesRes.json();

    res.json({ 
      details: details.data, 
      episodes: episodes.data 
    });
  } catch (error) {
    console.error('Anime details error:', error);
    res.status(500).json({ error: 'Failed to fetch anime details' });
  }
});

// 3. Kuhi Stream Extraction Proxy
router.get('/stream', async (req, res) => {
  try {
    const { animeName, episode } = req.query;

    if (!animeName || !episode) {
      return res.status(400).json({ error: 'animeName and episode parameters are required' });
    }

    const response = await fetch(
      `${KUHI_BASE_URL}/anime/extract/${encodeURIComponent(String(animeName))}?e=${episode}`
    );
    const data = await response.json() as any;

    if (data.streams && data.streams.length > 0) {
      const streamUrl = data.streams[0].url;
      // Return the proxied URL for the frontend to use
      res.json({ 
        proxiedUrl: `/api/proxy?url=${encodeURIComponent(streamUrl)}`,
        originalUrl: streamUrl 
      });
    } else {
      res.status(404).json({ error: 'Stream not found' });
    }
  } catch (error) {
    console.error('Stream extraction error:', error);
    res.status(500).json({ error: 'Stream extraction failed' });
  }
});

// 4. CORS Proxy for HLS Playlist and Segments
router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send('URL required');
    }

    const response = await fetch(String(url));
    const contentType = response.headers.get('content-type');

    // If it's an m3u8 playlist, rewrite all URLs to go through this proxy
    if (String(url).includes('.m3u8')) {
      let playlist = await response.text();
      const baseUrl = new URL(String(url));

      playlist = playlist.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || trimmed === '') return line;
        if (trimmed.startsWith('http')) {
          return `/api/proxy?url=${encodeURIComponent(trimmed)}`;
        }
        const absoluteUrl = new URL(trimmed, baseUrl).href;
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      }).join('\n');

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(playlist);
    }

    // For video segments (.ts, .m4s) or other files, stream directly with CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType || 'video/mp2t');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    if (response.body) {
      response.body.pipe(res);
    } else {
      res.status(500).send('No response body');
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error');
  }
});

// 5. Kuhi Search Proxy (optional - direct access to Kuhi search)
router.get('/kuhi/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await fetch(
      `${KUHI_BASE_URL}/anime/search?query=${encodeURIComponent(String(query))}`
    );
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Kuhi search error:', error);
    res.status(500).json({ error: 'Failed to search in Kuhi' });
  }
});

// 6. Get Episodes from Kuhi (optional - direct access)
router.get('/kuhi/episodes/:anilist_id', async (req, res) => {
  try {
    const { anilist_id } = req.params;

    const response = await fetch(
      `${KUHI_BASE_URL}/anime/episodes/${anilist_id}`
    );
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Kuhi episodes error:', error);
    res.status(500).json({ error: 'Failed to fetch episodes from Kuhi' });
  }
});

export default router;
