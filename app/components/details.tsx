import { Button } from "@/components/ui/button";
import { Globe, Instagram, Star } from "lucide-react";
import { useState } from "react";

interface DetailsProps {
  onClose: any;
}

export default function Details({onClose}: DetailsProps) {

  const [selectedCraftsman, setSelectedCraftsman] = useState<any | null>(null);
    return(<>
            {selectedCraftsman && (
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl">
            <div className="relative h-64">
              <img
                src={
                  selectedCraftsman.portfolio[0] ||
                  `/placeholder.svg?height=300&width=600`
                }
                alt={`${selectedCraftsman.name}'s work`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2"
                onClick={() => onClose(false)}
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCraftsman.name}
              </h2>
              <p className="text-gray-600 mb-4">{selectedCraftsman.craft}</p>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-semibold mr-2">
                  {selectedCraftsman.rating}
                </span>
                <span className="text-gray-600">
                  ({selectedCraftsman.reviews} reviews)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p>{selectedCraftsman.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <p>{selectedCraftsman.experience} years</p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCraftsman.skills.map((skill: any, index: any) => (
                    <span
                      key={index}
                      className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{selectedCraftsman.bio}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Portfolio</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedCraftsman.portfolio.map((image: any, index: any) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedCraftsman.portfolioDescription}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <a
                    href={selectedCraftsman.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mr-4"
                  >
                    <Globe className="inline-block h-5 w-5 mr-1" />
                    Website
                  </a>
                  <a
                    href={`https://instagram.com/${selectedCraftsman.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    <Instagram className="inline-block h-5 w-5 mr-1" />
                    Instagram
                  </a>
                </div>
                <Button>Contact Craftsman</Button>
              </div>
            </div>
          </div>
        )}
    </>)
} 