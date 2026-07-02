import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CategoryCard({ category, index = 0 }) {
  return (
    <Link to={`/menu?category=${encodeURIComponent(category.name)}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.08, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${category.color} cursor-pointer shadow-lg hover:shadow-xl transition-shadow overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
        <motion.span
          className="text-3xl sm:text-4xl relative z-10"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {category.icon}
        </motion.span>
        <span className="text-white font-semibold text-xs sm:text-sm text-center relative z-10 drop-shadow">
          {category.name}
        </span>
      </motion.div>
    </Link>
  );
}