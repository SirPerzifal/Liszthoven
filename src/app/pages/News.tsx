import { Link } from "react-router";
import { Calendar, ArrowRight, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ParallaxHero from "../components/ParallaxHero";

const allArticles = [
  {
    id: "summer-program",
    title: "Summer Intensive Program Announced",
    excerpt: "Join our exclusive 6-week summer program featuring masterclasses, ensemble performances, and one-on-one instruction from world-class faculty.",
    content: "We're thrilled to announce our Summer Intensive Program...",
    date: "May 10, 2026",
    category: "Programs",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Emily Rodriguez",
    readTime: "5 min read"
  },
  {
    id: "competition-winners",
    title: "Students Win Regional Competition",
    excerpt: "Three of our talented students took top honors at the Regional Music Competition, showcasing exceptional performances in piano, violin, and vocal categories.",
    content: "In a stunning display of musical excellence...",
    date: "May 8, 2026",
    category: "Achievements",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Michael Chen",
    readTime: "4 min read"
  },
  {
    id: "new-instructor",
    title: "Welcoming Renowned Violinist to Faculty",
    excerpt: "We're thrilled to announce the addition of award-winning violinist Maria Santos to our teaching staff. Maria brings decades of performance and teaching experience.",
    content: "Harmony Academy is proud to welcome...",
    date: "May 5, 2026",
    category: "Faculty",
    image: "https://images.unsplash.com/photo-1566913485268-1287f67f87fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Sarah Mitchell",
    readTime: "3 min read"
  },
  {
    id: "recital-success",
    title: "Spring Recital: A Resounding Success",
    excerpt: "Our Spring Student Recital was a spectacular showcase of talent, featuring performances from over 50 students across all instruments and levels.",
    content: "The Spring Recital exceeded all expectations...",
    date: "April 28, 2026",
    category: "Events",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "David Thompson",
    readTime: "6 min read"
  },
  {
    id: "practice-tips",
    title: "5 Essential Practice Tips for Musicians",
    excerpt: "Discover proven strategies to make your practice sessions more effective and enjoyable. From goal-setting to mindful repetition, these tips will transform your approach.",
    content: "Effective practice is the cornerstone of musical growth...",
    date: "April 22, 2026",
    category: "Education",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Emily Rodriguez",
    readTime: "7 min read"
  },
  {
    id: "scholarship-announcement",
    title: "New Scholarship Program for Young Musicians",
    excerpt: "Harmony Academy launches a scholarship program to support talented young musicians from underserved communities. Applications now open for Fall 2026.",
    content: "In our commitment to making music education accessible...",
    date: "April 15, 2026",
    category: "Programs",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Sarah Mitchell",
    readTime: "5 min read"
  },
  {
    id: "jazz-ensemble",
    title: "Student Jazz Ensemble Performs at City Festival",
    excerpt: "Our advanced jazz ensemble was selected to perform at the Annual City Music Festival, representing Harmony Academy alongside professional musicians.",
    content: "The Harmony Academy Jazz Ensemble made us proud...",
    date: "April 10, 2026",
    category: "Achievements",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Michael Chen",
    readTime: "4 min read"
  },
  {
    id: "studio-renovation",
    title: "Studio Renovation Complete: New Practice Spaces",
    excerpt: "Our newly renovated practice studios feature state-of-the-art acoustics, premium instruments, and comfortable learning environments for all students.",
    content: "After months of careful planning and construction...",
    date: "April 3, 2026",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "David Thompson",
    readTime: "6 min read"
  },
  {
    id: "music-theory-workshop",
    title: "Advanced Music Theory Workshop Series",
    excerpt: "Join our new workshop series covering advanced harmony, counterpoint, and analysis. Perfect for students preparing for college auditions or competitions.",
    content: "We're excited to introduce a comprehensive workshop series...",
    date: "March 28, 2026",
    category: "Education",
    image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    author: "Sarah Mitchell",
    readTime: "5 min read"
  }
];

const categories = ["All", "Programs", "Achievements", "Faculty", "Events", "Education", "Facilities"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const filteredArticles = allArticles.filter(
    article => selectedCategory === "All" || article.category === selectedCategory
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  const featuredArticle = sortedArticles[0];
  const otherArticles = sortedArticles.slice(1);

  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="News"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Stay Informed
            </div>
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight" style={{ fontStyle: 'italic' }}>News & Articles</h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
              The latest updates from Harmony Academy
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gold text-primary"
                      : "bg-card text-foreground border border-border hover:border-gold"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:border-gold transition-colors"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium mb-4">
                Featured Article
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <Link to={`/news/${featuredArticle.id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-2xl">
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                      {featuredArticle.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {featuredArticle.date}
                      </div>
                      <span>•</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-gold transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        By {featuredArticle.author}
                      </span>
                      <span className="text-gold font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <Link to={`/news/${article.id}`}>
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </div>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 group-hover:text-gold transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          By {article.author}
                        </span>
                        <span className="text-gold text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
