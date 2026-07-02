import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Home, Phone, Mail } from "lucide-react";
import Navbar from "@/components/food/Navbar";

export default function OrderSuccess() {
  useEffect(() => {
    // Confetti effect
    const colors = ['#ff6b35', '#ffd700', '#ff4757', '#2ed573', '#1e90ff'];
    const createConfetti = () => {
      for (let i = 0; i < 50; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
          position: fixed; top: -10px; left: ${Math.random() * 100}%;
          width: ${6 + Math.random() * 8}px; height: ${6 + Math.random() * 8}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          z-index: 9999; pointer-events: none;
          animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }
    };
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(${360 + Math.random() * 720}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    createConfetti();
    return () => style.remove();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-32 sm:pt-40 text-center px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
        >
          Order Placed! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-lg mb-8"
        >
          Your order has been sent via WhatsApp & Email. We'll confirm it shortly!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="font-heading font-bold text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3">
            <a href="tel:6379371994" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <Phone size={20} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Call Us</p>
                <p className="text-green-600 text-sm font-bold">+91 6379371994</p>
              </div>
            </a>
            <a href="mailto:chandranvignesh2006@gmail.com" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Mail size={20} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Email Us</p>
                <p className="text-blue-600 text-sm">chandranvignesh2006@gmail.com</p>
              </div>
            </a>
          </div>
        </motion.div>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg"
          >
            <Home size={20} />
            Back to Home
          </motion.button>
        </Link>
      </div>
    </div>
  );
}