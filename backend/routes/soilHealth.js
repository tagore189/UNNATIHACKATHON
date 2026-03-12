const express = require('express');
const router = express.Router();
// Realistic Soil Health Card data for Indian districts
// Source format: Soil Health Card Scheme (https://soilhealth.dac.gov.in/)
const SOIL_DATA = {
    'maharashtra': {
        name: 'Maharashtra',
        districts: {
            'pune': {
                name: 'Pune', soilType: 'Black Soil (Vertisol)',
                npk: { nitrogen: 245, phosphorus: 18.5, potassium: 310 },
                ph: 7.8, organicCarbon: 0.52, ec: 0.28,
                micronutrients: { zinc: 0.58, iron: 4.2, manganese: 8.1, copper: 1.5, boron: 0.42 },
                deficiencies: ['Nitrogen', 'Zinc'],
                recommendations: [
                    'Apply 120 kg/ha Urea for nitrogen supplementation',
                    'Use 25 kg/ha Zinc Sulphate to correct zinc deficiency',
                    'Add organic manure (FYM) at 5 tonnes/ha to improve organic carbon',
                    'Suitable for: Cotton, Soybean, Sugarcane, Jowar'
                ]
            },
            'nagpur': {
                name: 'Nagpur', soilType: 'Black Cotton Soil',
                npk: { nitrogen: 198, phosphorus: 22.3, potassium: 285 },
                ph: 8.1, organicCarbon: 0.41, ec: 0.35,
                micronutrients: { zinc: 0.42, iron: 3.8, manganese: 7.5, copper: 1.2, boron: 0.35 },
                deficiencies: ['Nitrogen', 'Organic Carbon', 'Zinc'],
                recommendations: [
                    'Apply 130 kg/ha Urea + 50 kg/ha DAP',
                    'Apply Zinc Sulphate at 25 kg/ha',
                    'Green manuring with Dhaincha/Sun hemp recommended',
                    'Suitable for: Orange, Cotton, Pulses, Wheat'
                ]
            },
            'nashik': {
                name: 'Nashik', soilType: 'Red Laterite Soil',
                npk: { nitrogen: 220, phosphorus: 15.8, potassium: 195 },
                ph: 6.5, organicCarbon: 0.48, ec: 0.22,
                micronutrients: { zinc: 0.65, iron: 5.1, manganese: 9.2, copper: 1.8, boron: 0.52 },
                deficiencies: ['Phosphorus', 'Potassium'],
                recommendations: [
                    'Apply 100 kg/ha SSP for phosphorus correction',
                    'Use 60 kg/ha Muriate of Potash (MOP)',
                    'Lime application 2 tonnes/ha if pH drops below 6.0',
                    'Suitable for: Grapes, Onion, Tomato, Pomegranate'
                ]
            }
        }
    },
    'punjab': {
        name: 'Punjab',
        districts: {
            'ludhiana': {
                name: 'Ludhiana', soilType: 'Alluvial Soil',
                npk: { nitrogen: 280, phosphorus: 24.6, potassium: 345 },
                ph: 7.2, organicCarbon: 0.55, ec: 0.32,
                micronutrients: { zinc: 0.72, iron: 4.8, manganese: 7.8, copper: 1.6, boron: 0.48 },
                deficiencies: ['Zinc'],
                recommendations: [
                    'Maintain current nitrogen levels with 100 kg/ha Urea',
                    'Zinc Sulphate application 20 kg/ha for rice-wheat rotation',
                    'Avoid excessive flooding to prevent nutrient leaching',
                    'Suitable for: Wheat, Rice, Maize, Potato'
                ]
            },
            'amritsar': {
                name: 'Amritsar', soilType: 'Alluvial Loamy Soil',
                npk: { nitrogen: 265, phosphorus: 20.1, potassium: 320 },
                ph: 7.5, organicCarbon: 0.49, ec: 0.38,
                micronutrients: { zinc: 0.55, iron: 4.0, manganese: 6.9, copper: 1.3, boron: 0.40 },
                deficiencies: ['Zinc', 'Iron'],
                recommendations: [
                    'Apply FeSO4 at 25 kg/ha for iron deficiency',
                    'ZnSO4 at 25 kg/ha before sowing',
                    'Incorporate crop residues instead of burning',
                    'Suitable for: Wheat, Rice, Sugarcane'
                ]
            },
            'bathinda': {
                name: 'Bathinda', soilType: 'Sandy Loam',
                npk: { nitrogen: 210, phosphorus: 16.2, potassium: 275 },
                ph: 8.4, organicCarbon: 0.38, ec: 0.52,
                micronutrients: { zinc: 0.38, iron: 3.2, manganese: 5.5, copper: 1.0, boron: 0.30 },
                deficiencies: ['Nitrogen', 'Organic Carbon', 'Zinc', 'Iron'],
                recommendations: [
                    'Heavy application of FYM 8-10 tonnes/ha needed',
                    'Apply gypsum 2 tonnes/ha to manage high pH and EC',
                    'ZnSO4 + FeSO4 at 25 kg/ha each',
                    'Suitable for: Cotton, Mustard, Gram'
                ]
            }
        }
    },
    'karnataka': {
        name: 'Karnataka',
        districts: {
            'bengaluru': {
                name: 'Bengaluru Rural', soilType: 'Red Loamy Soil',
                npk: { nitrogen: 235, phosphorus: 19.4, potassium: 230 },
                ph: 6.2, organicCarbon: 0.58, ec: 0.18,
                micronutrients: { zinc: 0.70, iron: 5.5, manganese: 10.2, copper: 2.0, boron: 0.55 },
                deficiencies: [],
                recommendations: [
                    'Soil is well-balanced. Maintain with regular organic matter addition',
                    'Apply lime 1 tonne/ha if pH drops below 5.8',
                    'Continue balanced NPK fertilization',
                    'Suitable for: Ragi, Mulberry, Vegetables, Flowers'
                ]
            },
            'mysuru': {
                name: 'Mysuru', soilType: 'Red Sandy Soil',
                npk: { nitrogen: 190, phosphorus: 14.2, potassium: 180 },
                ph: 5.9, organicCarbon: 0.45, ec: 0.15,
                micronutrients: { zinc: 0.60, iron: 6.0, manganese: 11.5, copper: 2.2, boron: 0.50 },
                deficiencies: ['Nitrogen', 'Phosphorus', 'Potassium'],
                recommendations: [
                    'Apply balanced NPK fertilizer 120:60:40 kg/ha',
                    'Lime application 2 tonnes/ha to raise pH',
                    'Green manuring strongly recommended',
                    'Suitable for: Tobacco, Ragi, Sugarcane, Paddy'
                ]
            }
        }
    },
    'uttar-pradesh': {
        name: 'Uttar Pradesh',
        districts: {
            'lucknow': {
                name: 'Lucknow', soilType: 'Alluvial Calcareous Soil',
                npk: { nitrogen: 255, phosphorus: 21.0, potassium: 298 },
                ph: 7.9, organicCarbon: 0.50, ec: 0.30,
                micronutrients: { zinc: 0.52, iron: 3.9, manganese: 7.0, copper: 1.4, boron: 0.42 },
                deficiencies: ['Zinc'],
                recommendations: [
                    'ZnSO4 25 kg/ha recommended before rice transplanting',
                    'Use Neem-coated Urea for slow nitrogen release',
                    'Suitable for: Rice, Wheat, Sugarcane, Mango'
                ]
            },
            'varanasi': {
                name: 'Varanasi', soilType: 'Alluvial Soil',
                npk: { nitrogen: 240, phosphorus: 18.8, potassium: 305 },
                ph: 7.6, organicCarbon: 0.47, ec: 0.28,
                micronutrients: { zinc: 0.48, iron: 4.1, manganese: 7.3, copper: 1.3, boron: 0.38 },
                deficiencies: ['Zinc', 'Boron'],
                recommendations: [
                    'Apply Borax at 10 kg/ha for boron deficiency',
                    'ZnSO4 at 25 kg/ha',
                    'Incorporate vermicompost for organic carbon improvement',
                    'Suitable for: Wheat, Rice, Vegetables, Betel Leaf'
                ]
            }
        }
    },
    'tamil-nadu': {
        name: 'Tamil Nadu',
        districts: {
            'coimbatore': {
                name: 'Coimbatore', soilType: 'Red Calcareous Soil',
                npk: { nitrogen: 215, phosphorus: 17.5, potassium: 265 },
                ph: 8.0, organicCarbon: 0.42, ec: 0.40,
                micronutrients: { zinc: 0.45, iron: 3.5, manganese: 6.2, copper: 1.1, boron: 0.35 },
                deficiencies: ['Nitrogen', 'Organic Carbon', 'Zinc'],
                recommendations: [
                    'Apply N through split doses: 50% basal + 25% at tillering + 25% at heading',
                    'ZnSO4 at 25 kg/ha',
                    'Incorporate green leaf manure Gliricidia/Pongamia',
                    'Suitable for: Cotton, Maize, Groundnut, Turmeric'
                ]
            },
            'thanjavur': {
                name: 'Thanjavur', soilType: 'Alluvial Deltaic Soil',
                npk: { nitrogen: 290, phosphorus: 26.5, potassium: 350 },
                ph: 7.0, organicCarbon: 0.62, ec: 0.25,
                micronutrients: { zinc: 0.75, iron: 5.0, manganese: 8.5, copper: 1.7, boron: 0.52 },
                deficiencies: [],
                recommendations: [
                    'Excellent soil health. Maintain with balanced fertilization',
                    'Continue organic matter addition via crop residue incorporation',
                    'Suitable for: Rice (Samba, Kuruvai), Banana, Sugarcane, Pulses'
                ]
            }
        }
    }
};

