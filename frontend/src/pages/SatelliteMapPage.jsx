import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Layers, Satellite, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const SatelliteMapPage = () => {
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [layerDetail, setLayerDetail] = useState(null);
    const [mapConfig, setMapConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [layerRes, mapRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/bhuvan/layers'),
                    axios.get('http://localhost:5000/api/bhuvan/map-embed')
                ]);
                setLayers(layerRes.data.layers);
                setMapConfig(mapRes.data);
            } catch (err) { console.error('Bhuvan error', err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleLayerSelect = async (layerId) => {
        setSelectedLayer(layerId);
        try {
            const res = await axios.get(`http://localhost:5000/api/bhuvan/tile-url/${layerId}`);
            setLayerDetail(res.data.layer);
        } catch (err) { console.error('Layer detail error', err); }
    };

    const getCategoryColor = (cat) => {
        const colors = { Agriculture: '#2e7d32', 'Land Use': '#1565c0', Terrain: '#6a1b9a', 'Water Resources': '#00838f', Weather: '#e65100' };
        return colors[cat] || '#333';
    };

    const getCategoryBg = (cat) => {
        const colors = { Agriculture: '#e8f5e9', 'Land Use': '#e3f2fd', Terrain: '#f3e5f5', 'Water Resources': '#e0f7fa', Weather: '#fff3e0' };
        return colors[cat] || '#f5f5f5';
    };

    if (loading) return <div className="p-20 text-center">Loading satellite data...</div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Satellite size={40} color="#2e7d32" /> ISRO Bhuvan Satellite Maps
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '30px', fontSize: '1.1rem' }}>
                🛰️ Satellite imagery and geospatial data from <strong>ISRO Bhuvan Geoportal</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Layer Selector Panel */}
                <aside>
                    <div className="glass-card" style={{ padding: '25px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Layers size={22} color="#2e7d32" /> Available Layers
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {layers.map((layer) => (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    key={layer.id}
                                    onClick={() => handleLayerSelect(layer.id)}
                                    style={{
                                        padding: '15px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        border: selectedLayer === layer.id ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                                        backgroundColor: selectedLayer === layer.id ? '#e8f5e9' : 'white',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <strong style={{ fontSize: '0.95rem' }}>{layer.name}</strong>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px',
                                            backgroundColor: getCategoryBg(layer.category), color: getCategoryColor(layer.category)
                                        }}>
                                            {layer.category}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{layer.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Map Display Area */}
                <main>
                    {layerDetail ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '25px' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{layerDetail.name}</h3>
                                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>{layerDetail.description}</p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem', fontWeight: '700', padding: '5px 15px', borderRadius: '15px',
                                        backgroundColor: getCategoryBg(layerDetail.category), color: getCategoryColor(layerDetail.category)
                                    }}>
                                        {layerDetail.category}
                                    </span>
                                </div>

                                {/* Map Embed - Using OpenStreetMap with Bhuvan info overlay */}
                                <div style={{ position: 'relative', height: '450px', backgroundColor: '#e8f5e9' }}>
                                    <iframe
                                        title="ISRO Bhuvan Map"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=68.18,6.75,97.39,35.49&layer=mapnik`}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                    />
                                    <div style={{
                                        position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.95)',
                                        padding: '12px 18px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        fontSize: '0.85rem', fontWeight: '600', color: '#1b5e20'
                                    }}>
                                        🛰️ Layer: {layerDetail.name}
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.95)',
                                        padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', color: '#555'
                                    }}>
                                        {layerDetail.attribution}
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="glass-card" style={{ padding: '25px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <Info size={20} color="#2e7d32" /> Map Legend
                                </h4>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {Object.entries(layerDetail.legend).map(([color, label]) => (
                                        <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '4px',
                                                backgroundColor: color === 'green' ? '#4caf50' : color === 'darkGreen' ? '#1b5e20' :
                                                    color === 'lightGreen' ? '#81c784' : color === 'yellow' ? '#ffc107' :
                                                    color === 'brown' ? '#795548' : color === 'blue' ? '#2196f3' :
                                                    color === 'darkBlue' ? '#1565c0' : color === 'lightBlue' ? '#03a9f4' :
                                                    color === 'cyan' ? '#00bcd4' : color === 'red' ? '#f44336' :
                                                    color === 'white' ? '#fafafa' : color === 'grey' ? '#9e9e9e' : '#666'
                                            }} />
                                            <span style={{ fontSize: '0.85rem', color: '#555' }}>{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* WMS Technical Info */}
                                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#777', fontFamily: 'monospace', margin: 0 }}>
                                        <strong>WMS Layer:</strong> {layerDetail.layerName}<br />
                                        <strong>WMS URL:</strong> {layerDetail.wmsBaseUrl}<br />
                                        <strong>Format:</strong> {layerDetail.format} | <strong>Opacity:</strong> {layerDetail.opacity}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', color: '#999' }}>
                            <Map size={80} style={{ marginBottom: '20px', opacity: 0.3 }} />
                            <h3>Select a satellite layer to view</h3>
                            <p>Choose from NDVI, Land Use, Soil Moisture, and more.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SatelliteMapPage;
