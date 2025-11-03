import { useState } from 'react';
import { Video, X } from 'lucide-react';
import { VirtualTour } from '../types/database';

interface VirtualTourButtonProps {
  tour: VirtualTour;
}

export function VirtualTourButton({ tour }: VirtualTourButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const getEmbedCode = () => {
    if (tour.tour_url.includes('<iframe')) {
      return tour.tour_url;
    }

    if (tour.tour_url.includes('kuula.co')) {
      return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no"></iframe>`;
    }

    if (tour.tour_url.includes('matterport.com')) {
      return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allow="vr" allowfullscreen></iframe>`;
    }

    return `<iframe src="${tour.tour_url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2"
      >
        <Video className="h-4 w-4" />
        <span>Virtual Tour</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{tour.title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: getEmbedCode() }}
              />
              {tour.description && (
                <p className="mt-4 text-gray-600">{tour.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
