
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// This file is kept for backward compatibility
// It redirects to the new refactored component
const LocationList = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the map page which contains the new LocationList component
    navigate('/map');
  }, [navigate]);

  return null;
};

export default LocationList;
