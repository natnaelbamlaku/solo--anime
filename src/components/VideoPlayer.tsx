import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  animeName: string;
  episodeNumber: number;
}

export default function VideoPlayer({ animeName, episodeNumber }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStream() {
      try {
        setLoading(true);
        setError(null);

        // Call YOUR backend to get the proxied stream URL
        const res = await fetch(
          `/api/stream?animeName=${encodeURIComponent(animeName)}&episode=${episodeNumber}`
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch stream');
        }

        const data = await res.json();
        if (data.proxiedUrl) {
          setStreamUrl(data.proxiedUrl);
        } else {
          setError('Stream URL not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stream');
        console.error('Stream fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStream();
  }, [animeName, episodeNumber]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.error('Play error:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          setError('Error loading video');
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari and other native HLS support
      video.src = streamUrl;
    } else {
      setError('HLS playback not supported in this browser');
    }
  }, [streamUrl]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="flex items-center justify-center bg-gray-900 h-96">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading stream...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center bg-gray-900 h-96">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          style={{ maxHeight: '600px' }}
        />
      )}
    </div>
  );
}
