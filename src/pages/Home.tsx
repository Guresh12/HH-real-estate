import { useState } from 'react';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Property, WebsiteContent } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';

export function Home() {
  const [activeTab, setActiveTab] = useState('Sales');
  const [filters, setFilters] = useState({
    category: '',
    minSize: '',
    minLotSize: '',
    status: '',
  });

  const { data: heroContent } = useQuery<WebsiteContent>({
    queryKey: ['website-content', 'hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'hero')
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties', 'latest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const { data: citiesData = [] } = useQuery<{ city: string; count: number }[]>({
    queryKey: ['properties', 'by-city'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('city');
      if (error) throw error;

      const cityCounts = data.reduce((acc: Record<string, number>, prop) => {
        if (prop.city) {
          acc[prop.city] = (acc[prop.city] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .slice(0, 6);
    },
  });

  return (
    <div className="min-h-screen">
      <div
        className="relative bg-cover bg-center h-[600px] flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {heroContent?.title || 'Find Your Dream Home'}
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            {heroContent?.content || 'Discover the perfect property for you and your family'}
          </p>

          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl">
            <div className="flex space-x-4 mb-6">
              {['Rentals', 'Sales', 'Invest'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Property Category</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>

              <input
                type="number"
                placeholder="Min Size (sq ft)"
                value={filters.minSize}
                onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Min Lot Size"
                value={filters.minLotSize}
                onChange={(e) => setFilters({ ...filters, minLotSize: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Open House">Open House</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <Link
              to="/properties"
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Properties</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Properties by Area</h2>
          <p className="text-lg text-gray-600">
            Explore properties in different locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {citiesData.map((cityData) => (
            <Link
              key={cityData.city}
              to={`/properties?city=${cityData.city}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {cityData.city}
                </h3>
                <p className="text-gray-600 mt-2">{cityData.count} Properties Available</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Properties</h2>
              <p className="text-lg text-gray-600">
                Recently added properties to our portfolio
              </p>
            </div>
            <Link
              to="/properties"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
            >
              <span>View All</span>
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8">
            Schedule a site visit or contact us to learn more about our properties
          </p>
          <Link
            to="/site-visit"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Schedule a Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
