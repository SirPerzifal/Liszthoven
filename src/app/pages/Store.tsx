import { useState } from "react";
import { ShoppingBag, Star, Filter, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import ParallaxHero from "../components/ParallaxHero";

const allProducts = [
  {
    id: 1,
    name: "Premium Acoustic Guitar",
    category: "Guitars",
    price: 899,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1556379118-7034d926d258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 2,
    name: "88-Key Digital Piano",
    category: "Keyboards",
    price: 1299,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 3,
    name: "Professional Violin Set",
    category: "Strings",
    price: 749,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1624367171718-14026220ee35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 4,
    name: "5-Piece Drum Kit",
    category: "Percussion",
    price: 1599,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 5,
    name: "Electric Guitar - Stratocaster Style",
    category: "Guitars",
    price: 699,
    rating: 4.6,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1563357989-f6cdbbae76cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 6,
    name: "Classical Guitar",
    category: "Guitars",
    price: 549,
    rating: 4.5,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1571992164651-76489ce4ae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: false
  },
  {
    id: 7,
    name: "MIDI Keyboard Controller",
    category: "Keyboards",
    price: 399,
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 8,
    name: "Professional Cello",
    category: "Strings",
    price: 2199,
    rating: 4.9,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 9,
    name: "Bass Guitar - 4-String",
    category: "Guitars",
    price: 649,
    rating: 4.6,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 10,
    name: "Electronic Drum Set",
    category: "Percussion",
    price: 899,
    rating: 4.8,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 11,
    name: "Upright Piano",
    category: "Keyboards",
    price: 3999,
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  },
  {
    id: 12,
    name: "Student Violin Outfit",
    category: "Strings",
    price: 299,
    rating: 4.4,
    reviews: 176,
    image: "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true
  }
];

const categories = ["All", "Guitars", "Keyboards", "Strings", "Percussion"];

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = allProducts.filter(
    product => selectedCategory === "All" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1556379118-7034d926d258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Music Store"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Premium Quality
            </div>
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight" style={{ fontStyle: 'italic' }}>Music Store</h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
              Premium instruments and accessories for every musician
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
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {product.inStock && (
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-gold text-gold"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-2xl font-bold text-gold">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.inStock && (
                          <button className="bg-gold text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all">
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $100</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">Premium instruments only</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-2xl flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
