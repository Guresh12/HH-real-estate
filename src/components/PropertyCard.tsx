import { Bed, Bath, Maximize, User } from 'lucide-react';
import { Property } from '../types/database';
import { VirtualTourButton } from './VirtualTourButton';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'open house':
        return 'bg-blue-500';
      case 'sold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="relative h-64">
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 ${getStatusColor(property.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {property.status}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-3">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-600 mb-4 flex items-center">
          <span className="truncate">{property.location}</span>
        </p>

        <div className="flex items-center justify-between text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span className="text-sm">{property.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span className="text-sm">{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Maximize className="h-4 w-4" />
            <span className="text-sm">{property.size} sq ft</span>
          </div>
        </div>

        {property.agent_name && (
          <div className="border-t pt-4 flex items-center space-x-2 text-gray-700 mb-4">
            <User className="h-4 w-4" />
            <span className="text-sm">Agent: {property.agent_name}</span>
          </div>
        )}

        {property.virtual_tour && property.virtual_tour.is_active && (
          <VirtualTourButton tour={property.virtual_tour} />
        )}
      </div>
    </div>
  );
}
