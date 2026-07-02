import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/food/Navbar";
import Footer from "@/components/food/Footer";
import FoodCard from "@/components/food/FoodCard";
import FOOD_DATA, { CATEGORIES } from "@/lib/foodData";

export default function Menu() {
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get("category") || "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCat);
  const [vegFilter, setVegFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  const filtered = useMemo(() => {
    let items = [...FOOD_DATA];

    if (category !== "All") {
      items = items.filter(i => i.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }
    if (vegFilter === "veg") items = items.filter(i => i.is_veg);
    if (vegFilter === "nonveg") items = items.filter(i => !i.is_veg);

    if (sortBy === "popular") items.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) || b.rating - a.rating);
    if (sortBy === "price_low") items.sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") items.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") items.sort((a, b) => b.rating - a.rating);
    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [search, category, vegFilter, sortBy]);

  const displayed = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />

      <div className="pt-24 sm:pt-28 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-gray-900">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-gray-500 mt-2">{FOOD_DATA.length} dishes to explore</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(24); }}
              placeholder="Search dishes, categories..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none shadow-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <span className="text-sm text-gray-400">{filtered.length} items</span>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden max-w-2xl mx-auto mb-6"
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-full mb-1">Diet</span>
                  {[
                    { val: "all", label: "All" },
                    { val: "veg", label: "🟢 Veg" },
                    { val: "nonveg", label: "🔴 Non-Veg" },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setVegFilter(opt.val)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        vegFilter === opt.val
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-full mb-1">Sort By</span>
                  {[
                    { val: "popular", label: "Popular" },
                    { val: "rating", label: "Rating" },
                    { val: "price_low", label: "Price: Low" },
                    { val: "price_high", label: "Price: High" },
                    { val: "name", label: "Name" },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSortBy(opt.val)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        sortBy === opt.val
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Chips */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2 min-w-max">
            <button
              onClick={() => { setCategory("All"); setVisibleCount(24); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === "All"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200"
              }`}
            >
              All ({FOOD_DATA.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = FOOD_DATA.filter(f => f.category === cat.name).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => { setCategory(cat.name); setVisibleCount(24); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    category === cat.name
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200"
                  }`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Grid */}
        {displayed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="font-heading text-xl font-bold text-gray-700">No dishes found</h3>
            <p className="text-gray-400 mt-1">Try a different search or category</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayed.map((item, i) => (
                <FoodCard key={item.name} item={item} index={i} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVisibleCount(v => v + 24)}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}