import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import Navbar from "@/components/food/Navbar";
import Footer from "@/components/food/Footer";

export default function Contact() {
  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 6379371994",
      sub: "Available 9 AM – 11 PM",
      href: "tel:6379371994",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      detail: "+91 6379371994",
      sub: "Quick responses!",
      href: "https://wa.me/916379371994",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "chandranvignesh2006@gmail.com",
      sub: "We reply within 2 hours",
      href: "mailto:chandranvignesh2006@gmail.com",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Clock,
      title: "Working Hours",
      detail: "9:00 AM – 11:00 PM",
      sub: "Open 7 days a week",
      href: null,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">
      <Navbar />
      <div className="pt-24 sm:pt-32 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-gray-900 mb-3">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Have questions or want to place an order? We're here to help!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {contactCards.map((card, i) => {
            const Wrapper = card.href ? "a" : "div";
            const wrapperProps = card.href
              ? { href: card.href, target: card.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" }
              : {};
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Wrapper {...wrapperProps} className="block">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`${card.bgColor} rounded-2xl p-6 border border-gray-100 cursor-pointer transition-shadow hover:shadow-lg`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                      <card.icon size={24} className="text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg">{card.title}</h3>
                    <p className="text-gray-700 font-medium mt-1 text-sm break-all">{card.detail}</p>
                    <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
                  </motion.div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 sm:p-10 text-center"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Order?
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Simply call or WhatsApp us with your order. We'll deliver fresh, hot food right to your door!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:6379371994">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-orange-600 font-bold rounded-full shadow-xl text-lg"
              >
                📞 Call Now
              </motion.button>
            </a>
            <a href="https://wa.me/916379371994" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-green-500 text-white font-bold rounded-full shadow-xl text-lg"
              >
                💬 WhatsApp
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}