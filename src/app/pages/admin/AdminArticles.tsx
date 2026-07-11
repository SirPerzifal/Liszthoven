import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Eye,
  Globe,
  FileText,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: "published" | "draft";
  category: string;
  image: string;
  views: number;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "Summer Music Program 2026 Now Open for Registration",
    excerpt:
      "Join our award-winning summer intensive program and take your musicianship to the next level.",
    content:
      "We are thrilled to announce that registration is now open for our highly anticipated Summer Music Program 2026. This year's program features an expanded curriculum...",
    author: "Alexandra Morrison",
    date: "2026-05-15",
    status: "published",
    category: "News",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 1842,
  },
  {
    id: 2,
    title: "Liszthoven Academy Students Win Regional Competition",
    excerpt:
      "Three of our talented students took home top honors at the Regional Youth Music Competition.",
    content:
      "We are incredibly proud to announce that three Liszthoven Academy students have won top prizes at the prestigious Regional Youth Music Competition held last weekend...",
    author: "James Rodriguez",
    date: "2026-05-08",
    status: "published",
    category: "Achievement",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 3201,
  },
  {
    id: 3,
    title: "Introducing Our New Faculty Members",
    excerpt:
      "We welcome three distinguished musicians to our growing team of educators.",
    content:
      "Liszthoven Academy is delighted to welcome three exceptional musicians to our faculty. These distinguished educators bring decades of performance and teaching experience...",
    author: "Alexandra Morrison",
    date: "2026-04-22",
    status: "published",
    category: "Faculty",
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 987,
  },
  {
    id: 4,
    title: "The Benefits of Early Music Education",
    excerpt:
      "Research shows that children who learn music develop stronger cognitive and social skills.",
    content:
      "Numerous studies have demonstrated the profound impact that early music education has on a child's development. From improved mathematical reasoning to enhanced language acquisition...",
    author: "Dr. Sarah Mitchell",
    date: "2026-04-10",
    status: "published",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 2456,
  },
  {
    id: 5,
    title: "Spring Recital Preview: What to Expect",
    excerpt:
      "Get a sneak peek at this year's spectacular spring recital featuring over 50 student performers.",
    content:
      "The anticipation is building for our annual Spring Recital, scheduled for June 15th. This year's event promises to be our most spectacular yet, featuring performances by over 50 students...",
    author: "Elena Vasquez",
    date: "2026-05-20",
    status: "draft",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 0,
  },
  {
    id: 6,
    title: "Choosing the Right Instrument for Your Child",
    excerpt:
      "A practical guide to help parents navigate the exciting journey of selecting a first instrument.",
    content:
      "Choosing your child's first instrument is one of the most important decisions in their musical journey. While there's no single right answer, there are several key factors to consider...",
    author: "Marcus Wright",
    date: "2026-05-25",
    status: "draft",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    views: 0,
  },
];

const emptyForm: Omit<Article, "id" | "views"> = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  date: new Date().toISOString().split("T")[0],
  status: "draft",
  category: "News",
  image: "",
};

const categoryColors: Record<string, string> = {
  News: "bg-blue-500/10 text-blue-400",
  Achievement: "bg-gold/10 text-gold",
  Faculty: "bg-purple-500/10 text-purple-400",
  Education: "bg-green-500/10 text-green-400",
  Events: "bg-orange-500/10 text-orange-400",
  Guide: "bg-cyan-500/10 text-cyan-400",
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] =
    useState<Omit<Article, "id" | "views">>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingArticle(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({ ...article });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.author) return;
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? { ...formData, id: a.id, views: a.views }
            : a,
        ),
      );
    } else {
      const id = Math.max(...articles.map((a) => a.id)) + 1;
      setArticles((prev) => [...prev, { ...formData, id, views: 0 }]);
    }
    setShowModal(false);
  };

  const togglePublish = (id: number) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "published" ? "draft" : "published" }
          : a,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>
            Article Management
          </h2>
          <p className="text-sm text-muted-foreground">
            {articles.filter((a) => a.status === "published").length} published
            · {articles.filter((a) => a.status === "draft").length} drafts
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        >
          {["All", "published", "draft"].map((s) => (
            <option key={s} value={s}>
              {s === "All"
                ? "All Status"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden hover:border-gold/40 transition-all"
          >
            <div className="relative h-40 bg-muted overflow-hidden">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="w-10 h-10 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}
                >
                  {article.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${article.status === "published" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-muted text-muted-foreground border-border"}`}
                >
                  {article.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 leading-snug">
                {article.title}
              </h3>
              <p
                className="text-xs text-muted-foreground line-clamp-2 mb-3"
                style={{ fontStyle: "normal" }}
              >
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{article.author}</span>
                <div className="flex items-center gap-3">
                  {article.status === "published" && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views.toLocaleString()}
                    </span>
                  )}
                  <span>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(article.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    article.status === "published"
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => openEdit(article)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {deleteConfirmId === article.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(article.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No articles found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">
                    {editingArticle ? "Edit Article" : "New Article"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      >
                        {[
                          "News",
                          "Achievement",
                          "Faculty",
                          "Education",
                          "Events",
                          "Guide",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as Article["status"],
                          })
                        }
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={5}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all"
                  >
                    {editingArticle ? "Save Changes" : "Create Article"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
