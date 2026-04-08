import { MapPin } from "lucide-react";

export default function VenueMap() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Venue Location
          </h2>
          <p className="text-gray-600 font-sans text-lg max-w-2xl mx-auto mb-4">
            Villa Bellissima, Tuscany, Italy
          </p>
          <div className="flex items-center justify-center gap-2 text-[#333333]">
            <MapPin className="w-5 h-5" />
            <span className="font-sans">Via della Vigna 123, 53100 Siena SI, Italy</span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92326.89722736975!2d11.24273!3d43.318809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a3f3ce0d8ee13%3A0x402a6c0fee990!2sSiena%2C%20Province%20of%20Siena%2C%20Italy!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Wedding Venue Location"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 font-sans">
            Ceremony begins at 4:00 PM • Reception to follow
          </p>
        </div>
      </div>
    </section>
  );
}

