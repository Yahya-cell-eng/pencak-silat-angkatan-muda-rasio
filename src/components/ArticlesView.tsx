import React, { useState } from 'react';
import { Article } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
  Filter,
  MessageCircle,
  Instagram,
  MessageSquare,
  Send,
  Trash2,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ArticleShareModal } from './ArticleShareModal';

export const ArticlesView: React.FC = () => {
  const { articles, comments, incrementArticleViews, addArticleComment, deleteArticleComment, getArticleComments } = useData();
  const { currentUser, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);

  // Comment input form state
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);

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

  // Auto open article if specified in URL query (e.g. ?articleId=art-1 or ?article=art-1)
  React.useEffect(() => {
    if (typeof window === 'undefined' || articles.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('articleId') || params.get('article');
    if (targetId && !activeArticle) {
      const found = articles.find(a => a.id === targetId);
      if (found) {
        handleOpenArticle(found);
      }
    }
  }, [articles]);

  // Update dynamic meta tags when an article is active
  React.useEffect(() => {
    if (!activeArticle || typeof document === 'undefined') return;
    
    const prevTitle = document.title;
    document.title = `${activeArticle.title} - PAMUR Pencak Silat`;

    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('property', 'og:title', activeArticle.title);
    setMetaTag('property', 'og:description', activeArticle.excerpt);
    setMetaTag('property', 'og:image', activeArticle.imageUrl);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('name', 'twitter:title', activeArticle.title);
    setMetaTag('name', 'twitter:description', activeArticle.excerpt);
    setMetaTag('name', 'twitter:image', activeArticle.imageUrl);

    return () => {
      document.title = prevTitle;
    };
  }, [activeArticle]);

  const handleOpenArticle = (article: Article) => {
    incrementArticleViews(article.id);
    setActiveArticle(article);
    setCommentText('');
    setCommentFeedback(null);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle) return;
    if (!commentText.trim()) return;

    const authorName = currentUser?.name || guestName.trim() || 'Pesilat Sahabat PAMUR';
    const authorRole = currentUser?.role === 'admin' ? 'admin' : (currentUser ? 'anggota' : 'guest');
    const authorBelt = currentUser?.beltRank;

    setIsSubmittingComment(true);
    const res = await addArticleComment({
      articleId: activeArticle.id,
      userId: currentUser?.id,
      userName: authorName,
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
      userBeltRank: authorBelt,
      userRole: authorRole,
      content: commentText.trim()
    });
    setIsSubmittingComment(false);

    if (res.success) {
      setCommentText('');
      if (!currentUser) setGuestName('');
      setCommentFeedback('Komentar berhasil dipublikasikan!');
      setTimeout(() => setCommentFeedback(null), 3000);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Hapus komentar ini?')) {
      await deleteArticleComment(commentId);
    }
  };

  const featuredArticle = publishedArticles[0];
  const activeComments = activeArticle ? getArticleComments(activeArticle.id) : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 text-red-700 text-xs font-semibold">
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
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                id="search-articles-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul artikel, jurus, teknik, atau berita..."
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-500 flex items-center gap-1.5 shrink-0 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Kategori:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-red-700 to-red-800 text-white shadow-xs font-bold'
                : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-200/90 shadow-2xs'
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
          className="group bg-white border border-slate-200/80 hover:border-red-200 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 h-64 lg:h-auto relative overflow-hidden bg-slate-100">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-red-700 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">
                Sorotan Utama
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-700">
                <span className="bg-red-50 px-2 py-0.5 rounded-md border border-red-100">{featuredArticle.category}</span>
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
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{featuredArticle.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
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
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Daftar Artikel ({filteredArticles.length})
          </h2>
          {searchQuery && (
            <span className="text-xs text-slate-400">
              Hasil pencarian "{searchQuery}"
            </span>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
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
                className="group bg-white border border-slate-200/80 hover:border-red-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col cursor-pointer"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase bg-red-700 px-2.5 py-0.5 rounded-md shadow-xs">
                    {article.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {article.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {article.views} dibaca
                      </span>
                      <span className="flex items-center gap-1 text-red-700 font-medium">
                        <MessageSquare className="w-3 h-3" />
                        {comments.filter(c => c.articleId === article.id).length} Komentar
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
                    <span className="text-slate-500 truncate max-w-[120px] text-[11px]">
                      Oleh: <strong className="text-slate-700">{article.author}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingArticle(article);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Bagikan ke WhatsApp, Instagram, TikTok"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-red-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0 text-xs">
                        Baca <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800 my-8">
            
            {/* Modal Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                {activeArticle.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSharingArticle(activeArticle)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Bagikan ke WhatsApp, Instagram, TikTok"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden h-64 sm:h-80 w-full bg-slate-100 shadow-2xs">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
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
              <p className="text-sm text-slate-700 font-medium italic border-l-4 border-red-700 pl-4 py-2 leading-relaxed bg-red-50/60 rounded-r-xl">
                {activeArticle.excerpt}
              </p>

              {/* Body Content */}
              <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {activeArticle.content}
              </div>

              {/* Social Share Bar Inside Reader */}
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Share2 className="w-4 h-4 text-red-700" />
                    <span>Bagikan Artikel Ini:</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Pilih media sosial</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp with Image preview link */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🥋 *${activeArticle.title}*\n_${activeArticle.category}_\n\n${activeArticle.excerpt}\n\n📷 *Foto Materi:* ${activeArticle.imageUrl}\n\n📖 *Baca di Portal PAMUR:*\n${typeof window !== 'undefined' ? window.location.href : 'https://pamur.id'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp + Foto</span>
                  </a>

                  {/* Instagram */}
                  <button
                    type="button"
                    onClick={() => setSharingArticle(activeArticle)}
                    className="p-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram & Foto</span>
                  </button>

                  {/* Buka Semua Opsi / Native Share */}
                  <button
                    type="button"
                    onClick={() => setSharingArticle(activeArticle)}
                    className="p-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan Lengkap</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                    <Tag className="w-3.5 h-3.5" /> Topik:
                  </span>
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* COMMENTS & DISCUSSION SECTION */}
              <div className="pt-6 border-t border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200/60 text-red-700 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Diskusi & Komentar Pesilat ({activeComments.length})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Sampaikan tanggapan, pertanyaan jurus, atau apresiasi Anda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comment Feedback Alert */}
                {commentFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{commentFeedback}</span>
                  </div>
                )}

                {/* Form Tambah Komentar */}
                <form onSubmit={handleAddComment} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {currentUser ? (
                        <>
                          <img
                            src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                            alt={currentUser.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                          {currentUser.role === 'admin' ? (
                            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Admin Pengurus</span>
                          ) : (
                            <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">Sabuk {currentUser.beltRank || 'Dasar'}</span>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <User className="w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Nama Anda (atau masuk akun)"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-red-700"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Terbuka untuk umum & anggota</span>
                  </div>

                  <div>
                    <textarea
                      id="article-comment-input"
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Tuliskan komentar atau pertanyaan tentang artikel ini..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700/20"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !commentText.trim()}
                      className="py-1.5 px-4 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar'}</span>
                    </button>
                  </div>
                </form>

                {/* List of Comments */}
                {activeComments.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    Belum ada komentar pada artikel ini. Jadilah yang pertama memberikan tanggapan!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeComments.map((comment) => {
                      const canDelete = isAdmin || (currentUser && currentUser.id === comment.userId);
                      return (
                        <div
                          key={comment.id}
                          className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={comment.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userName)}`}
                                alt={comment.userName}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                                  {comment.userRole === 'admin' && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-red-50 text-red-700 border border-red-200/60 font-bold px-1.5 py-0.2 rounded-md">
                                      <ShieldCheck className="w-2.5 h-2.5" /> Admin
                                    </span>
                                  )}
                                  {comment.userBeltRank && comment.userRole !== 'admin' && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-1.5 py-0.2 rounded-md">
                                      <Award className="w-2.5 h-2.5 text-red-600" /> {comment.userBeltRank}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                              </div>
                            </div>

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus komentar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed pl-9 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Close Bar */}
            <div className="p-4 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSharingArticle(activeArticle)}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-red-700" />
                <span>Buka Opsi Bagikan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Tutup Artikel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Social Sharing Modal (WhatsApp, Instagram, TikTok) */}
      <ArticleShareModal
        article={sharingArticle}
        isOpen={!!sharingArticle}
        onClose={() => setSharingArticle(null)}
      />

    </div>
  );
};
