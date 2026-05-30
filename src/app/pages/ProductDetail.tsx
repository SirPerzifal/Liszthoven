import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Star, ShoppingBag, ArrowLeft, ChevronRight, Minus, Plus, Check, Package, Shield, RotateCcw, Truck } from "lucide-react";
import { allProducts } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const product = allProducts.find((p) => p.id === Number(id));
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Product not found</h2>
          <Link to="/store" className="text-gold hover:text-gold-dark transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-background min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/store" className="hover:text-gold transition-colors">Store</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/store" className="hover:text-gold transition-colors">{product.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square mb-4 border border-border">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-destructive text-white px-6 py-3 rounded-xl font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
                {discount && (
                  <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                    -{discount}% OFF
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? "border-gold" : "border-border hover:border-gold/50"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="inline-block bg-gold/10 text-gold border border-gold/30 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="font-semibold ml-1">{product.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">SKU: {product.sku}</span>
              </div>

              <div className="flex items-end gap-4 mb-6 pb-6 border-b border-border">
                <span className="text-4xl font-semibold text-gold">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    Save ${(product.originalPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontStyle: "normal" }}>
                {product.description}
              </p>

              {/* Brand */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm text-muted-foreground">Brand:</span>
                <span className="text-sm font-semibold bg-muted px-3 py-1 rounded">{product.brand}</span>
              </div>

              {/* Quantity + Add to Cart */}
              {product.inStock ? (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-muted-foreground">Quantity:</label>
                    <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${
                        addedToCart
                          ? "bg-green-600 text-white"
                          : "bg-gold text-primary hover:bg-gold-light hover:shadow-gold/20"
                      }`}
                    >
                      {addedToCart ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={openCart}
                      className="px-6 py-4 rounded-xl border-2 border-gold text-gold hover:bg-gold/10 transition-all font-semibold"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-4 mb-8 text-center text-muted-foreground border border-border">
                  This product is currently out of stock
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "On orders over $100" },
                  { icon: Shield, label: "Quality Guarantee", sub: "30-day return policy" },
                  { icon: Package, label: "Secure Packaging", sub: "Safe delivery assured" },
                  { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free process" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 bg-muted rounded-xl p-3 border border-border">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl mb-6">Specifications</h2>
              <div className="bg-background rounded-xl border border-border overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-start gap-4 px-6 py-4 ${
                      i !== 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{key}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                {product.reviewList.map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-background rounded-xl p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold font-semibold text-sm">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-sm">{review.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${
                            j < review.rating ? "fill-gold text-gold" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontStyle: "normal" }}>
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl mb-8">More in {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link key={related.id} to={`/store/${related.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="h-48 overflow-hidden bg-muted">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-sm mb-1 line-clamp-2 hover:text-gold transition-colors">
                        {related.name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gold font-semibold">${related.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-gold text-gold" />
                          <span className="text-xs text-muted-foreground">{related.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
