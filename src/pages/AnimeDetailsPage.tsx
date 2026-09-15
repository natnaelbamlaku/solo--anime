import React, { useState, useEffect } from 'react';
import { useRouter } from 'wouter';
import { ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

interface Episode {
  mal_id: number;
  url: string;
  title: string;
  title_romanji: string;
  title_japanese: string;
  aired: string;
  score: number;
  filler: boolean;
  recap: boolean;
}

interface AnimeDetails {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

export default function AnimeDetailsPage() {
  const [, params] = useRouter();
  const animeId = (params as any)?.id;
  
  const [details, setDetails] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [, navigate] = useRouter();

  useEffect(() => {
    async function fetchAnimeDetails() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/anime/${animeId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch anime details');
        }

        const data = await res.json();
        setDetails(data.details);
        
        if (data.episodes && data.episodes.length > 0) {
          setEpisodes(data.episodes);
          setSelectedEpisode(data.episodes[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load anime details');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (animeId) {
      fetchAnimeDetails();
    }
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-gray-400">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Search
          </button>
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
            {error || 'Anime not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            Back to Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Anime Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={details.images.jpg.large_image_url}
              alt={details.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-2">{details.title}</h1>
            
            {details.title_english && details.title_english !== details.title && (
              <p className="text-gray-400 text-lg mb-4">{details.title_english}</p>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-gray-800 p-4 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Type</p>
                <p className="text-white font-semibold">{details.type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Episodes</p>
                <p className="text-white font-semibold">{details.episodes}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-semibold">{details.status}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-white font-semibold">{details.score}/10</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Year</p>
                <p className="text-white font-semibold">{details.year}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Source</p>
                <p className="text-white font-semibold">{details.source}</p>
              </div>
            </div>

            {/* Genres */}
            {details.genres && details.genres.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {details.studios && details.studios.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Studios</p>
                <p className="text-white">
                  {details.studios.map((studio) => studio.name).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed">{details.synopsis}</p>
        </div>

        {/* Video Player Section */}
        {selectedEpisode && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Now Playing</h2>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-white text-lg font-semibold">
                Episode {selectedEpisode.mal_id}: {selectedEpisode.title}
              </p>
              {selectedEpisode.title_romanji && (
                <p className="text-gray-400 text-sm">{selectedEpisode.title_romanji}</p>
              )}
            </div>
            <VideoPlayer
              animeName={details.title}
              episodeNumber={selectedEpisode.mal_id}
            />
          </div>
        )}

        {/* Episodes List */}
        {episodes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode) => (
                <button
                  key={episode.mal_id}
                  onClick={() => setSelectedEpisode(episode)}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedEpisode?.mal_id === episode.mal_id
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'bg-gray-800 border-2 border-gray-700 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <PlayCircle
                      size={20}
                      className={selectedEpisode?.mal_id === episode.mal_id ? 'text-white' : 'text-gray-400'}
                      style={{ marginTop: '2px' }}
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        Episode {episode.mal_id}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {episode.title}
                      </p>
                      {episode.aired && (
                        <p className="text-gray-500 text-xs mt-1">{episode.aired}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {episodes.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-6 rounded-lg text-center">
            No episodes available yet
          </div>
        )}
      </div>
    </div>
  );
}
