import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, User, Phone, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/food/Navbar";
import Footer from "@/components/food/Footer";
import OrderHistoryCard from "@/components/food/OrderHistoryCard";
import { base44 } from "@/api/base44Client";

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
      } catch { setUser(null); }

      try {
        const data = await base44.entities.Order.list("-created_date", 50);
        setOrders(data);
      } catch { setOrders([]); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-24 sm:pt-28 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl shadow-orange-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl sm:text-4xl">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "👤"}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                {user?.full_name || "Foodie"}
              </h1>
              {user?.email && <p className="text-white/80 text-sm mt-0.5">{user.email}</p>}
              <p className="text-white/70 text-xs mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
            </div>
          </div>
        </motion.div>

        {/* Order History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Order <span className="gradient-text">History</span>
          </h2>
          <p className="text-gray-500 text-sm">View past orders and reorder your favorites instantly</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-gray-100 rounded" />
                    <div className="w-16 h-2 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-100 rounded" />
                  <div className="w-2/3 h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400">Your past orders will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <OrderHistoryCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}