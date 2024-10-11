import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Instagram, X, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSwipeable } from "react-swipeable"

interface DetailsProps {
  onClose: () => void
  name: string
  craft: string
  location: string
  website: string
  instagram: string
  skills: string[]
  bio: string
  experience: number
  photos: string[]
}

export default function Details({
  onClose,
  name,
  craft,
  location,
  website,
  instagram,
  skills,
  bio,
  experience,
  photos,
}: DetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }, [photos.length])

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }, [photos.length])

  const handlers = useSwipeable({
    onSwipedLeft: nextPhoto,
    onSwipedRight: prevPhoto,
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  const handleThumbnailClick = (index: number) => {
    setCurrentPhotoIndex(index)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-7xl h-[90vh] flex flex-col md:flex-row md:h-[80vh] md:w-[80vw] mx-auto">
      <div
        className="relative w-full md:w-1/2 h-48 sm:h-64 md:h-full"
        {...handlers}
      >
        <img
          src={photos[currentPhotoIndex] || `/placeholder.svg?height=600&width=600`}
          alt={`${name}'s work`}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-2 z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
        {photos.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={prevPhoto}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={nextPhoto}
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </>
        )}
      </div>
      <div className="flex-grow md:w-1/2 h-[calc(90vh-12rem)] sm:h-[calc(90vh-16rem)] md:h-full overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">{craft}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">Standort</h3>
                <p>{location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Erfahrung</h3>
                <p>{experience} {experience === 1 ? "Jahr" : "Jahre"}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Fähigkeiten</h3>
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
              <h3 className="font-semibold mb-2">Über</h3>
              <p className="text-gray-600">{bio}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className="w-full h-24 relative overflow-hidden rounded group"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform transition-transform duration-200 ${index === currentPhotoIndex ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      style={{ marginBottom: '-4px' }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <a
                  href={`https://${website}`}
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
              {/* <Button className="w-full sm:w-auto">Kontakt</Button> */}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}