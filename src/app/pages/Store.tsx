import { useState } from "react";
import { ShoppingBag, Star, Filter, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import ParallaxHero from "../components/ParallaxHero";
import { useCart } from "../context/CartContext";
import { allProducts } from "../data/products";

const categories = ["All", "Guitars", "Keyboards", "Strings", "Percussion"];

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart, openCart, totalItems } = useCart();

  const filteredProducts = allProducts.filter(
    (product) => selectedCategory === "All" || product.category === selectedCategory
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
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight" style={{ fontStyle: "italic" }}>
              Music Store
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontStyle: "normal" }}>
              Premium instruments and accessories for every musician
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
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

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-primary font-medium text-sm hover:bg-gold-light transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-gold text-xs font-bold rounded-full flex items-center justify-center border border-gold">
                    {totalItems}
                  </span>
                )}
              </button>
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
                  {/* Image — clicking navigates to detail */}
                  <Link to={`/store/${product.id}`} className="block relative h-64 overflow-hidden bg-muted">
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
                    <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                      {product.category}
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col">
                    <Link to={`/store/${product.id}`}>
                      <h3 className="font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-gold">${product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {product.inStock && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                              });
                            }}
                            className="bg-gold text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
                          >
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
            {[
              { icon: ShoppingBag, title: "Free Shipping", desc: "On orders over $100" },
              { icon: Star, title: "Quality Guaranteed", desc: "Premium instruments only" },
              { icon: ArrowRight, title: "Easy Returns", desc: "30-day return policy" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
