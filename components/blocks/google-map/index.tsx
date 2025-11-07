"use client";

import GoogleMapReact from "google-map-react";

interface GoogleMapProps {
  apiKey?: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  placeName?: string; // place name, for embed mode
}

const defaultCenter = {
  lat: 31.3089, // Suzhou New District, Bosen Building, Guangda Road
  lng: 120.5853, // Suzhou New District, Bosen Building, Guangda Road
};

const defaultZoom = 13;

export const GoogleMap = ({
  apiKey,
  center = defaultCenter,
  zoom = defaultZoom,
  placeName,
}: GoogleMapProps) => {
  const finalApiKey =
    apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // if (!finalApiKey) then use Google Maps Embed API（iframe mode, no key required）
  if (!finalApiKey) {
    const { lat, lng } = center;
    // use Google Maps standard embed URL (without API key)
    const embedUrl = placeName
      ? `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`
      : `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: finalApiKey,
        }}
        defaultCenter={center}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
      />
    </div>
  );
};
