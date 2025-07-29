'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  BookOpen,
  TrendingUp,
  Eye,
  ArrowRight,
  Loader2
} from 'lucide-react';
import BlogCard from './blog/BlogCard';
import BlogModal from './blog/BlogModal';
import BlogSearch from './blog/BlogSearch';
import BlogPagination from './blog/BlogPagination';

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 6;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('blog');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const articles = [
    {
      id: 1,
      title: "Next.js 14 : Les nouveautés qui révolutionnent le développement web",
      excerpt: "Découvrez les fonctionnalités révolutionnaires de Next.js 14 et comment elles transforment l'expérience développeur et utilisateur. App Router, Server Components, et bien plus encore.",
      content: `
        <h2>Introduction à Next.js 14</h2>
        <p>Next.js 14 marque une étape importante dans l'évolution du framework React le plus populaire. Cette version apporte des améliorations significatives en termes de performance, d'expérience développeur et de nouvelles fonctionnalités.</p>
        
        <h3>App Router : Une nouvelle approche</h3>
        <p>L'App Router révolutionne la façon dont nous structurons nos applications Next.js. Basé sur les Server Components de React, il offre une meilleure performance et une expérience utilisateur améliorée.</p>
        
        <h3>Server Components par défaut</h3>
        <p>Les Server Components sont maintenant la norme dans Next.js 14. Ils permettent de réduire la taille du bundle JavaScript côté client et d'améliorer les performances de chargement.</p>
        
        <h3>Turbopack en version stable</h3>
        <p>Turbopack, le successeur de Webpack, est maintenant stable et offre des temps de compilation jusqu'à 10x plus rapides pour les gros projets.</p>
        
        <h3>Conclusion</h3>
        <p>Next.js 14 confirme sa position de leader dans l'écosystème React avec des innovations qui simplifient le développement tout en améliorant les performances.</p>
      `,
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Développement",
      date: "15 Mars 2024",
      readTime: "5 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 1250,
      likes: 45,
      comments: 12,
      featured: true,
      tags: ["Next.js", "React", "JavaScript", "Performance", "Web Development"]
    },
    {
      id: 2,
      title: "Intelligence Artificielle dans le développement web : Guide pratique",
      excerpt: "Comment intégrer l'IA dans vos projets web pour automatiser les tâches et améliorer l'expérience utilisateur. Découvrez les outils et techniques essentiels.",
      content: `
        <h2>L'IA au service du développement web</h2>
        <p>L'intelligence artificielle transforme la façon dont nous développons et interagissons avec les applications web. De l'automatisation des tâches répétitives à la personnalisation de l'expérience utilisateur.</p>
        
        <h3>Outils d'IA pour développeurs</h3>
        <p>GitHub Copilot, ChatGPT, et d'autres outils d'IA révolutionnent la productivité des développeurs en assistant dans l'écriture de code et la résolution de problèmes.</p>
        
        <h3>Intégration d'APIs d'IA</h3>
        <p>L'intégration d'APIs comme OpenAI, Google AI, ou Azure Cognitive Services permet d'ajouter des fonctionnalités intelligentes à vos applications.</p>
        
        <h3>Cas d'usage pratiques</h3>
        <p>Chatbots intelligents, recommandations personnalisées, analyse de sentiment, génération de contenu automatique - les possibilités sont infinies.</p>
      `,
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "IA & Tech",
      date: "8 Mars 2024",
      readTime: "7 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 890,
      likes: 32,
      comments: 8,
      featured: false,
      tags: ["IA", "Machine Learning", "Automatisation", "UX", "API"]
    },
    {
      id: 3,
      title: "Architecture microservices : Retour d'expérience sur un projet réel",
      excerpt: "Les leçons apprises lors de la migration d'une application monolithique vers une architecture microservices. Défis, solutions et bonnes pratiques.",
      content: `
        <h2>De monolithe à microservices</h2>
        <p>La migration d'une architecture monolithique vers des microservices est un défi majeur qui nécessite une planification minutieuse et une exécution progressive.</p>
        
        <h3>Pourquoi migrer ?</h3>
        <p>Scalabilité, maintenabilité, déploiements indépendants, et résilience sont les principales motivations pour adopter une architecture microservices.</p>
        
        <h3>Défis rencontrés</h3>
        <p>Complexité de la communication inter-services, gestion des données distribuées, monitoring et debugging deviennent plus complexes.</p>
        
        <h3>Solutions adoptées</h3>
        <p>Utilisation de Docker, Kubernetes, API Gateway, et outils de monitoring comme Prometheus et Grafana pour gérer la complexité.</p>
        
        <h3>Leçons apprises</h3>
        <p>L'importance d'une stratégie de migration progressive, d'une bonne documentation, et d'une équipe formée aux nouvelles technologies.</p>
      `,
      image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Architecture",
      date: "1 Mars 2024",
      readTime: "10 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 1680,
      likes: 67,
      comments: 23,
      featured: true,
      tags: ["Microservices", "Docker", "Kubernetes", "DevOps", "Architecture"]
    },
    {
      id: 4,
      title: "RGPD et développement web : Guide de conformité 2024",
      excerpt: "Tout ce que vous devez savoir pour développer des applications web conformes au RGPD en 2024. Checklist complète et bonnes pratiques.",
      content: `
        <h2>RGPD : Un enjeu majeur pour les développeurs</h2>
        <p>Le Règlement Général sur la Protection des Données (RGPD) impose des obligations strictes aux développeurs d'applications web traitant des données personnelles.</p>
        
        <h3>Principes fondamentaux</h3>
        <p>Minimisation des données, consentement explicite, droit à l'oubli, et portabilité des données sont les piliers du RGPD.</p>
        
        <h3>Implémentation technique</h3>
        <p>Chiffrement des données, anonymisation, logs d'audit, et mécanismes de consentement doivent être intégrés dès la conception.</p>
        
        <h3>Checklist de conformité</h3>
        <p>Audit des données collectées, mise en place de politiques de confidentialité, formation des équipes, et tests de sécurité réguliers.</p>
      `,
      image: "https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Sécurité",
      date: "22 Février 2024",
      readTime: "8 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 720,
      likes: 28,
      comments: 15,
      featured: false,
      tags: ["RGPD", "Sécurité", "Conformité", "Privacy", "Legal"]
    },
    {
      id: 5,
      title: "TypeScript avancé : Patterns et techniques pour des applications robustes",
      excerpt: "Maîtrisez les concepts avancés de TypeScript pour créer des applications plus sûres et maintenables.",
      content: `
        <h2>TypeScript au niveau expert</h2>
        <p>TypeScript offre des fonctionnalités avancées qui permettent de créer des applications plus robustes et maintenables.</p>
        
        <h3>Types conditionnels et mapped types</h3>
        <p>Les types conditionnels et mapped types permettent de créer des types dynamiques et flexibles.</p>
        
        <h3>Decorators et métaprogrammation</h3>
        <p>Les décorateurs offrent des possibilités de métaprogrammation puissantes pour l'injection de dépendances et l'AOP.</p>
      `,
      image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Développement",
      date: "18 Février 2024",
      readTime: "12 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 945,
      likes: 52,
      comments: 18,
      featured: false,
      tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"]
    },
    {
      id: 6,
      title: "Performance web : Optimisations avancées pour 2024",
      excerpt: "Techniques modernes d'optimisation des performances web : Core Web Vitals, lazy loading, et plus encore.",
      content: `
        <h2>Performance web en 2024</h2>
        <p>Les performances web sont cruciales pour l'expérience utilisateur et le SEO. Découvrez les techniques les plus récentes.</p>
        
        <h3>Core Web Vitals</h3>
        <p>LCP, FID, et CLS sont les métriques clés à optimiser pour un bon classement Google.</p>
      `,
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Performance",
      date: "10 Février 2024",
      readTime: "9 min",
      author: {
        name: "Leonce Ouattara",
        avatar: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
        bio: "Expert IT & Solutions Digitales"
      },
      views: 1120,
      likes: 78,
      comments: 25,
      featured: false,
      tags: ["Performance", "Web Vitals", "SEO", "Optimization"]
    }
  ];

  // Extract unique categories and tags
  const categories = useMemo(() => {
    const cats = [...new Set(articles.map(article => article.category))];
    return cats;
  }, [articles]);

  const tags = useMemo(() => {
    const allTags = articles.flatMap(article => article.tags);
    return [...new Set(allTags)];
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
      const matchesTag = selectedTag === '' || article.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.views) - (a.likes + a.views);
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [articles, searchTerm, selectedCategory, selectedTag, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / postsPerPage);
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredArticles.slice(startIndex, startIndex + postsPerPage);
  }, [filteredArticles, currentPage, postsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag, sortBy]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Scroll to top of blog section
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const featuredArticles = articles.filter(article => article.featured);
  const stats = [
    { value: '31', label: 'Articles publiés', icon: <BookOpen className="w-8 h-8" /> },
    { value: '12.5K', label: 'Vues totales', icon: <Eye className="w-8 h-8" /> },
    { value: '2.3K', label: 'Abonnés', icon: <TrendingUp className="w-8 h-8" /> }
  ];

  return (
    <section id="blog" className="section-padding relative">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              Mon <span className="gradient-text">Blog</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Découvrez mes derniers articles sur les technologies web, les bonnes pratiques et les tendances du développement moderne. Restez à jour avec l'écosystème tech.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl text-center hover:border-[#00F5FF]/30 transition-all duration-300">
                <div className="text-[#00F5FF] mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <BlogSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              tags={tags}
            />
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && searchTerm === '' && selectedCategory === '' && selectedTag === '' && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Articles <span className="text-[#9D4EDD]">en vedette</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticles.slice(0, 2).map((article) => (
                  <BlogCard
                    key={article.id}
                    post={article}
                    onClick={handlePostClick}
                    variant="featured"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="mb-12">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00F5FF]" />
                  <span className="text-gray-400">Chargement des articles...</span>
                </div>
              </div>
            ) : paginatedArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article) => (
                  <BlogCard
                    key={article.id}
                    post={article}
                    onClick={handlePostClick}
                    variant="default"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
                  <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-400 mb-6">
                    Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedTag('');
                      setSortBy('date');
                    }}
                    className="btn-primary px-6 py-2 rounded-lg text-white font-medium"
                  >
                    Voir tous les articles
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mb-16">
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Restez informé des dernières actualités tech</h3>
              <p className="text-gray-400 mb-6">
                Recevez mes derniers articles, conseils et analyses directement dans votre boîte mail. Pas de spam, que du contenu de qualité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white placeholder-gray-400"
                />
                <button className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 justify-center hover:shadow-lg transition-all">
                  <span>S'abonner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Déjà <span className="text-[#00F5FF] font-semibold">2,300+</span> développeurs nous font confiance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Modal */}
      <BlogModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Blog;