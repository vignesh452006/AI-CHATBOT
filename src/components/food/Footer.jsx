import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍽️</span>
              <span className="font-heading text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                FoodieHub
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delicious food delivered to your doorstep. Order from 300+ dishes across 20 categories!
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Home</Link>
              <Link to="/menu" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Menu</Link>
              <Link to="/favorites" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Favorites</Link>
              <Link to="/cart" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:6379371994" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm">
                <Phone size={16} />
                +91 6379371994
              </a>
              <a href="mailto:chandranvignesh2006@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm">
                <Mail size={16} />
                chandranvignesh2006@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Order Now</h4>
            <p className="text-gray-400 text-sm mb-3">
              Call or email us directly to place your order!
            </p>
            <a
              href="https://wa.me/916379371994"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-shadow"
            >
              💬 WhatsApp Order
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by FoodieHub © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}