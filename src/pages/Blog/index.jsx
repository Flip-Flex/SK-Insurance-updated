import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

import { FaBookOpen, FaUser, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('blogs', (data) => {
      if (data && data.length > 0) setBlogs(data);
    });
    return () => unsubscribe();
  }, []);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          Knowledge & Insights
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 dark:text-white mt-2">
          SK Smart Financial & Insurance Journal
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          Keep updated with active research, saving techniques, and premium risk management guidelines curated by our underwriters.
        </p>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post) => (
          <div
            key={post.id}
            className="glass-panel dark:glass-panel-gold rounded-3xl p-6 flex flex-col justify-between border border-slate-200/40 dark:border-white/5 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded">
                {post.category}
              </span>
              <h3 className="text-lg font-bold text-navy-950 dark:text-white line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <FaUser />
                  <span className="truncate max-w-[120px]">{post.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaCalendarAlt />
                  <span>{post.date}</span>
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="gold"
                className="w-full"
                icon={FaBookOpen}
                onClick={() => handleReadMore(post)}
              >
                Read Article
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPost?.title}
        size="lg"
      >
        {selectedPost && (
          <div className="space-y-4 text-left pt-2">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-100 dark:border-white/5 pb-3">
              <span className="px-2.5 py-0.5 rounded bg-gold-500/10 text-gold-500 font-semibold uppercase text-[10px]">
                {selectedPost.category}
              </span>
              <span>By {selectedPost.author}</span>
              <span>Published on {selectedPost.date}</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <div className="text-sm text-navy-950 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close Article</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Blog;
