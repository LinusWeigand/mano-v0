"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";

interface SearchBarProps {
  isAbsolute: boolean;
}

export default function SearchBar({ isAbsolute }: SearchBarProps) {
  const [activeField, setActiveField] = useState<string | null>(null);

  return (
    <section className={`pt-5 pb-8 border-b`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col lg:max-w-xl mx-auto items-center">
          <h1 className="text-4xl font-bold text-center mb-8 w-[300px] sm:w-full">
            Finde erfahrene Handwerker
          </h1>
          <div className="flex mt-2 justify-center ">
            <Card className="self-center sm:w-full w-[300px] shadow-lg sm:rounded-[4rem] overflow-hidden r">
              <CardContent className="p-0 items-center ">
                <form className="flex flex-col sm:flex-row sm:items-center">
                  <div
                    className={`flex-1 p-2 transition-colors py-4 pl-8
                ${
                  activeField === "craft"
                    ? "bg-white hover:bg-white"
                    : activeField === null
                    ? "bg-white hover:bg-[#ebebeb]"
                    : "bg-muted hover:bg-[#dddddd]"
                }`}
                    onClick={() => setActiveField("craft")}
                  >
                    <label
                      htmlFor="craft"
                      className="block text-sm font-medium h-full text-foreground"
                    >
                      Handwerk
                    </label>
                    <Input
                      id="craft"
                      type="text"
                      placeholder="Gewerke suchen"
                      className="w-full border-none bg-transparent text-[16px] mt-[1px]"
                      onFocus={() => setActiveField("craft")}
                    />
                  </div>
                  <div
                    className={`flex-1 p-2 transition-colors py-4 pl-8
                 ${
                   activeField === "location"
                     ? "bg-white hover:bg-white"
                     : activeField === null
                     ? "bg-white hover:bg-[#ebebeb]"
                     : "bg-muted hover:bg-[#dddddd]"
                 }`}
                    onClick={() => setActiveField("location")}
                  >
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium h-full text-forground"
                    >
                      Standort
                    </label>
                    <div className="flex items-center mt-[1px]">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Ort suchen"
                        className="w-full border-none bg-transparent focus:ring-0 text-[16px]"
                        onFocus={() => setActiveField("location")}
                      />
                    </div>
                  </div>
                  <div
                    className={` flex flex-row items-center
                ${
                  activeField === "date"
                    ? "bg-white hover:bg-white"
                    : activeField === null
                    ? "bg-white hover:bg-[#ebebeb]"
                    : "bg-muted hover:bg-[#dddddd]"
                }`}
                    onClick={() => setActiveField("date")}
                  >
                    <div className="flex-1 flex flex-col p-2 transition-colors py-4 pl-8">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-foreground h-full"
                      >
                        Datum
                      </label>
                      <Select onOpenChange={() => setActiveField("date")}>
                        <SelectTrigger className="mt-[1px] w-full border-none bg-transparent focus:ring-0 text-[16px]">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                            <SelectValue
                              style={{ color: "var(--muted-foreground)" }}
                              className="text-muted-foreground placeholder:text-muted-foreground !text-muted-foreground"
                              placeholder="Datum auswählen"
                            />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">
                            So schnell wie möglich
                          </SelectItem>
                          <SelectItem value="this-week">Diese Woche</SelectItem>
                          <SelectItem value="next-week">
                            Nächste Woche
                          </SelectItem>
                          <SelectItem value="next-month">
                            Nächsten Monat
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div
                      className={`p-2 md:p-2 ${
                        activeField === null
                          ? "rounded-b-[4rem] md:rounded-r-[4rem] md:rounded-bl-none"
                          : ""
                      }`}
                    >
                      <Button className="mr-1 rounded-full bg-[#FF385C] hover:bg-[#FF385C]/90 text-white h-12 w-12 flex items-center justify-center">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
