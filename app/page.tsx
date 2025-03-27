import React from "react";
import Footer from "./components/footer";
import SearchBar from "./components/search";
import BodyWrapper from "./components/body/wrapper";

export default function ManoLandingPage() {

  return (
    <div className="flex flex-col min-h-screen relative">
      <SearchBar />
      <BodyWrapper />
      <Footer />
    </div>
  );
}
