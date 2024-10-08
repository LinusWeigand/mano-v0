import React from "react";
import Footer from "./components/footer";
import SearchBar from "./components/search";
import Body from "./components/body";

export default function ManoLandingPage() {

  return (
    <div className="flex flex-col min-h-screen relative">
      <SearchBar />
      <Body />
      <Footer />
    </div>
  );
}
