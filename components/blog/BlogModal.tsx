'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, Link2, Eye, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
}

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const shareUrl = `${window.location.origin}/blog/${post.id}`;
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        return;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-[90vh] max-w-4xl mx-4 my-8 bg-[#0A0A0B] rounded-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#0A0A0B]/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm">
              {post.category}
            </span>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-8">
            
            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4 p-4 glass-card rounded-xl border border-gray-700/50">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{post.author.name}</h3>
                  <p className="text-sm text-gray-400">{post.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <div 
                className="text-gray-300 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-600 hover:border-[#00F5FF] hover:text-[#00F5FF] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-700/50 pt-8 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Partager cet article</span>
              </h3>
              
              <div className="flex flex-wrap gap-4 pb-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
                
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </button>
                
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Copier le lien</span>
                </button>
              </div>
              
              {/* Espacement supplémentaire pour s'assurer que tout est visible */}
              <div className="h-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;