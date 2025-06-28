import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  _id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <article 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
        isFeatured ? 'md:flex' : ''
      }`}
    >
      <div className={`p-6 ${isFeatured ? 'md:flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <Link
                to={`/profile/${post.author._id}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                {post.author.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="mb-4">
          <Link to={`/post/${post._id}`}>
            <h2 className={`font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 ${
              isFeatured ? 'text-2xl mb-3' : isCompact ? 'text-lg mb-2' : 'text-xl mb-3'
            }`}>
              {post.title}
            </h2>
          </Link>
          
          {!isCompact && (
            <p className="text-gray-600 line-clamp-3 mb-4">
              {post.summary || post.content.substring(0, 200) + '...'}
            </p>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <Link
            to={`/post/${post._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;