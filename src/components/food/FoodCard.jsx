import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, Star, Clock, Flame } from "lucide-react";
import { addToCart, useCart, toggleFavorite, isFavorite } from "@/lib/cartStore";
import { useToast } from "@/components/ui/use-toast";

export default function FoodCard({ item, index = 0 }) {
  const { cart } = useCart();
  const { toast } = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);
  const cartItem = cart.find(c => c.name === item.name);
  const fav = isFavorite(item.name);

  const handleAdd = () => {
    addToCart(item);
    toast({ title: "Added to cart! 🛒", description: item.name });
  };

  const handleFav = () => {
    toggleFavorite(item.name);
  };

  const spiceColors = {
    "Mild": "text-green-500",
    "Medium": "text-yellow-500",
    "Spicy": "text-orange-500",
    "Extra Spicy": "text-red-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-500 border border-gray-100/50"
    >
      <div className="relative overflow-hidden aspect-square">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 animate-pulse" />
        )}
        <img
          src={item.image_url}
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleFav}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        >
          <Heart
            size={18}
            className={`transition-colors ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </motion.button>

        {item.is_popular && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
            ⭐ Popular
          </div>
        )}

        <div className={`absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium ${item.is_veg ? "text-green-600" : "text-red-600"}`}>
          <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.is_veg ? "border-green-600" : "border-red-600"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? "bg-green-600" : "bg-red-600"}`} />
          </span>
          {item.is_veg ? "Veg" : "Non-Veg"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 text-gray-400">
            <Clock size={12} />
            <span className="text-xs">{item.prep_time}</span>
          </div>
          <div className={`flex items-center gap-0.5 ${spiceColors[item.spice_level] || "text-gray-400"}`}>
            <Flame size={12} />
            <span className="text-xs">{item.spice_level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold gradient-text">₹{item.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-shadow"
          >
            <Plus size={14} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}