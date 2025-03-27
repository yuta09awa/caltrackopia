
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import MapView from "@/components/map/MapView";
import LocationList from "@/components/locations/LocationList";

const MapPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <Container>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Explore Nearby</h1>
            <p className="text-muted-foreground">
              Discover restaurants, grocery stores, and more with healthy options near you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 animate-fade-in">
              <MapView />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <LocationList />
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapPage;
