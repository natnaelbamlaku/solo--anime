import React, { useState, useEffect } from 'react';
import { useRouter } from 'wouter';
import { Search, Loader2 } from 'lucide-react';

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
    };
  };
  synopsis: string;
  year?: number;
  status?: string;
  airing?: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();
      setResults(data.data || []);

      if (!data.data || data.data.length === 0) {
        setError('No anime found. Try a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search anime');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Anime Stream Hub</h1>
          <p className="text-gray-400">Search and stream your favorite anime</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition flex items-center gap-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
              <p className="text-gray-400">Searching anime...</p>
            </div>
          </div>
        )}

        {!loading && results.length === 0 && query && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found</p>
          </div>
        )}

        {!loading && results.length === 0 && !query && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Start searching for anime to get started</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((anime) => (
              <div
                key={anime.mal_id}
                onClick={() => navigate(`/anime/${anime.mal_id}`)}
                className="group cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition transform hover:scale-105"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-900 h-64">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                  {anime.airing && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Airing
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-blue-400 transition">
                    {anime.title}
                  </h3>
                  
                  {anime.year && (
                    <p className="text-gray-400 text-sm mb-2">{anime.year}</p>
                  )}

                  <p className="text-gray-400 text-sm line-clamp-3">
                    {anime.synopsis || 'No description available'}
                  </p>

                  {anime.status && (
                    <p className="text-gray-500 text-xs mt-3">{anime.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
