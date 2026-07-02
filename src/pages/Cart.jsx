import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/food/Navbar";
import { useCart, updateQuantity, removeFromCart, clearCart } from "@/lib/cartStore";

export default function Cart() {
  const { cart, total, count } = useCart();
  const navigate = useNavigate();
  const deliveryFee = total >= 499 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-8xl block mb-6">🛒</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">Add some delicious dishes to get started!</p>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg"
              >
                Browse Menu
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-24 sm:pt-28 max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/menu" className="inline-flex items-center gap-1 text-orange-600 font-medium text-sm mb-6 hover:text-orange-700">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Your <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-gray-500 mb-6">{count} items</p>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence>
            {cart.map((item, i) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 sm:gap-4 bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-sm ${item.is_veg ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                  <span className="text-sm font-bold gradient-text mt-1 block">₹{item.price}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => updateQuantity(item.name, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => updateQuantity(item.name, item.quantity + 1)}
                    className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeFromCart(item.name)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button onClick={clearCart} className="mt-4 text-sm text-red-500 hover:text-red-600 font-medium">
          Clear Cart
        </button>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({count} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-orange-600">Add ₹{499 - total} more for free delivery!</p>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="gradient-text">₹{grandTotal}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/checkout")}
            className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 text-lg"
          >
            <ShoppingBag size={20} />
            Proceed to Checkout
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}