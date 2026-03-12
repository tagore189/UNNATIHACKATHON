const express = require('express');
const router = express.Router();

const BHUVAN_LAYERS = [
    { id: 'ndvi', name: 'NDVI (Vegetation Health)', description: 'Vegetation index showing crop health and density.', category: 'Agriculture', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:ndvi_avg', format: 'image/png', opacity: 0.7, legend: { green: 'Healthy (0.6-1.0)', yellow: 'Moderate (0.3-0.6)', brown: 'Stressed (0-0.3)' } },
    { id: 'lulc', name: 'Land Use / Land Cover', description: 'Classification of agricultural land, forests, water bodies, urban areas.', category: 'Land Use', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:lulc50k_1516', format: 'image/png', opacity: 0.7, legend: { green: 'Cropland', darkGreen: 'Forest', blue: 'Water', red: 'Built-up' } },
    { id: 'soil_moisture', name: 'Soil Moisture', description: 'Satellite-estimated soil moisture for irrigation planning.', category: 'Agriculture', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:soil_moisture', format: 'image/png', opacity: 0.65, legend: { blue: 'High', green: 'Adequate', yellow: 'Low', red: 'Drought' } },
    { id: 'crop_intensity', name: 'Cropping Intensity', description: 'Crop cycles per year indicating land utilization.', category: 'Agriculture', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:crop_intensity', format: 'image/png', opacity: 0.65, legend: { darkGreen: 'Triple', green: 'Double', lightGreen: 'Single', grey: 'Fallow' } },
    { id: 'dem_srtm', name: 'Elevation / Terrain', description: 'Digital Elevation Model showing topography and drainage patterns.', category: 'Terrain', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:srtm_dem', format: 'image/png', opacity: 0.6, legend: { green: 'Low', yellow: 'Medium', brown: 'High' } },
    { id: 'water_bodies', name: 'Water Bodies', description: 'Reservoirs, lakes, rivers for irrigation source planning.', category: 'Water Resources', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:water_bodies', format: 'image/png', opacity: 0.75, legend: { darkBlue: 'Reservoir', blue: 'Lake', lightBlue: 'River' } },
    { id: 'rainfall', name: 'Rainfall Distribution', description: 'Satellite-estimated rainfall for agriculture and drought assessment.', category: 'Weather', wmsUrl: 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms', layerName: 'india3:rainfall_dist', format: 'image/png', opacity: 0.6, legend: { blue: 'Heavy', green: 'Moderate', yellow: 'Light', red: 'Deficit' } }
];

router.get('/layers', (req, res) => {
    const { category } = req.query;
    let layers = [...BHUVAN_LAYERS];
    if (category) layers = layers.filter(l => l.category.toLowerCase() === category.toLowerCase());

    res.json({
        source: 'ISRO Bhuvan Geoportal',
        totalLayers: layers.length,
        categories: [...new Set(BHUVAN_LAYERS.map(l => l.category))],
        layers: layers.map(l => ({ id: l.id, name: l.name, description: l.description, category: l.category }))
    });
});

router.get('/tile-url/:layer', (req, res) => {
    const layer = BHUVAN_LAYERS.find(l => l.id === req.params.layer.toLowerCase());
    if (!layer) return res.status(404).json({ error: 'Layer not found', availableLayers: BHUVAN_LAYERS.map(l => l.id) });

    const tileUrl = `${layer.wmsUrl}?service=WMS&version=1.1.1&request=GetMap&layers=${layer.layerName}&styles=&format=${layer.format}&transparent=true&srs=EPSG:4326&bbox={bbox}&width=256&height=256`;
    res.json({
        source: 'ISRO Bhuvan Geoportal',
        layer: { id: layer.id, name: layer.name, description: layer.description, category: layer.category, tileUrl, wmsBaseUrl: layer.wmsUrl, layerName: layer.layerName, format: layer.format, opacity: layer.opacity, legend: layer.legend, attribution: '© ISRO Bhuvan | Indian Space Research Organisation' }
    });
});

router.get('/map-embed', (req, res) => {
    const lat = req.query.lat || 20.5937, lon = req.query.lon || 78.9629, zoom = req.query.zoom || 5;
    res.json({
        source: 'ISRO Bhuvan Geoportal',
        embedUrl: 'https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php',
        openStreetMapFallback: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        defaultCenter: { lat: parseFloat(lat), lon: parseFloat(lon) },
        defaultZoom: parseInt(zoom),
        attribution: '© ISRO Bhuvan | Indian Space Research Organisation'
    });
});

module.exports = router;
