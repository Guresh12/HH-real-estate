import { Building2, Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Smartphone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">Elite Properties</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect property.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/properties" className="text-gray-400 hover:text-white transition">
                  Properties
                </a>
              </li>
              <li>
                <a href="/plots" className="text-gray-400 hover:text-white transition">
                  Plots
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">info@eliteproperties.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">123 Main St, City</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <p className="text-gray-400">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#facebook" className="text-gray-400 hover:text-blue-500 transition transform hover:scale-110" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#instagram" className="text-gray-400 hover:text-pink-500 transition transform hover:scale-110" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#tiktok" className="text-gray-400 hover:text-white transition transform hover:scale-110" aria-label="TikTok">
              <Smartphone className="h-6 w-6" />
            </a>
            <a href="#whatsapp" className="text-gray-400 hover:text-green-500 transition transform hover:scale-110" aria-label="WhatsApp">
              <MessageCircle className="h-6 w-6" />
            </a>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Elite Properties. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
