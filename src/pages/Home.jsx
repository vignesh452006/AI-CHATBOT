import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Clock, Shield, ChefHat, Sparkles } from "lucide-react";
import Navbar from "@/components/food/Navbar";
import Footer from "@/components/food/Footer";
import FoodCard from "@/components/food/FoodCard";
import CategoryCard from "@/components/food/CategoryCard";
import FOOD_DATA, { CATEGORIES } from "@/lib/foodData";

const floatingEmojis = ["🍕", "🍔", "🍟", "🌮", "🍰", "🍜", "🥗", "🍦"];

export default function Home() {
  const popular = FOOD_DATA.filter(f => f.is_popular).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-amber-50/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl sm:text-5xl opacity-10"
              initial={{
                x: `${10 + (i * 12) % 80}%`,
                y: `${10 + (i * 15) % 70}%`,
              }}
              animate={{
                y: [`${10 + (i * 15) % 70}%`, `${5 + (i * 12) % 60}%`, `${10 + (i * 15) % 70}%`],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles size={16} />
                300+ Delicious Dishes
              </motion.div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Delicious Food,{" "}
                <span className="gradient-text">Delivered</span>{" "}
                To You
              </h1>

              <p className="text-gray-500 text-lg sm:text-xl mt-4 sm:mt-6 max-w-lg leading-relaxed">
                Explore 300+ mouth-watering dishes from 20 categories. Order now and taste the magic!
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <Link to="/menu">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-shadow text-lg"
                  >
                    Explore Menu
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <a href="https://wa.me/916379371994" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-lg border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all text-lg"
                  >
                    💬 WhatsApp Order
                  </motion.button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-3">
                  {["👨‍🍳", "👩‍🍳", "🧑‍🍳", "👨‍🍳"].map((e, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-lg">
                      {e}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Loved by 10,000+ customers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-orange-200"
                />
                <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-orange-200">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
                    alt="Delicious food"
                    className="w-full h-full object-cover"
                  />
                </div>
                {["🍔", "🍕", "🍦", "🥤"].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl"
                    style={{
                      top: `${[10, 60, 85, 30][i]}%`,
                      left: `${[-5, 90, 40, 95][i]}%`,
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { icon: ChefHat, label: "300+", sub: "Dishes", color: "from-orange-500 to-red-500" },
            { icon: Star, label: "4.8★", sub: "Rating", color: "from-amber-500 to-yellow-500" },
            { icon: Truck, label: "Free", sub: "Delivery", color: "from-green-500 to-emerald-500" },
            { icon: Clock, label: "30 min", sub: "Avg Time", color: "from-blue-500 to-indigo-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-lg border border-gray-100/50"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="font-heading font-bold text-xl sm:text-2xl text-gray-900">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-gray-500 mt-2">20 categories of deliciousness</p>
        </motion.div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 sm:mb-10"
        >
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
              Most <span className="gradient-text">Popular</span>
            </h2>
            <p className="text-gray-500 mt-1">Customer favorites you'll love</p>
          </div>
          <Link
            to="/menu"
            className="hidden sm:flex items-center gap-1 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            View All <ArrowRight size={18} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popular.map((item, i) => (
            <FoodCard key={item.name} item={item} index={i} />
          ))}
        </div>
        <Link to="/menu" className="sm:hidden flex items-center justify-center gap-1 mt-6 text-orange-600 font-semibold">
          View All Dishes <ArrowRight size={18} />
        </Link>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 sm:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 rounded-full bg-white"
                style={{ top: `${(i * 20) % 80}%`, left: `${(i * 18) % 80}%` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3 + i, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Hungry? Order Now!
            </h2>
            <p className="text-white/80 text-lg max-w-lg mx-auto mb-6">
              Call us or WhatsApp us directly. We'll deliver hot & fresh food to your doorstep!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:6379371994">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-orange-600 font-bold rounded-full shadow-xl text-lg"
                >
                  📞 Call: 6379371994
                </motion.button>
              </a>
              <a href="https://wa.me/916379371994" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-green-500 text-white font-bold rounded-full shadow-xl text-lg"
                >
                  💬 WhatsApp Order
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}