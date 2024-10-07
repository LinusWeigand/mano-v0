"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Globe, Menu, User, Star, Instagram, X } from "lucide-react";
import Link from "next/link";
import Header from "./components/header";
import Footer from "./components/footer";
import SearchBar from "./components/search";
import Modal from "./components/modal";
import Details from "./components/details";

export default function ManoLandingPage() {
  const [selectedCraftsman, setSelectedCraftsman] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const craftsmen = [
    {
      name: "John Doe",
      craft: "Woodworking",
      rating: 4.9,
      reviews: 120,
      location: "München",
      website: "https://johndoe-woodworking.de",
      instagram: "@johndoe_wood",
      skills: ["Holzmöbel", "Küchen", "Badezimmer"],
      bio: "Mit über 15 Jahren Erfahrung in der Holzbearbeitung, spezialisiere ich mich auf maßgefertigte Möbel und Inneneinrichtungen. Meine Leidenschaft ist es, die Schönheit des Holzes in jedem Projekt zur Geltung zu bringen.",
      experience: 15,
      portfolio: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      portfolioDescription:
        "Mein Portfolio umfasst eine Vielzahl von Projekten, von eleganten Esstischen bis hin zu kompletten Küchenumbauten. Jedes Stück wird mit Präzision und Liebe zum Detail gefertigt.",
    },
    {
      name: "Jane Smith",
      craft: "Pottery",
      rating: 4.8,
      reviews: 95,
      location: "Berlin",
      website: "https://janesmith-pottery.de",
      instagram: "@janesmith_pottery",
      skills: ["Vasen", "Geschirr", "Skulpturen"],
      bio: "Als leidenschaftliche Töpferin verbinde ich traditionelle Techniken mit modernem Design. Meine Arbeiten sind sowohl funktional als auch ästhetisch ansprechend.",
      experience: 10,
      portfolio: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      portfolioDescription:
        "Meine Kollektion reicht von alltäglichem Geschirr bis hin zu einzigartigen Kunstobjekten. Jedes Stück erzählt eine Geschichte und bringt ein Stück Natur in Ihr Zuhause.",
    },
    {
      name: "Mike Johnson",
      craft: "Metalworking",
      rating: 4.7,
      reviews: 80,
      location: "Hamburg",
      website: "https://mikejohnson-metal.de",
      instagram: "@mike_metalcraft",
      skills: ["Schmiedearbeiten", "Metallskulpturen", "Restaurierung"],
      bio: "Mit einer Kombination aus traditioneller Schmiedekunst und modernen Schweißtechniken erschaffe ich einzigartige Metallarbeiten. Von funktionalen Gegenständen bis hin zu Kunstinstallationen - Metall ist meine Leinwand.",
      experience: 20,
      portfolio: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      portfolioDescription:
        "Mein Portfolio zeigt die Vielseitigkeit von Metallarbeiten. Es umfasst filigrane Tore, robuste Möbel und abstrakte Skulpturen, die die Grenzen des Materials ausloten.",
    },
    {
      name: "Emily Brown",
      craft: "Textile Arts",
      rating: 4.9,
      reviews: 150,
      location: "Frankfurt",
      website: "https://emilybrown-textiles.de",
      instagram: "@emily_textile_art",
      skills: ["Weben", "Stickerei", "Textildesign"],
      bio: "Als Textilkünstlerin verbinde ich traditionelle Webtechniken mit zeitgenössischem Design. Meine Arbeiten erforschen Textur, Farbe und Form in textilen Medien.",
      experience: 12,
      portfolio: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      portfolioDescription:
        "Meine Textilkunst reicht von handgewebten Wandteppichen bis hin zu innovativen Modeaccessoires. Jedes Stück ist ein Unikat, das Farbe und Textur in den Vordergrund stellt.",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <SearchBar isAbsolute={false} />
      <main className="flex-grow">
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold mb-8">Featured Craftsmen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {craftsmen.map((craftsman, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedCraftsman(craftsman);
                    setIsModalOpen(true);
                  }}
                >
                  <img
                    src={`/placeholder.svg?height=200&width=300`}
                    alt={`${craftsman.name}'s ${craftsman.craft}`}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{craftsman.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {craftsman.craft}
                    </p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-semibold mr-2">
                        {craftsman.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({craftsman.reviews} reviews)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Details />
      </Modal>
    </div>
  );
}
