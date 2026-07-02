import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, User, Mail, FileText, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/food/Navbar";
import { useCart, clearCart } from "@/lib/cartStore";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function Checkout() {
  const { cart, total, count } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    payment_method: "Cash on Delivery"
  });

  const deliveryFee = total >= 499 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);

    const itemsSummary = cart.map(i => `${i.name} x${i.quantity} (₹${i.price * i.quantity})`).join(", ");

    try {
      await base44.entities.Order.create({
        customer_name: form.customer_name,
        phone: form.phone,
        email: form.email || "",
        address: form.address,
        items: itemsSummary,
        total: grandTotal,
        payment_method: form.payment_method,
        notes: form.notes || "",
        status: "Placed"
      });

      clearCart();
      navigate("/order-success");
    } catch (err) {
      toast({ title: "Could not place order", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <span className="text-6xl block mb-4">🛒</span>
          <h2 className="font-heading text-2xl font-bold mb-2">No items in cart</h2>
          <Link to="/menu" className="text-orange-600 font-medium">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const fields = [
    { key: "customer_name", label: "Full Name", icon: User, type: "text", required: true, placeholder: "Enter your name" },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel", required: true, placeholder: "Enter phone number" },
    { key: "email", label: "Email (Optional)", icon: Mail, type: "email", required: false, placeholder: "Enter email" },
    { key: "address", label: "Delivery Address", icon: MapPin, type: "textarea", required: true, placeholder: "Enter full address" },
    { key: "notes", label: "Special Notes (Optional)", icon: FileText, type: "textarea", required: false, placeholder: "Any special instructions..." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-24 sm:pt-28 max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <Link to="/cart" className="inline-flex items-center gap-1 text-orange-600 font-medium text-sm mb-6">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
        >
          <span className="gradient-text">Checkout</span>
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <field.icon size={16} className="text-orange-500" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  required={field.required}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition-all resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition-all"
                />
              )}
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CreditCard size={16} className="text-orange-500" />
              Payment Method
            </label>
            <div className="flex gap-3">
              {["Cash on Delivery", "Online Payment"].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleChange("payment_method", method)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.payment_method === method
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {method === "Cash on Delivery" ? "💵" : "💳"} {method}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-1.5 text-sm max-h-40 overflow-y-auto">
              {cart.map(item => (
                <div key={item.name} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="flex-shrink-0 font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span className="gradient-text">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing Order...
              </span>
            ) : (
              `Place Order — ₹${grandTotal}`
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}