import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { postsAPI } from '../../services/api';

interface PostFormProps {
  mode: 'create' | 'edit';
  postId?: string;
}

interface PostData {
  title: string;
  content: string;
  summary: string;
  tags: string;
  published: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ mode, postId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PostData>({
    title: '',
    content: '',
    summary: '',
    tags: '',
    published: true
  });

  useEffect(() => {
    if (mode === 'edit' && postId) {
      loadPost();
    }
  }, [mode, postId]);

  const loadPost = async () => {
    try {
      const response = await postsAPI.getPost(postId!);
      const post = response.data.post;
      setFormData({
        title: post.title,
        content: post.content,
        summary: post.summary || '',
        tags: post.tags.join(', '),
        published: post.published
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (mode === 'create') {
        const response = await postsAPI.createPost(postData);
        toast.success('Post created successfully!');
        navigate(`/post/${response.data.post._id}`);
      } else {
        const response = await postsAPI.updatePost(postId!, postData);
        toast.success('Post updated successfully!');
        navigate(`/post/${response.data.post._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your post..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="Write your post content here... (Markdown supported)"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="javascript, react, tutorial (comma separated)"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publish immediately
          </label>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Post'}</span>
            </button>
            
            {mode === 'edit' && (
              <button
                type="button"
                onClick={() => navigate(`/post/${postId}`)}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;