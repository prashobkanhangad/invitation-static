"use client";

import { useState } from "react";
import { openWhatsApp } from "@/utils/whatsapp";

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "wedding", name: "Weddings" },
    { id: "birthday", name: "Birthdays" },
    { id: "baby", name: "Baby Showers" },
    { id: "corporate", name: "Corporate" }
  ];

  const templates = [
    { id: 1, category: "wedding", gradient: "from-pink-200 to-purple-200", title: "Elegant Wedding" },
    { id: 2, category: "birthday", gradient: "from-yellow-200 to-orange-200", title: "Fun Birthday" },
    { id: 3, category: "baby", gradient: "from-blue-200 to-teal-200", title: "Baby Shower" },
    { id: 4, category: "corporate", gradient: "from-gray-200 to-slate-200", title: "Corporate Event" },
    { id: 5, category: "wedding", gradient: "from-rose-200 to-pink-200", title: "Romantic Wedding" },
    { id: 6, category: "birthday", gradient: "from-purple-200 to-indigo-200", title: "Kids Birthday" },
    { id: 7, category: "baby", gradient: "from-green-200 to-emerald-200", title: "Gender Reveal" },
    { id: 8, category: "corporate", gradient: "from-indigo-200 to-blue-200", title: "Conference" }
  ];

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Find the perfect design for any occasion.
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === category.id
                  ? "bg-[#333333] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group cursor-pointer transform transition-all hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <div className={`h-64 bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-white/30 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-white/30 rounded w-32 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/30 rounded w-24 mx-auto"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openWhatsApp(`Hi! I want to use the template: ${template.title}`)}
                    className="bg-white text-[#333333] px-6 py-2 rounded-full font-semibold transform -translate-y-2 group-hover:translate-y-0 transition-transform"
                  >
                    Use Template
                  </button>
                </div>
              </div>
              <p className="mt-3 text-center font-medium text-gray-800">{template.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
