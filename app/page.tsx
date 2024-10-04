import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { Globe, Menu, User, Star } from "lucide-react";
import Link from "next/link";
import SearchBar from "./components/search/search";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

export default function ManoLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="pt-5 pb-8 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8">
                Finden Sie erfahrene Handwerker
              </h1>
              <SearchBar />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "John Doe",
                  craft: "Woodworking",
                  rating: 4.9,
                  reviews: 120,
                },
                {
                  name: "Jane Smith",
                  craft: "Pottery",
                  rating: 4.8,
                  reviews: 95,
                },
                {
                  name: "Mike Johnson",
                  craft: "Metalworking",
                  rating: 4.7,
                  reviews: 80,
                },
                {
                  name: "Emily Brown",
                  craft: "Textile Arts",
                  rating: 4.9,
                  reviews: 150,
                },
              ].map((craftsman, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={"/assets/images/holzrausch.png"}
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
    </div>
  );
}
