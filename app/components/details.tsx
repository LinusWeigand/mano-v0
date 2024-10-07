import { Button } from "@/components/ui/button"
import { Globe, Instagram, Star, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DetailsProps {
  onClose: any
  name: string
  craft: string
  rating: number
  reviews: number
  location: string
  website: string
  instagram: string
  skills: string[]
  bio: string
  experience: number
  portfolio: string[]
  portfolio_description: string[]
}

export default function Details({
  onClose,
  name,
  craft,
  rating,
  reviews,
  location,
  website,
  instagram,
  skills,
  bio,
  experience,
  portfolio,
  portfolio_description,
}: DetailsProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row">
      <div className="relative md:w-1/2">
        <img
          src={portfolio[0] || `/placeholder.svg?height=600&width=600`}
          alt={`${name}'s work`}
          className="w-full h-48 sm:h-64 md:h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-2"
          onClick={() => onClose(false)}
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <ScrollArea className="flex-grow md:w-1/2">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{name}</h2>
          <p className="text-gray-600 mb-4">{craft}</p>
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-400 mr-1" />
            <span className="font-semibold mr-2">{rating}</span>
            <span className="text-gray-600">({reviews} reviews)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p>{location}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p>{experience} years</p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
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
            <p className="text-gray-600">{bio}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Portfolio</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {portfolio.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {portfolio_description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                <Globe className="h-5 w-5 mr-1" />
                Website
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                <Instagram className="h-5 w-5 mr-1" />
                Instagram
              </a>
            </div>
            <Button className="w-full sm:w-auto">Contact Craftsman</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}