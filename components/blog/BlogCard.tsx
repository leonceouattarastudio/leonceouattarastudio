'use client';

import React from 'react';
import { Calendar, Clock, Eye, Heart, MessageCircle, ArrowRight, Star } from 'lucide-react';
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

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onClick,
  variant = 'default',
  className = ''
}) => {
  const handleClick = () => {
    onClick(post);
  };

  if (variant === 'featured') {
    return (
      <article 
        className={cn(
          "group cursor-pointer glass-card rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-500 md:col-span-2",
          className
        )}
        onClick={handleClick}
      >
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2 relative overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-[#9D4EDD] to-[#DA70D6] rounded-full">
                <Star className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Featured</span>
              </div>
            </div>

            {/* Category */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm backdrop-blur-sm border border-[#00F5FF]/30">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-8">
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-[#00F5FF] transition-colors">
              {post.title}
            </h2>
            
            <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs border border-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Stats and Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
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
              
              <div className="flex items-center space-x-2 text-[#00F5FF] group-hover:text-[#9D4EDD] transition-colors">
                <span className="text-sm font-medium">Lire plus</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className={cn(
          "group cursor-pointer glass-card rounded-xl overflow-hidden border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-300",
          className
        )}
        onClick={handleClick}
      >
        <div className="flex space-x-4 p-4">
          {/* Small Image */}
          <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-lg">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded text-xs">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">{post.date}</span>
            </div>
            
            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[#00F5FF] transition-colors">
              {post.title}
            </h3>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article 
      className={cn(
        "group cursor-pointer glass-card rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-500",
        className
      )}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm backdrop-blur-sm border border-[#00F5FF]/30">
            {post.category}
          </span>
        </div>

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-[#9D4EDD] to-[#DA70D6] rounded-full">
              <Star className="w-3 h-3 text-white" />
              <span className="text-white text-xs">Featured</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#00F5FF] transition-colors">
          {post.title}
        </h2>
        
        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs border border-gray-600">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
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
          
          <div className="flex items-center space-x-2 text-[#00F5FF] group-hover:text-[#9D4EDD] transition-colors">
            <span className="text-sm font-medium">Lire plus</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;