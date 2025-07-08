'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, ZoomIn, ZoomOut } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

import { PNG_GEOJSON, PNG_CENTER } from '@/lib/png-map-data';
import { PNG_PROVINCES } from '@/lib/geographic-data';

interface PNGInteractiveMapProps {
  onProvinceSelect?: (provinceId: string) => void;
  selectedProvince?: string;
  showCoverageData?: boolean;
}

export default function PNGInteractiveMap({
  onProvinceSelect,
  selectedProvince,
  showCoverageData = true
}: PNGInteractiveMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Simulate loading and prepare map data
    const timer = setTimeout(() => {
      setMapData(PNG_GEOJSON);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Clean up CSS link when component unmounts
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const getProvinceData = (provinceId: string) => {
    return PNG_PROVINCES.find(p => p.id === provinceId);
  };

  const getCoverageColor = (provinceId: string) => {
    const province = getProvinceData(provinceId);
    if (!province) return '#gray';

    const coverage = Math.round((province.children.fullyImmunized / province.children.total) * 100);

    if (coverage >= 95) return '#10b981'; // green
    if (coverage >= 85) return '#84cc16'; // lime
    if (coverage >= 75) return '#eab308'; // yellow
    if (coverage >= 65) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getCoverageLevel = (provinceId: string) => {
    const province = getProvinceData(provinceId);
    if (!province) return 'No Data';

    const coverage = Math.round((province.children.fullyImmunized / province.children.total) * 100);

    if (coverage >= 95) return 'Excellent';
    if (coverage >= 85) return 'Good';
    if (coverage >= 75) return 'Fair';
    if (coverage >= 65) return 'Poor';
    return 'Critical';
  };

  const onEachFeature = (feature: any, layer: any) => {
    const provinceId = feature.properties.id;
    const provinceName = feature.properties.name;
    const provinceData = getProvinceData(provinceId);

    if (!provinceData) return;

    const coverage = Math.round((provinceData.children.fullyImmunized / provinceData.children.total) * 100);
    const coverageLevel = getCoverageLevel(provinceId);

    // Style the province
    layer.setStyle({
      fillColor: getCoverageColor(provinceId),
      weight: selectedProvince === provinceId ? 3 : 1,
      opacity: 1,
      color: selectedProvince === provinceId ? '#1f2937' : 'white',
      dashArray: '',
      fillOpacity: 0.7
    });

    // Add hover effects
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#1f2937',
          dashArray: '',
          fillOpacity: 0.8
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: getCoverageColor(provinceId),
          weight: selectedProvince === provinceId ? 3 : 1,
          opacity: 1,
          color: selectedProvince === provinceId ? '#1f2937' : 'white',
          dashArray: '',
          fillOpacity: 0.7
        });
      },
      click: (e: any) => {
        if (onProvinceSelect) {
          onProvinceSelect(provinceId);
        }
      }
    });

    // Bind tooltip
    layer.bindTooltip(
      `<div class="p-2">
        <div class="font-bold text-gray-900">${provinceName}</div>
        <div class="text-sm text-gray-600">
          Coverage: <span class="font-semibold">${coverage}%</span> (${coverageLevel})
        </div>
        <div class="text-xs text-gray-500">
          Children: ${provinceData.children.total.toLocaleString()}
        </div>
        <div class="text-xs text-gray-500">
          Facilities: ${provinceData.facilities}
        </div>
      </div>`,
      {
        permanent: false,
        sticky: true,
        className: 'custom-tooltip',
        direction: 'auto'
      }
    );

    // Bind popup with detailed info
    layer.bindPopup(
      `<div class="p-4 min-w-64">
        <h3 class="font-bold text-lg text-gray-900 mb-2">${provinceName}</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Coverage Rate:</span>
            <span class="font-semibold text-${coverage >= 85 ? 'green' : coverage >= 75 ? 'yellow' : 'red'}-600">${coverage}%</span>
          </div>
          <div class="flex justify-between">
            <span>Total Children:</span>
            <span class="font-semibold">${provinceData.children.total.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span>Fully Immunized:</span>
            <span class="font-semibold text-green-600">${provinceData.children.fullyImmunized.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span>Health Facilities:</span>
            <span class="font-semibold">${provinceData.facilities}</span>
          </div>
          <div class="flex justify-between">
            <span>Budget Utilization:</span>
            <span class="font-semibold">${provinceData.budget.utilization}%</span>
          </div>
          <div class="mt-3 pt-2 border-t">
            <button onclick="window.selectProvince('${provinceId}')"
                    class="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>
      </div>`,
      {
        maxWidth: 300,
        className: 'custom-popup'
      }
    );
  };

  useEffect(() => {
    // Global function to handle province selection from popup
    (window as any).selectProvince = (provinceId: string) => {
      if (onProvinceSelect) {
        onProvinceSelect(provinceId);
      }
    };

    return () => {
      delete (window as any).selectProvince;
    };
  }, [onProvinceSelect]);

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading PNG Interactive Map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Papua New Guinea - Interactive Coverage Map
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click on any province to view detailed statistics
            </p>
          </div>
          {showCoverageData && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>≥95% Excellent</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-lime-500 rounded"></div>
                <span>≥85% Good</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>≥75% Fair</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>≥65% Poor</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>&lt;65% Critical</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full relative rounded-lg overflow-hidden border">
          <MapContainer
            center={[PNG_CENTER.lat, PNG_CENTER.lng]}
            zoom={PNG_CENTER.zoom}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapData && (
              <GeoJSON
                key={`geojson-${selectedProvince}`}
                data={mapData}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>

          {/* Custom Map Controls */}
          <div className="absolute top-4 right-4 z-10 space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-lg"
              onClick={() => {
                // Zoom in functionality would be implemented here
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-lg"
              onClick={() => {
                // Zoom out functionality would be implemented here
              }}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedProvince && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Selected
              </Badge>
              <span className="font-medium">
                {PNG_PROVINCES.find(p => p.id === selectedProvince)?.name}
              </span>
              <span className="text-sm text-gray-600">
                - {getCoverageLevel(selectedProvince)} Coverage ({Math.round((PNG_PROVINCES.find(p => p.id === selectedProvince)?.children.fullyImmunized || 0) / (PNG_PROVINCES.find(p => p.id === selectedProvince)?.children.total || 1) * 100)}%)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
