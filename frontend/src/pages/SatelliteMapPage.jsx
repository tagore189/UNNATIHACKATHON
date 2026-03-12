import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Map as MapIcon, Layers, Satellite, Info, Navigation, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, WMSTileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map view updates
const MapViewHandler = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
};

const SatelliteMapPage = () => {
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [layerDetail, setLayerDetail] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India center
    const [zoom, setZoom] = useState(5);
    const [loading, setLoading] = useState(true);
    const [mapLoading, setMapLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const fetchLayers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bhuvan/layers');
                setLayers(response.data.layers);
                // Select first layer by default if available
                if (response.data.layers.length > 0) {
                    handleLayerSelect(response.data.layers[0].id);
                }
            } catch (err) {
                console.error('Bhuvan layers error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLayers();
    }, []);

    const handleLayerSelect = async (layerId) => {
        setMapLoading(true);
        setSelectedLayer(layerId);
        try {
            const res = await axios.get(`http://localhost:5000/api/bhuvan/tile-url/${layerId}`);
            setLayerDetail(res.data.layer);
        } catch (err) {
            console.error('Layer detail error:', err);
        } finally {
            // Give a small delay to simulate tile loading state if needed
            setTimeout(() => setMapLoading(false), 500);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setMapLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setUserLocation([latitude, longitude]);
                setZoom(12);
                setMapLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please ensure GPS is on and permissions are granted.');
                setMapLoading(false);
            }
        );
    };

    const getCategoryColor = (cat) => {
        const colors = { Agriculture: '#2e7d32', 'Land Use': '#1565c0', Terrain: '#6a1b9a', 'Water Resources': '#00838f', Weather: '#e65100' };
        return colors[cat] || '#333';
    };

    const getCategoryBg = (cat) => {
        const colors = { Agriculture: '#e8f5e9', 'Land Use': '#e3f2fd', Terrain: '#f3e5f5', 'Water Resources': '#e0f7fa', Weather: '#fff3e0' };
        return colors[cat] || '#f5f5f5';
    };

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <Loader2 size={50} className="animate-spin" color="#2e7d32" />
            <p style={{ fontSize: '1.2rem', color: '#666', fontWeight: 'bold' }}>Fetching Satellite Data Layers...</p>
        </div>
    );

    return (
        <div className="fade-in" style={{ padding: '20px 40px', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Satellite size={40} color="#2e7d32" /> ISRO Bhuvan Dynamic Maps
                    </h1>
                    <p style={{ color: '#558b2f', margin: 0, fontSize: '1rem' }}>
                        Geospatial Dashboard powered by <strong>ISRO Bhuvan WMS Services</strong>
                    </p>
                </div>
                <button
                    onClick={handleGetLocation}
                    className="btn-primary"
                    style={{
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#1b5e20'
                    }}
                >
                    <MapPin size={18} /> Focus My Farm
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '25px', height: 'calc(100vh - 180px)' }}>
                {/* Left Panel: Layers & Legend */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                    {/* Layers Card */}
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#2e7d32' }}>
                            <Layers size={20} /> Available Layers
                        </h3>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {layers.map((layer) => (
                                <div
                                    key={layer.id}
                                    onClick={() => handleLayerSelect(layer.id)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        border: selectedLayer === layer.id ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                        backgroundColor: selectedLayer === layer.id ? '#e8f5e9' : 'white',
                                        transition: 'all 0.2s ease',
                                        boxShadow: selectedLayer === layer.id ? '0 4px 10px rgba(46,125,50,0.1)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>{layer.name}</strong>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px',
                                            backgroundColor: getCategoryBg(layer.category), color: getCategoryColor(layer.category),
                                            textTransform: 'uppercase'
                                        }}>
                                            {layer.category}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{layer.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend Card */}
                    <AnimatePresence>
                        {layerDetail && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="glass-card"
                                style={{ padding: '20px' }}
                            >
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <Info size={18} color="#2e7d32" /> Scale & Legend
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {Object.entries(layerDetail.legend || {}).map(([color, label]) => (
                                        <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '24px', height: '14px', borderRadius: '3px',
                                                backgroundColor: color === 'green' ? '#4caf50' :
                                                    color === 'darkGreen' ? '#1b5e20' :
                                                        color === 'lightGreen' ? '#81c784' :
                                                            color === 'yellow' ? '#ffc107' :
                                                                color === 'brown' ? '#795548' :
                                                                    color === 'blue' ? '#2196f3' :
                                                                        color === 'darkBlue' ? '#1565c0' :
                                                                            color === 'lightBlue' ? '#03a9f4' :
                                                                                color === 'red' ? '#f44336' : '#666'
                                            }} />
                                            <span style={{ fontSize: '0.85rem', color: '#444', fontWeight: '500' }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                                        <strong>Attribution:</strong> {layerDetail.attribution}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>

                {/* Main Content: Map Container */}
                <main style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={zoom}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <MapViewHandler center={mapCenter} zoom={zoom} />

                        {/* Base Layers */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Bhuvan Satellite Layer (WMS) */}
                        <AnimatePresence>
                            {layerDetail && (
                                <WMSTileLayer
                                    key={layerDetail.id}
                                    url={layerDetail.wmsBaseUrl}
                                    layers={layerDetail.layerName}
                                    format={layerDetail.format}
                                    transparent={true}
                                    version="1.1.1"
                                    opacity={layerDetail.opacity || 0.7}
                                    attribution="ISRO Bhuvan"
                                />
                            )}
                        </AnimatePresence>

                        {/* User Location Marker */}
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>Your Current Location (Farm Center)</Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    {/* Map Overlays */}
                    <div style={{
                        position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
                        backgroundColor: 'rgba(255,255,255,0.95)', padding: '10px 20px',
                        borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #2e7d32'
                    }}>
                        <Satellite size={18} color="#2e7d32" />
                        <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '0.9rem' }}>
                            Layer: {layerDetail?.name || 'Loading...'}
                        </span>
                    </div>

                    {/* Loading Overlay */}
                    {mapLoading && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'rgba(255,255,255,0.6)', display: 'flex',
                            justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                            backdropFilter: 'blur(2px)'
                        }}>
                            <Loader2 size={40} className="animate-spin" color="#2e7d32" />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SatelliteMapPage;
