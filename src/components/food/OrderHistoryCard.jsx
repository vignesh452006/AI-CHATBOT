import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { addToCart } from "@/lib/cartStore";
import FOOD_DATA from "@/lib/foodData";
import { useToast } from "@/components/ui/use-toast";
import OrderStatusTracker from "@/components/food/OrderStatusTracker";

const STATUS_CONFIG = {
  "Placed": { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Placed" },
  "Confirmed": { icon: CheckCircle, color: "text-indigo-600", bg: "bg-indigo-50", label: "Confirmed" },
  "Preparing": { icon: Package, color: "text-amber-600", bg: "bg-amber-50", label: "Preparing" },
  "Out for Delivery": { icon: Package, color: "text-orange-600", bg: "bg-orange-50", label: "Out for Delivery" },
  "Delivered": { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Delivered" },
  "Cancelled": { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
};

function parseItems(itemsStr) {
  if (!itemsStr) return [];
  return itemsStr.split(", ").map(part => {
    const match = part.match(/^(.+) x(\d+) \(₹(\d+)\)$/);
    if (match) {
      return { name: match[1], quantity: parseInt(match[2]), lineTotal: parseInt(match[3]) };
    }
    return { name: part, quantity: 1, lineTotal: 0 };
  });
}

export default function OrderHistoryCard({ order, index = 0 }) {
  const { toast } = useToast();
  const [reordered, setReordered] = useState(false);
  const parsedItems = parseItems(order.items);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["Placed"];
  const StatusIcon = status.icon;

  const handleReorder = () => {
    let added = 0;
    parsedItems.forEach(parsed => {
      const food = FOOD_DATA.find(f => f.name === parsed.name);
      if (food) {
        for (let i = 0; i < parsed.quantity; i++) {
          addToCart(food);
        }
        added++;
      }
    });
    if (added > 0) {
      setReordered(true);
      toast({ title: `Added ${added} item${added > 1 ? "s" : ""} to cart!`, description: "Ready to checkout." });
      setTimeout(() => setReordered(false), 2000);
    } else {
      toast({ title: "Could not reorder", description: "Items no longer available.", variant: "destructive" });
    }
  };

  const orderDate = order.created_date ? new Date(order.created_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${status.bg} rounded-xl flex items-center justify-center`}>
            <StatusIcon size={20} className={status.color} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Order #{order.id ? order.id.slice(-6).toUpperCase() : "—"}</p>
            <p className="text-xs text-gray-400">{orderDate}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="space-y-1.5 mb-4">
          {parsedItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate mr-2">{item.name} × {item.quantity}</span>
              <span className="text-gray-500 flex-shrink-0">₹{item.lineTotal}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400 block">Total Paid</span>
            <span className="font-heading font-bold text-lg gradient-text">₹{order.total}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReorder}
            disabled={reordered}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-100 disabled:opacity-70"
          >
            <RotateCcw size={16} className={reordered ? "animate-spin" : ""} />
            {reordered ? "Added!" : "Reorder"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}