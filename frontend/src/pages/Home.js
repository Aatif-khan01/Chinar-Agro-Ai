import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Sprout, 
  Wheat, 
  ArrowRight, 
  BrainCircuit, 
  FileText, 
  Activity 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Premium borderless feature row component (no box containers)
const FeatureRow = ({ number, title, desc, details, to, icon: Icon, glowColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, type: "spring" }}
    className="w-full flex flex-col md:flex-row items-start md:items-center justify-between py-10 border-b border-white/10 group relative transition-all duration-300"
  >
    {/* Micro-glow backdrop on row hover */}
    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-72 h-32 rounded-full ${glowColor} blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12 max-w-4xl">
      {/* Sleek Large Number Indicator */}
      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-white/5 font-mono select-none tracking-tighter">
        {number}
      </span>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand-500/30 transition-colors">
            <Icon className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-wide group-hover:text-brand-300 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-slate-300 text-base leading-relaxed mb-2 max-w-3xl">
          {desc}
        </p>
        <p className="text-slate-500 text-sm font-medium tracking-wide">
          {details}
        </p>
      </div>
    </div>

    {/* Elegant clean launch button */}
    <Link
      to={to}
      className="mt-6 md:mt-0 flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-brand-400 transition-colors uppercase tracking-widest relative z-10 hover:scale-105 transform duration-300"
    >
      <span>Launch</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
);

const Home = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "99.5%", label: "Model Suitability Match" },
    { value: "38+", label: "Detected Plant Diseases" },
    { value: "15+", label: "Geographical Zones Calibrated" },
    { value: "<2s", label: "Real-time Diagnostic Latency" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 lg:p-12 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative z-10"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="mb-20 text-center relative z-10"
      >
        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter">
          {t('home_hero_title')} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-emerald-200 to-emerald-600 drop-shadow-[0_0_35px_rgba(76,175,80,0.3)]">
            {t('home_hero_title_accent')}
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          An enterprise-grade precision agriculture platform blending state-of-the-art machine learning with generative AI advisor models to maximize crop yields, detect blights early, and optimize soil fertility.
        </p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Link to="/report" className="btn-primary flex items-center gap-3">
            <FileText className="w-5 h-5 drop-shadow-[0_0_5px_currentColor]" />
            <span>{t('home_cta')}</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Project Overview Details Section (2-Column typography, no boxes) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 py-16 mb-16 border-t border-b border-white/5 relative z-10">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" /> Precision Agronomy Stack
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug mb-6">
            Integrating advanced neural visions and ensemble pipelines.
          </p>
          <p className="text-slate-400 leading-relaxed mb-6">
            Chinar Agro AI combines deep convolutional networks (ResNet-50 and EfficientNet-B1) with high-efficiency decision tree classifiers (XGBoost, LightGBM, and Random Forests). 
          </p>
          <p className="text-slate-400 leading-relaxed">
            By merging localized soil data with real-time crop disease diagnosis and predictive regional output forecasting, Chinar Agro AI creates a unified intelligence layer. Farmers and agronomists receive actionable insights instantly, powered by context-aware Gemini AI advisory reports.
          </p>
        </div>

        {/* Dynamic Stats Highlights (Sleek minimalist look) */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 justify-center items-center">
          {stats.map((s, index) => (
            <div key={index} className="flex flex-col border-l-2 border-brand-500/20 pl-6 group">
              <span className="text-4xl md:text-5xl font-black text-white group-hover:text-brand-300 transition-colors duration-300 font-mono tracking-tight">
                {s.value}
              </span>
              <span className="text-slate-500 text-sm mt-2 uppercase tracking-wider font-semibold">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Capabilities List (Modern list, no boxes) */}
      <div className="w-full flex flex-col mb-12 relative z-10">
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-2">
            AI Pipelines & Engines
          </h2>
          <p className="text-3xl font-bold text-white tracking-tight">
            Core Modules
          </p>
        </div>

        <FeatureRow
          number="01"
          title="Plant Health Doctor (Ensemble CNN)"
          desc="Upload plant leaf photos to instantly diagnose blights, rusts, and visual infections. Uses an ensemble of ResNet-50 and EfficientNet-B1 models calibrated to identify the severity of crop diseases."
          details="Technology: PyTorch • ResNet-50 + EfficientNet-B1 Ensemble • Multi-Spectral Image Analyzer"
          to="/disease"
          icon={Leaf}
          glowColor="bg-brand-500"
          delay={0.1}
        />

        <FeatureRow
          number="02"
          title="Soil Crop Recommendation (Voting Classifier)"
          desc="Calibrates Nitrogen (N), Phosphorus (P), Potassium (K), and atmospheric parameters (humidity, temperature, pH, rainfall) to match your soil profile with the crops that have the highest success rates."
          details="Technology: Scikit-Learn • XGBoost + LightGBM + Random Forest • Stratified K-Fold Soft Voting"
          to="/crop"
          icon={Sprout}
          glowColor="bg-emerald-500"
          delay={0.2}
        />

        <FeatureRow
          number="03"
          title="Harvest Yield Forecaster (Regression Model)"
          desc="Enter your farm area, region, crop choice, and target season to estimate the harvest tonnage per hectare based on multiple cycles of regional history."
          details="Technology: XGBoost Regression • Spatial District Encodings • Seasonal Growth Index"
          to="/yield"
          icon={Wheat}
          glowColor="bg-amber-500"
          delay={0.3}
          fallback="Wheat"
        />

        <FeatureRow
          number="04"
          title="Gemini Farm AI Assistant (LLM Advisor)"
          desc="Interact with a domain-expert chatbot powered by Google Gemini. Ask follow-up questions about disease treatments, organic fertilizer recipes, crop rotation schedules, and irrigation planning."
          details="Technology: Google Gemini Generative API • Context-Aware Conversational System"
          to="/farm-assistant"
          icon={BrainCircuit}
          glowColor="bg-blue-500"
          delay={0.4}
        />

        <FeatureRow
          number="05"
          title="Integrated Farm Intelligence Report"
          desc="Compile soil measurements, crop recommendations, yield projections, and leaf images into a single aggregated report. Runs all models concurrently to provide a comprehensive PDF intelligence summary."
          details="Technology: Multi-Agent Fused API Pipeline • Integrated Report Compiler"
          to="/report"
          icon={FileText}
          glowColor="bg-indigo-500"
          delay={0.5}
        />
      </div>
    </motion.div>
  );
};

export default Home;
