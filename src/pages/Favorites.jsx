import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/food/Navbar";
import Footer from "@/components/food/Footer";
import FoodCard from "@/components/food/FoodCard";
import FOOD_DATA from "@/lib/foodData";
import { useCart } from "@/lib/cartStore";

export default function Favorites() {
  const { getFavoritesList } = useCart();
  const favNames = getFavoritesList();
  const favItems = FOOD_DATA.filter(f => favNames.includes(f.name));

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-24 sm:pt-28 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Your <span className="gradient-text">Favorites</span> ❤️
          </h1>
          <p className="text-gray-500 mt-1">{favItems.length} saved dishes</p>
        </motion.div>

        {favItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Heart size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">No favorites yet</h3>
            <p className="text-gray-400 mb-6">Tap the heart icon on any dish to save it here</p>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg"
              >
                Explore Menu
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favItems.map((item, i) => (
              <FoodCard key={item.name} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}