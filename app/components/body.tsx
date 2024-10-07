"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";
import Modal from "./modal";
import Details from "./details";

export default function Body() {

    const craftsmen = [
        {
            name: "Holzrausch",
            craft: "Schreinerei",
            rating: 4.9,
            reviews: 120,
            location: "München",
            website: "https://holzrausch.de",
            instagram: "@holzrausch",
            skills: ["Holzmöbel", "Küchen", "Badezimmer"],
            bio: "Mit über 15 Jahren Erfahrung in der Holzbearbeitung, spezialisiere ich mich auf maßgefertigte Möbel und Inneneinrichtungen. Meine Leidenschaft ist es, die Schönheit des Holzes in jedem Projekt zur Geltung zu bringen.",
            experience: 15,
            portfolio: [
                "/assets/images/holzrausch1.png",
                "/assets/images/holzrausch2.png",
                "/assets/images/holzrausch3.png",
            ],
            portfolioDescription:
                "Mein Portfolio umfasst eine Vielzahl von Projekten, von eleganten Esstischen bis hin zu kompletten Küchenumbauten. Jedes Stück wird mit Präzision und Liebe zum Detail gefertigt.",
        },
        {
            name: "Matteo",
            craft: "Schreiner",
            rating: 4.8,
            reviews: 95,
            location: "München",
            website: "https://matteo.de",
            instagram: "@matteo",
            skills: ["Küchen", "Möbel"],
            bio: "Als leidenschaftlicher Schreiner verbinde ich traditionelle Techniken mit modernem Design. Meine Arbeiten sind sowohl funktional als auch ästhetisch ansprechend.",
            experience: 10,
            portfolio: [
                "/assets/images/holzrausch4.png",
                "/assets/images/holzrausch5.png",
                "/assets/images/holzrausch6.png",
            ],
            portfolioDescription:
                "Meine Kollektion reicht von alltäglichem Geschirr bis hin zu einzigartigen Kunstobjekten. Jedes Stück erzählt eine Geschichte und bringt ein Stück Natur in Ihr Zuhause.",
        },
        {
            name: "Mike Johnson",
            craft: "Töpfer",
            rating: 4.7,
            reviews: 80,
            location: "München",
            website: "https://mikejohnson-metal.de",
            instagram: "@mike_metalcraft",
            skills: ["Schmiedearbeiten", "Metallskulpturen", "Restaurierung"],
            bio: "Mit einer Kombination aus traditioneller Schmiedekunst und modernen Schweißtechniken erschaffe ich einzigartige Metallarbeiten. Von funktionalen Gegenständen bis hin zu Kunstinstallationen - Metall ist meine Leinwand.",
            experience: 20,
            portfolio: [
                "/assets/images/holzrausch5.png",
                "/assets/images/holzrausch6.png",
                "/assets/images/holzrausch7.png",
            ],
            portfolioDescription:
                "Mein Portfolio zeigt die Vielseitigkeit von Metallarbeiten. Es umfasst filigrane Tore, robuste Möbel und abstrakte Skulpturen, die die Grenzen des Materials ausloten.",
        },
        {
            name: "Emily Brown",
            craft: "Bau",
            rating: 4.9,
            reviews: 150,
            location: "München",
            website: "https://emilybrown-textiles.de",
            instagram: "@emily_textile_art",
            skills: ["Weben", "Stickerei", "Textildesign"],
            bio: "Als Textilkünstlerin verbinde ich traditionelle Webtechniken mit zeitgenössischem Design. Meine Arbeiten erforschen Textur, Farbe und Form in textilen Medien.",
            experience: 12,
            portfolio: [
                "/assets/images/holzrausch8.png",
                "/assets/images/holzrausch9.png",
                "/assets/images/holzrausch10.png",
            ],
            portfolioDescription:
                "Meine Textilkunst reicht von handgewebten Wandteppichen bis hin zu innovativen Modeaccessoires. Jedes Stück ist ein Unikat, das Farbe und Textur in den Vordergrund stellt.",
        },
    ];

    const [selectedCraftsman, setSelectedCraftsman] = useState<any>(craftsmen[0]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <main className="flex-grow">
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {craftsmen.map((craftsman, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden cursor-pointer"
                                onClick={() => {
                                    setSelectedCraftsman(craftsman);
                                    setIsDetailsModalOpen(true);
                                }}
                            >
                                <img
                                    src={craftsman.portfolio[0]}
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

            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                <Details
                    onClose={setIsDetailsModalOpen}
                    name={selectedCraftsman.name}
                    craft={selectedCraftsman.craft}
                    rating={selectedCraftsman.rating}
                    reviews={selectedCraftsman.rating}
                    location={selectedCraftsman.location}
                    website={selectedCraftsman.website}
                    instagram={selectedCraftsman.instagram}
                    skills={selectedCraftsman.skills}
                    bio={selectedCraftsman.bio}
                    experience={selectedCraftsman.experience}
                    portfolio={selectedCraftsman.portfolio}
                    portfolio_description={selectedCraftsman.portfolio_description}
                />
            </Modal>
        </main>
    );
}