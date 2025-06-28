import React, { useState, useEffect } from 'react';
import { X, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchAPI } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  _id: string;
  title: string;
  summary: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  tags: string[];
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularTags, setPopularTags] = useState<Array<{ name: string; count: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      loadPopularTags();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query]);

  const loadPopularTags = async () => {
    try {
      const response = await searchAPI.getTags();
      setPopularTags(response.data.tags.slice(0, 10));
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await searchAPI.searchPosts({ q: query, limit: 5 });
      setResults(response.data.posts);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagName: string) => {
    setQuery(tagName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search posts, tags, or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim() ? (
            <>
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {results.map((post) => (
                    <Link
                      key={post._id}
                      to={`/post/${post._id}`}
                      onClick={onClose}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {post.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>by {post.author.name}</span>
                        <div className="flex space-x-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="p-4 text-center">
                    <Link
                      to={`/search?q=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      See all results for "{query}"
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </>
          ) : (
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;