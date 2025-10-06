"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, MapPin, Users, Music, Camera } from 'lucide-react';

interface InvitationData {
  couple_name_1: string;
  couple_name_2: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  special_message?: string;
  photo_urls: {
    photo_1?: string;
    photo_2?: string;
    photo_3?: string;
  };
  dress_code?: string;
}

const ElegantWedding: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Sample invitation data
  const invitation: InvitationData = {
    couple_name_1: "Sarah",
    couple_name_2: "Michael",
    event_name: "Wedding Ceremony",
    event_date: "2025-12-15",
    event_time: "16:00",
    venue_name: "Grand Ballroom Palace",
    venue_address: "123 Wedding Lane, Beautiful City, State 12345",
    special_message: "Two hearts, one love, a lifetime of happiness. Join us as we celebrate the beginning of our forever journey together.",
    photo_urls: {
      photo_1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920",
      photo_2: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800",
      photo_3: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    },
    dress_code: "Formal Attire - Evening Gowns & Suits",
  };

  useEffect(() => {
    setIsVisible(true);

    // Handle scroll to update active section
    const handleScroll = () => {
      const sections = ['home', 'events', 'gallery', 'location'];
      const scrollPosition = window.scrollY + 100;

      if (scrollPosition < 500) {
        setActiveSection('home');
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              <span className="text-xl font-semibold text-gray-800">
                {invitation.couple_name_1} & {invitation.couple_name_2}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-pink-600'
                      : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${invitation.photo_urls.photo_1 || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920'}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        </div>

        <div className={`relative text-center text-white px-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-lg md:text-xl mb-4 font-light tracking-widest">
            WE ARE GETTING MARRIED
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            {invitation.couple_name_1}
            <span className="block text-3xl md:text-4xl lg:text-5xl my-4 font-light">&</span>
            {invitation.couple_name_2}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-lg md:text-xl">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(invitation.event_date)}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Love Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Love Story</h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="h-px w-20 bg-pink-300"></span>
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              <span className="h-px w-20 bg-pink-300"></span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={invitation.photo_urls.photo_2 || 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800'}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                {invitation.special_message || `Join us as we celebrate the beginning of our forever. ${invitation.couple_name_1} and ${invitation.couple_name_2} invite you to share in the joy of their wedding day.`}
              </p>
              <p className="text-lg leading-relaxed">
                Together with our families, we request the honor of your presence as we exchange our vows and begin our journey as one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Wedding Events</h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="h-px w-20 bg-pink-300"></span>
              <Calendar className="w-6 h-6 text-pink-500" />
              <span className="h-px w-20 bg-pink-300"></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mehendi */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">🌿</span>
                  </div>
                  <h3 className="text-2xl font-bold">Mehendi</h3>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {new Date(new Date(invitation.event_date).getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-600">
                  <Clock className="w-4 h-4 inline mr-2" />
                  4:00 PM Onwards
                </p>
              </div>
            </div>

            {/* Wedding */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Wedding</h3>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {formatDate(invitation.event_date)}
                </p>
                <p className="text-gray-600">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {formatTime(invitation.event_time)}
                </p>
              </div>
            </div>

            {/* Reception */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Music className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Reception</h3>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {formatDate(invitation.event_date)}
                </p>
                <p className="text-gray-600">
                  <Clock className="w-4 h-4 inline mr-2" />
                  7:00 PM Onwards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Gallery</h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="h-px w-20 bg-pink-300"></span>
              <Camera className="w-6 h-6 text-pink-500" />
              <span className="h-px w-20 bg-pink-300"></span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              invitation.photo_urls.photo_1,
              invitation.photo_urls.photo_2,
              invitation.photo_urls.photo_3,
              'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
              'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400',
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
            ].filter(Boolean).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={img || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 px-4 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Venue Location</h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="h-px w-20 bg-pink-300"></span>
              <MapPin className="w-6 h-6 text-pink-500" />
              <span className="h-px w-20 bg-pink-300"></span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-20 h-20 text-pink-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{invitation.venue_name}</h3>
                <p className="text-gray-600 max-w-md mx-auto">{invitation.venue_address}</p>
              </div>
            </div>
            <div className="p-6">
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      {invitation.dress_code && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Dress Code</h2>
            <p className="text-xl text-gray-600">{invitation.dress_code}</p>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">RSVP</h2>
            <p className="text-gray-600 mb-8">
              We would be delighted to have you celebrate with us. Please confirm your attendance.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Confirm Your Attendance
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-semibold">
              {invitation.couple_name_1} & {invitation.couple_name_2}
            </span>
          </div>
          <p className="text-gray-400">
            Can't wait to celebrate with you!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ElegantWedding;

