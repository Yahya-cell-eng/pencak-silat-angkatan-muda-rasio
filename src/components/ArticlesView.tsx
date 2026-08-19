import React, { useState } from 'react';
import { Article } from '../types';
import { useData } from '../context/DataContext';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  ArrowRight, 
  X, 
  Share2, 
  Filter
} from 'lucide-react';

export const ArticlesView: React.FC = () => {
  const { articles, incrementArticleViews } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    'Semua',
    'Berita & Kegiatan',
    'Jurus & Teknik',
    'Filosofi & Sejarah',
    'Prestasi & Kejuaraan',
    'Pengumuman Resmi'
  ];

  const publishedArticles = articles.filter(a => a.status === 'published');

  const filteredArticles = publishedArticles.filter(article => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticle = (article: Article) => {
    incrementArticleViews(article.id);
    setActiveArticle(article);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const featuredArticle = publishedArticles[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Warta, Jurus & Khazanah PAMUR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
            Artikel & Edukasi Pencak Silat
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Kumpulan panduan jurus rasio, sejarah perguruan, liputan kejuaraan, serta warta resmi dari Dewan Pendekar PAMUR.
          </p>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="search-articles-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul artikel, jurus, teknik, atau berita..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Kategori:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Highlight Card */}
      {!searchQuery && selectedCategory === 'Semua' && featuredArticle && (
        <div 
          onClick={() => handleOpenArticle(featuredArticle)}
          className="group bg-white border border-slate-200 hover:border-red-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 h-64 lg:h-auto relative overflow-hidden bg-slate-200">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
            <div className="absolute top-3.5 left-3.5">
              <span className="px-2.5 py-0.5 bg-red-700 text-white text-[10px] font-bold uppercase rounded shadow-xs">
                Sorotan Utama
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-700">
                <span>{featuredArticle.category}</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-400 font-normal">{featuredArticle.createdAt}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug font-serif">
                {featuredArticle.title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{featuredArticle.author}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Daftar Artikel ({filteredArticles.length})
          </h2>
          {searchQuery && (
            <span className="text-xs text-slate-400">
              Hasil pencarian "{searchQuery}"
            </span>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada artikel yang cocok</h3>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                id={`article-card-${article.id}`}
                onClick={() => handleOpenArticle(article)}
                className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col cursor-pointer"
              >
                <div className="h-44 relative overflow-hidden bg-slate-200">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute bottom-2.5 left-2.5 text-white text-[10px] font-bold uppercase bg-red-700 px-2 py-0.5 rounded shadow-xs">
                    {article.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {article.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {article.views} dibaca
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[140px] text-[11px]">
                      Oleh: <strong className="text-slate-700">{article.author}</strong>
                    </span>
                    <span className="text-red-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0 text-xs">
                      Baca <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 my-8">
            
            {/* Modal Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                {activeArticle.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1.5 transition-colors"
                  title="Bagikan Tautan"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{copiedLink ? 'Tersalin!' : 'Bagikan'}</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Cover Image */}
              <div className="rounded-xl overflow-hidden h-64 sm:h-80 w-full bg-slate-100">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
                  {activeArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <User className="w-3.5 h-3.5 text-red-700" />
                    {activeArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {activeArticle.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {activeArticle.views} Kali Dibaca
                  </span>
                </div>
              </div>

              {/* Excerpt Lead */}
              <p className="text-sm text-slate-700 font-medium italic border-l-4 border-red-700 pl-4 py-1 leading-relaxed bg-red-50/50 rounded-r-lg">
                {activeArticle.excerpt}
              </p>

              {/* Body Content */}
              <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {activeArticle.content}
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                    <Tag className="w-3.5 h-3.5" /> Topik:
                  </span>
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Close Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Tutup Artikel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