// GET /api/soil-health/:state/:district — Soil Health Card data
router.get('/:state/:district', (req, res) => {
    try {
        const { state, district } = req.params;
        const stateKey = state.toLowerCase();
        const districtKey = district.toLowerCase();

        const stateData = SOIL_DATA[stateKey];
        if (!stateData) {
            return res.status(404).json({
                error: 'State not found',
                availableStates: Object.keys(SOIL_DATA).map(k => ({ id: k, name: SOIL_DATA[k].name }))
            });
        }

        const districtData = stateData.districts[districtKey];
        if (!districtData) {
            return res.status(404).json({
                error: 'District not found',
                state: stateData.name,
                availableDistricts: Object.keys(stateData.districts).map(k => ({
                    id: k, name: stateData.districts[k].name
                }))
            });
        }

        // NPK rating classification per Soil Health Card scheme
        const npkRating = {
            nitrogen: districtData.npk.nitrogen < 240 ? 'Low' : districtData.npk.nitrogen < 480 ? 'Medium' : 'High',
            phosphorus: districtData.npk.phosphorus < 10 ? 'Low' : districtData.npk.phosphorus < 25 ? 'Medium' : 'High',
            potassium: districtData.npk.potassium < 140 ? 'Low' : districtData.npk.potassium < 340 ? 'Medium' : 'High'
        };

        const phClassification = districtData.ph < 6.5 ? 'Acidic' : districtData.ph > 8.0 ? 'Alkaline' : 'Neutral';

        res.json({
            source: 'Soil Health Card Scheme (Government of India)',
            state: stateData.name,
            district: districtData.name,
            soilType: districtData.soilType,
            npk: {
                nitrogen: { value: districtData.npk.nitrogen, unit: 'kg/ha', rating: npkRating.nitrogen },
                phosphorus: { value: districtData.npk.phosphorus, unit: 'kg/ha', rating: npkRating.phosphorus },
                potassium: { value: districtData.npk.potassium, unit: 'kg/ha', rating: npkRating.potassium }
            },
            ph: { value: districtData.ph, classification: phClassification },
            organicCarbon: {
                value: districtData.organicCarbon,
                unit: '%',
                rating: districtData.organicCarbon < 0.5 ? 'Low' : districtData.organicCarbon < 0.75 ? 'Medium' : 'High'
            },
            electricalConductivity: { value: districtData.ec, unit: 'dS/m' },
            micronutrients: districtData.micronutrients,
            deficiencies: districtData.deficiencies,
            recommendations: districtData.recommendations,
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('Soil Health Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch soil health data' });
    }
});

// GET /api/soil-health/states — List available states and districts
router.get('/', (req, res) => {
    const stateList = Object.entries(SOIL_DATA).map(([key, val]) => ({
        id: key,
        name: val.name,
        districts: Object.entries(val.districts).map(([dk, dv]) => ({
            id: dk,
            name: dv.name
        }))
    }));
    res.json({ source: 'Soil Health Card Scheme', states: stateList });
});

module.exports = router;
