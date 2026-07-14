import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertTriangle, Loader2, UploadCloud, Map, Droplets, FileDown, Sprout, TrendingUp, ShieldAlert, Sparkles, CloudRain, Gauge } from 'lucide-react';
import { jsPDF } from 'jspdf';

const Report = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        Nitrogen: 90,
        Phosphorus: 40,
        Potassium: 40,
        Temperature: 28,
        Humidity: 70,
        pH: 6.5,
        Rainfall: 200,
        Area: 'India',
        Crop: 'rice',
        Year: 2024,
        Season: 'Kharif'
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);

    const handleExportPDF = () => {
        setExporting(true);
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            
            // --- Document Settings & Fonts ---
            doc.setFont("helvetica", "normal");
            
            // --- Branded Header ---
            // Top Accent Bar (Emerald)
            doc.setFillColor(16, 185, 129);
            doc.rect(0, 0, 210, 4, 'F');
            
            // Main Branding
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(15, 23, 42); // Slate 900
            doc.text("CHINAR AGRO AI", 14, 20);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text("FARM INTELLIGENCE REPORT", 14, 25);
            
            // Metadata Card
            doc.setFillColor(248, 250, 252); // Slate 50
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.roundedRect(14, 30, 182, 28, 2, 2, 'FD');
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105); // Slate 600
            
            doc.setFont("helvetica", "bold");
            doc.text("Area:", 20, 38);
            doc.setFont("helvetica", "normal");
            doc.text(String(formData.Area), 45, 38);
            
            doc.setFont("helvetica", "bold");
            doc.text("Target Crop:", 20, 44);
            doc.setFont("helvetica", "normal");
            doc.text(String(formData.Crop), 45, 44);
            
            doc.setFont("helvetica", "bold");
            doc.text("Season / Year:", 20, 50);
            doc.setFont("helvetica", "normal");
            doc.text(`${formData.Season || 'N/A'} ${formData.Year}`, 45, 50);
            
            doc.setFont("helvetica", "bold");
            doc.text("Generated Date:", 110, 38);
            doc.setFont("helvetica", "normal");
            doc.text(new Date().toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'}), 142, 38);
            
            doc.setFont("helvetica", "bold");
            doc.text("Report Version:", 110, 44);
            doc.setFont("helvetica", "normal");
            doc.text("v3.1 (Ensemble)", 142, 44);
            
            // Separator Line
            doc.setDrawColor(226, 232, 240);
            doc.line(14, 66, 196, 66);
            
            // --- Section 1: Soil & Climatic Parameters ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42);
            doc.text("1. Soil & Climatic Parameters", 14, 74);
            
            // Table Headers
            doc.setFillColor(241, 245, 249); // Slate 100
            doc.rect(14, 79, 182, 7, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text("Parameter Name", 18, 84);
            doc.text("Measured Value", 90, 84);
            doc.text("Agronomic Status", 135, 84);
            
            // Table Rows
            const rows = [
                { name: "Nitrogen (N)", val: `${formData.Nitrogen} mg/kg`, status: formData.Nitrogen < 50 ? "Low (Deficient)" : formData.Nitrogen > 100 ? "High" : "Optimal" },
                { name: "Phosphorus (P)", val: `${formData.Phosphorus} mg/kg`, status: formData.Phosphorus < 30 ? "Low (Deficient)" : "Optimal" },
                { name: "Potassium (K)", val: `${formData.Potassium} mg/kg`, status: formData.Potassium < 40 ? "Low (Deficient)" : "Optimal" },
                { name: "Soil pH", val: `${formData.pH}`, status: formData.pH < 6.0 ? "Acidic" : formData.pH > 7.2 ? "Alkaline" : "Optimal Neutral" },
                { name: "Temperature", val: `${formData.Temperature} °C`, status: "Average" },
                { name: "Humidity", val: `${formData.Humidity} %`, status: "Average" },
                { name: "Rainfall", val: `${formData.Rainfall} mm`, status: "Seasonal Average" }
            ];
            
            let y = 86;
            doc.setFont("helvetica", "normal");
            rows.forEach((r, idx) => {
                y += 6;
                // Alternating row bg
                if (idx % 2 === 1) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(14, y - 4, 182, 6, 'F');
                }
                doc.setTextColor(71, 85, 105);
                doc.text(r.name, 18, y);
                doc.text(r.val, 90, y);
                
                // Status color coding
                if (r.status.includes("Low") || r.status.includes("Acidic") || r.status.includes("Alkaline")) {
                    doc.setTextColor(217, 119, 6); // Amber
                } else if (r.status === "Optimal") {
                    doc.setTextColor(16, 185, 129); // Emerald
                } else {
                    doc.setTextColor(71, 85, 105);
                }
                doc.text(r.status, 135, y);
            });
            
            // --- Section 2: Predictive Intelligence ---
            y += 12;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42);
            doc.text("2. AI Predictive Intelligence", 14, y);
            
            y += 5;
            // 3 Columns Cards
            // Card 1: Disease
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(14, y, 56, 28, 2, 2, 'FD');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text("DISEASE DIAGNOSIS", 18, y + 6);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            if (result.disease_prediction && !result.disease_prediction.error) {
                doc.setTextColor(225, 29, 72); // Rose 600
                doc.text(result.disease_prediction.disease, 18, y + 14);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139);
                doc.text(`Certainty: ${result.disease_prediction.confidence?.toFixed(1)}%`, 18, y + 22);
            } else {
                doc.setTextColor(100, 116, 139);
                doc.text("No Image Uploaded", 18, y + 14);
            }
            
            // Card 2: Crop Choice
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(77, y, 56, 28, 2, 2, 'FD');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text("RECOMMENDED CROP", 81, y + 6);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            if (result.crop_recommendation && !result.crop_recommendation.error) {
                doc.setTextColor(79, 70, 229); // Indigo 600
                doc.text(result.crop_recommendation.recommended_crop.toUpperCase(), 81, y + 14);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139);
                doc.text(`Match: ${result.crop_recommendation.confidence?.toFixed(1)}%`, 81, y + 22);
            } else {
                doc.setTextColor(100, 116, 139);
                doc.text("N/A", 81, y + 14);
            }
            
            // Card 3: Yield Forecast
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(140, y, 56, 28, 2, 2, 'FD');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text("YIELD FORECAST", 144, y + 6);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            if (result.yield_prediction && !result.yield_prediction.error) {
                const yieldVal = result.yield_prediction.predicted_yield;
                const isHgHa = result.yield_prediction.yield_unit === 'hg/ha';
                const yieldTons = isHgHa ? (yieldVal / 10000) : yieldVal;
                doc.setTextColor(217, 119, 6); // Amber 600
                doc.text(`${yieldTons?.toFixed(2)} t/ha`, 144, y + 14);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139);
                doc.text(`Level: ${result.yield_prediction.yield_level}`, 144, y + 22);
            } else {
                doc.setTextColor(100, 116, 139);
                doc.text("N/A", 144, y + 14);
            }
            
            // --- Section 3: Expert Advisory ---
            y += 38;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42);
            doc.text("3. Expert Agronomic Advisory", 14, y);
            
            y += 5;
            
            const advice = [];
            if (formData.pH < 6.0) {
                advice.push({ title: "Acidic Soil Treatment Required", desc: `Your soil pH of ${formData.pH} is acidic. We strongly recommend spreading agricultural lime (calcium carbonate) or dolomite to increase soil pH to the optimal range (6.0 - 7.0).` });
            } else if (formData.pH > 7.2) {
                advice.push({ title: "Alkaline Soil Mitigation", desc: `Your soil pH of ${formData.pH} is alkaline. We recommend adding elemental sulfur, ammonium sulfate, or peat moss to lower the pH.` });
            }
            if (formData.Nitrogen < 50) {
                advice.push({ title: "Nitrogen Deficient Advisory", desc: `Soil Nitrogen level is low (${formData.Nitrogen} mg/kg). Apply nitrogenous fertilizers like Urea (46% N) or plant Nitrogen-fixing legume cover crops.` });
            }
            if (formData.Phosphorus < 30) {
                advice.push({ title: "Phosphorus Supplement Recommendation", desc: "Phosphorus is deficient. Apply Diammonium Phosphate (DAP) or bone meal to stimulate healthy crop root systems." });
            }
            if (formData.Potassium < 40) {
                advice.push({ title: "Potassium Defense Recommendation", desc: "Potassium is low. Apply Muriate of Potash (MOP) to improve crop disease resistance and drought tolerance." });
            }
            if (advice.length === 0) {
                advice.push({ title: "Optimal Soil & Field Health", desc: "All macronutrients (N, P, K) and soil pH are in optimal growth ranges for the target crop. No correction needed." });
            }
            
            advice.forEach((item) => {
                // Background Box
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(14, y, 182, 16, 1.5, 1.5, 'F');
                
                // Bullet
                doc.setFillColor(16, 185, 129);
                doc.circle(18, y + 8, 1.2, 'F');
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(15, 23, 42);
                doc.text(item.title, 23, y + 6);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(71, 85, 105);
                
                // Split text to fit line width
                const splitText = doc.splitTextToSize(item.desc, 170);
                doc.text(splitText, 23, y + 11);
                
                y += 19;
            });
            
            // --- Footer ---
            doc.setDrawColor(241, 245, 249);
            doc.line(14, 282, 196, 282);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // Slate 400
            doc.text("Chinar Agro AI • Intelligent Agricultural Advisory System", 14, 287);
            doc.text("Page 1 of 1", 175, 287);
            
            doc.save(`Chinar_Agro_Report_${formData.Crop}_${formData.Year}.pdf`);
        } catch (err) {
            console.error('PDF export failed:', err);
            alert('Failed to generate PDF.');
        } finally {
            setExporting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        const payload = new FormData();
        if (file) payload.append('file', file);

        for (const key in formData) {
            payload.append(key, formData[key]);
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/chinar-agro-report`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data.chinar_agro_report);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to initialize system core.');
        } finally {
            setLoading(false);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, type: "spring", bounce: 0.4 }
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="p-8 lg:p-12 max-w-6xl mx-auto h-full text-slate-100 relative z-10 w-full"
        >
            <div className="mb-12 text-center w-full">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_30px_rgba(76,175,80,0.5)] border border-brand-400/50"
                >
                    <FileText className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
                <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{t('report_title')}</h1>
                <p className="text-slate-400 font-light tracking-widest text-sm uppercase">{t('report_subtitle')}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">
                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 lg:p-10 relative overflow-hidden group w-full"
                >
                    <div className="absolute inset-0 bg-brand-500/10 blur-[80px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                    <form onSubmit={handlePredict} className="space-y-8 relative z-10">

                        {/* Image Upload */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                            <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-3">
                                <UploadCloud className="w-4 h-4 text-brand-400" />
                                {t('report_plant_image')}
                            </h3>
                            <div
                                className="border border-dashed border-white/20 bg-slate-900/50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-500 hover:bg-white/10 transition-colors cursor-pointer shadow-inner"
                                onClick={() => document.getElementById('report-file').click()}
                            >
                                <input id="report-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                {preview ? (
                                    <motion.img
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        src={preview} alt="Leaf" className="h-32 object-contain rounded-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    />
                                ) : (
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">{t('report_upload_leaf')}</p>
                                )}
                            </div>
                        </div>

                        {/* Biosphere Inputs */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-indigo-400" /> {t('report_biosphere_metrics')}
                                </h3>
                            </div>
                            {[
                                { name: 'Nitrogen', type: 'number', label: t('report_nitrogen') },
                                { name: 'Phosphorus', type: 'number', label: t('report_phosphorus') },
                                { name: 'Potassium', type: 'number', label: t('report_potassium') },
                                { name: 'Temperature', type: 'number', label: t('report_temperature') },
                                { name: 'Humidity', type: 'number', label: t('report_humidity') },
                                { name: 'pH', type: 'number', label: t('report_ph') },
                                { name: 'Rainfall', type: 'number', label: t('report_rainfall') },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{f.label || f.name}</label>
                                    <input
                                        type={f.type} step="any" name={f.name} value={formData[f.name]}
                                        onChange={handleChange} required
                                        className="glowing-input font-mono text-center tracking-wider focus:ring-brand-400 focus:shadow-[0_0_20px_rgba(76,175,80,0.2)] bg-slate-900/40 py-3"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Spatial Targets */}
                        <div className="grid grid-cols-2 gap-5 pt-4">
                            <div className="col-span-2">
                                <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                                    <Map className="w-4 h-4 text-amber-400" /> {t('report_location_details')}
                                </h3>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{t('report_area')}</label>
                                <input
                                    type="text" name="Area" value={formData.Area}
                                    onChange={handleChange} required
                                    className="glowing-input font-mono tracking-wider focus:ring-brand-400 focus:shadow-[0_0_20px_rgba(76,175,80,0.2)] bg-slate-900/40 py-3 text-center uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{t('report_crop')}</label>
                                <input
                                    type="text" name="Crop" value={formData.Crop}
                                    onChange={handleChange} required
                                    className="glowing-input font-mono tracking-wider focus:ring-brand-400 focus:shadow-[0_0_20px_rgba(76,175,80,0.2)] bg-slate-900/40 py-3 text-center uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{t('report_season')}</label>
                                <select
                                    name="Season" value={formData.Season}
                                    onChange={handleChange} required
                                    className="glowing-input font-mono tracking-wider focus:ring-brand-400 focus:shadow-[0_0_20px_rgba(76,175,80,0.2)] bg-slate-900/40 py-3 text-center uppercase appearance-none bg-slate-900"
                                >
                                    {['Kharif', 'Rabi', 'Whole Year', 'Autumn', 'Summer', 'Winter'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{t('report_year')}</label>
                                <input
                                    type="number" name="Year" value={formData.Year}
                                    onChange={handleChange} required
                                    className="glowing-input font-mono tracking-wider focus:ring-brand-400 focus:shadow-[0_0_20px_rgba(76,175,80,0.2)] bg-slate-900/40 py-3 text-center uppercase"
                                />
                            </div>
                        </div>

                        <div className="pt-8">
                            <motion.button
                                whileHover={{ scale: !loading ? 1.02 : 1 }}
                                whileTap={{ scale: !loading ? 0.98 : 1 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl shadow-[0_0_20px_rgba(76,175,80,0.4)] hover:shadow-[0_0_40px_rgba(76,175,80,0.6)] transition-all duration-300 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 border border-brand-400/50 ${loading && 'opacity-50 cursor-not-allowed shadow-none'}`}
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5 drop-shadow-[0_0_5px_currentColor]" /> : <FileText className="w-5 h-5 drop-shadow-[0_0_5px_currentColor]" />}
                                {loading ? t('report_btn_analyzing') : t('report_btn_generate')}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Results Area */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="h-full relative w-full"
                >
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-card !bg-red-500/10 !border-red-500/30 p-6 flex gap-4 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-6 absolute top-0 w-full z-20"
                            >
                                <AlertTriangle className="w-6 h-6 shrink-0 drop-shadow-[0_0_5px_currentColor]" />
                                <p className="font-medium tracking-wide">{error}</p>
                            </motion.div>
                        )}

                        {!result && !error && !loading && (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card p-10 flex flex-col items-center justify-center text-center h-[500px] border-dashed !bg-white/5 w-full"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
                                    <FileText className="w-10 h-10 text-slate-500 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]" />
                                </div>
                                <p className="text-slate-400 font-light tracking-wide max-w-[250px] uppercase text-sm leading-relaxed">
                                    {t('report_placeholder_desc')}
                                </p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full space-y-4"
                            >
                                <div id="chinar-report-print-area" className="glass-card overflow-hidden w-full relative group">
                                    <div className="absolute inset-0 bg-brand-500/10 blur-[80px] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity" />

                                    <div className="bg-slate-900/60 p-8 border-b border-white/5 shadow-inner backdrop-blur-md relative z-10 flex flex-col items-center text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                                            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-brand-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4"
                                        >
                                            <CheckCircle className="w-8 h-8 text-brand-400 drop-shadow-[0_0_5px_currentColor]" />
                                        </motion.div>
                                        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t('report_analysis_complete')}</h3>
                                        <p className="text-sm tracking-widest font-bold mt-2 font-mono uppercase text-brand-300 drop-shadow-[0_0_5px_currentColor]">{t('report_generated')}</p>
                                    </div>

                                    <div className="p-8 space-y-6 relative z-10">
                                        
                                        {/* Report Metadata Block */}
                                        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="text-left">
                                                <h2 className="text-xl font-extrabold tracking-wider text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Chinar Agro AI</h2>
                                                <p className="text-xs text-slate-400 tracking-widest font-mono uppercase mt-1">Farm Intelligence Report</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono text-slate-400 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                                                <div><span className="text-slate-500 font-bold uppercase tracking-wider">Area:</span> <span className="text-slate-200 capitalize">{formData.Area}</span></div>
                                                <div><span className="text-slate-500 font-bold uppercase tracking-wider">Crop:</span> <span className="text-slate-200 capitalize">{formData.Crop}</span></div>
                                                <div><span className="text-slate-500 font-bold uppercase tracking-wider">Season:</span> <span className="text-slate-200 capitalize">{formData.Season}</span></div>
                                                <div><span className="text-slate-500 font-bold uppercase tracking-wider">Year:</span> <span className="text-slate-200">{formData.Year}</span></div>
                                                <div className="col-span-2 pt-1.5 mt-1.5 border-t border-white/5 text-[10px] text-slate-500"><span className="uppercase font-bold tracking-wider">Generated:</span> {new Date().toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</div>
                                            </div>
                                        </div>

                                        {/* Biosphere Inputs Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                            {/* Soil Health Card */}
                                            <div className="glass-card !bg-white/5 !rounded-2xl p-6 border !border-white/10 shadow-inner flex flex-col justify-between h-full">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                                    <Gauge className="w-4 h-4 text-emerald-400" /> Soil Nutrient Profile
                                                </h4>
                                                <div className="space-y-4 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-slate-400">Nitrogen (N)</span>
                                                            <span className="text-emerald-400 font-mono">{formData.Nitrogen} mg/kg</span>
                                                        </div>
                                                        <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden border border-white/5">
                                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.min((formData.Nitrogen/140)*100, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-slate-400">Phosphorus (P)</span>
                                                            <span className="text-emerald-400 font-mono">{formData.Phosphorus} mg/kg</span>
                                                        </div>
                                                        <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden border border-white/5">
                                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.min((formData.Phosphorus/145)*100, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-slate-400">Potassium (K)</span>
                                                            <span className="text-emerald-400 font-mono">{formData.Potassium} mg/kg</span>
                                                        </div>
                                                        <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden border border-white/5">
                                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.min((formData.Potassium/205)*100, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2">
                                                        <span className="text-xs font-bold text-slate-400">Soil pH</span>
                                                        <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg ${formData.pH >= 6.0 && formData.pH <= 7.0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{formData.pH} ({formData.pH < 6.0 ? 'Acidic' : formData.pH > 7.0 ? 'Alkaline' : 'Neutral'})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Climate Analytics Card */}
                                            <div className="glass-card !bg-white/5 !rounded-2xl p-6 border !border-white/10 shadow-inner flex flex-col justify-between h-full">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                                    <CloudRain className="w-4 h-4 text-cyan-400" /> Climate Conditions
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 flex-1">
                                                    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Temperature</span>
                                                        <span className="text-cyan-400 font-mono text-xl font-extrabold">{formData.Temperature}°C</span>
                                                    </div>
                                                    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Humidity</span>
                                                        <span className="text-cyan-400 font-mono text-xl font-extrabold">{formData.Humidity}%</span>
                                                    </div>
                                                    <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 col-span-2 flex flex-col justify-center">
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Rainfall Volume</span>
                                                        <span className="text-cyan-400 font-mono text-xl font-extrabold">{formData.Rainfall} mm</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Predictions Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                                            {/* Visual Condition Render */}
                                            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card !bg-white/5 !rounded-2xl p-5 border !border-white/10 shadow-inner group/card hover:!border-rose-400/50 transition-colors flex flex-col justify-between h-full">
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 whitespace-nowrap">
                                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" /> <span className="truncate">Disease Detection</span>
                                                </h4>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    {result.disease_prediction ? (
                                                        result.disease_prediction.error ? (
                                                            <p className="text-rose-400 tracking-wide font-mono text-xs">{result.disease_prediction.error}</p>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-xl font-extrabold text-white capitalize mb-1 tracking-wide truncate">
                                                                        {result.disease_prediction.disease}
                                                                    </p>
                                                                    <p className="text-[10px] text-rose-300 font-bold uppercase tracking-widest">{t('report_detected_signature')}</p>
                                                                </div>
                                                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('report_certainty')}</span>
                                                                    <span className="text-sm font-extrabold text-rose-400 font-mono">{result.disease_prediction.confidence?.toFixed(1)}%</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <p className="text-slate-500 font-mono text-xs tracking-wide">{t('report_no_image')}</p>
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Crop Array Render */}
                                            {result.crop_recommendation && (
                                                <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card !bg-white/5 !rounded-2xl p-5 border !border-white/10 shadow-inner group/card hover:!border-indigo-400/50 transition-colors flex flex-col justify-between h-full">
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 whitespace-nowrap">
                                                        <Sprout className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> <span className="truncate">Crop Choice</span>
                                                    </h4>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        {result.crop_recommendation.error ? (
                                                            <p className="text-red-400 tracking-wide font-mono text-xs">{result.crop_recommendation.error}</p>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-xl font-extrabold text-indigo-300 capitalize mb-1 tracking-wide truncate">
                                                                        {result.crop_recommendation.recommended_crop}
                                                                    </p>
                                                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{t('report_best_crop')}</p>
                                                                </div>
                                                                {result.crop_recommendation.confidence && (
                                                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('report_match')}</span>
                                                                        <span className="text-sm font-extrabold text-indigo-400 font-mono">{result.crop_recommendation.confidence.toFixed(1)}%</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Spatial Forecast Render */}
                                            {result.yield_prediction && (
                                                <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="glass-card !bg-white/5 !rounded-2xl p-5 border !border-white/10 shadow-inner group/card hover:!border-amber-400/50 transition-colors flex flex-col justify-between h-full">
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 whitespace-nowrap">
                                                        <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" /> <span className="truncate">Yield Forecast</span>
                                                    </h4>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        {result.yield_prediction.error ? (
                                                            <p className="text-red-400 tracking-wide font-mono text-xs">{result.yield_prediction.error}</p>
                                                        ) : (() => {
                                                            const yieldVal = result.yield_prediction.predicted_yield;
                                                            const isHgHa = result.yield_prediction.yield_unit === 'hg/ha';
                                                            const yieldTons = isHgHa ? (yieldVal / 10000) : yieldVal;
                                                            const yieldHg = isHgHa ? yieldVal : (yieldVal * 10000);
                                                            return (
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <p className="text-xl font-extrabold text-amber-400 mb-1 tracking-wide flex items-baseline gap-1">
                                                                            {yieldTons?.toFixed(2)} <span className="text-xs text-amber-400/70 font-mono">t/ha</span>
                                                                        </p>
                                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">({yieldHg?.toLocaleString(undefined, {maximumFractionDigits:0})} hg/ha)</p>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t('report_yield_level')}</span>
                                                                        <span className={`text-xs font-extrabold font-mono tracking-wider ${result.yield_prediction.yield_level === 'HIGH' ? 'text-brand-400' : result.yield_prediction.yield_level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                                                                            {result.yield_prediction.yield_level}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Expert Agronomic Advisory */}
                                        <div className="glass-card !bg-white/5 !rounded-2xl p-6 border !border-white/10 shadow-inner flex flex-col justify-between">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                                <Sparkles className="w-4 h-4 text-brand-400" /> Expert Agricultural Advisory
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                {(() => {
                                                    const advice = [];
                                                    if (formData.pH < 6.0) {
                                                        advice.push({ title: "Acidic Soil Warning", desc: "Your soil pH is acidic. We recommend adding agricultural lime (calcium carbonate) or dolomite to increase soil pH." });
                                                    } else if (formData.pH > 7.2) {
                                                        advice.push({ title: "Alkaline Soil Warning", desc: "Your soil pH is alkaline. Consider adding elemental sulfur, ammonium sulfate, or peat moss to lower the pH." });
                                                    }
                                                    if (formData.Nitrogen < 50) {
                                                        advice.push({ title: "Nitrogen Deficient", desc: "Nitrogen level is low. We recommend applying Nitrogen-rich fertilizers like Urea, Ammonium Nitrate, or organic blood meal." });
                                                    }
                                                    if (formData.Phosphorus < 30) {
                                                        advice.push({ title: "Phosphorus Deficient", desc: "Phosphorus level is low. Apply Diammonium Phosphate (DAP) or bone meal to stimulate healthy root development." });
                                                    }
                                                    if (formData.Potassium < 40) {
                                                        advice.push({ title: "Potassium Deficient", desc: "Potassium level is low. Consider applying Muriate of Potash (MOP) or sulfate of potash to improve drought resistance." });
                                                    }
                                                    if (advice.length === 0) {
                                                        advice.push({ title: "Optimal Soil Health", desc: "All macronutrients and pH are in optimal ranges. Keep up standard organic compost maintenance!" });
                                                    }
                                                    return advice.map((item, idx) => (
                                                        <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                                                            <h5 className="text-xs font-extrabold text-white mb-1.5 uppercase tracking-wider flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span> {item.title}
                                                            </h5>
                                                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans flex-1">{item.desc}</p>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2 relative z-20">
                                    <motion.button
                                        whileHover={{ scale: exporting ? 1 : 1.02 }}
                                        whileTap={{ scale: exporting ? 1 : 0.98 }}
                                        onClick={handleExportPDF}
                                        disabled={exporting}
                                        className={`px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2 border border-amber-400/30 ${exporting ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
                                    >
                                        {exporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                                        {exporting ? t('report_btn_generating_pdf') || 'Generating PDF...' : t('report_export_pdf') || 'Export PDF Report'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Report;
