import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, Sprout, Wheat, ArrowRight, BrainCircuit,
  FileText, Activity, Terminal
} from 'lucide-react';
import { Button, Card, Tilt } from '../design-system/components';
import { pageVariants, pageTransition } from '../design-system/animations';

const Home = () => {

  const pipelines = [
    {
      id: '01',
      title: 'Neural Disease Vision',
      tag: 'CNN Ensemble',
      status: 'Ready',
      desc: 'Ensemble Convolutional Networks (ResNet-50 + EfficientNet-B1) for diagnostic leaf blight identification.',
      path: '/disease',
      icon: Leaf,
      glow: '#22c55e',
    },
    {
      id: '02',
      title: 'Biosphere Calibration',
      tag: 'Soft Voting',
      status: 'Ready',
      desc: 'Stratified voting classifier matching N-P-K soil matrices and localized moisture readings with suitable cultivars.',
      path: '/crop',
      icon: Sprout,
      glow: '#eab308',
    },
    {
      id: '03',
      title: 'Yield Forecast Engine',
      tag: 'Regression Pipeline',
      status: 'Ready',
      desc: 'Spatial-temporal regressors computing regional district production forecasts metric tonnes per hectare.',
      path: '/yield',
      icon: Wheat,
      glow: '#eab308',
    },
    {
      id: '04',
      title: 'Gemini Assistant CLI',
      tag: 'Generative AI',
      status: 'Active',
      desc: 'Generative agricultural advisory model answering treatment methods, crop rotation cycles, and irrigation planning.',
      path: '/farm-assistant',
      icon: BrainCircuit,
      glow: '#3b82f6',
    },
    {
      id: '05',
      title: 'Report Compiler',
      tag: 'Multi-Agent Fuser',
      status: 'Compiled',
      desc: 'Fusion pipeline aggregating soil parameters, crop suggestions, regional projections, and diagnosed blights.',
      path: '/report',
      icon: FileText,
      glow: '#6366f1',
    }
  ];

  return (
    <motion.div
      {...pageVariants}
      transition={pageTransition}
      className="space-y-12 pb-16"
    >
      {/* ─── Header ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-8 gap-6">
        <div>
          <span className="text-[10px] text-brand-400 font-mono font-bold tracking-widest uppercase">
            {"// PRECISION AGRICULTURE INTELLIGENCE"}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
            Workspace Console
          </h1>
          <p className="text-body-md text-white/40 mt-3 max-w-2xl font-light leading-relaxed">
            An enterprise precision agronomy platform integrating neural vision pipelines, spatial regional yield forecasts, and context-aware generative advisory nodes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={Terminal} to="/farm-assistant">
            Quick Terminal
          </Button>
          <Button variant="primary" size="md" icon={FileText} to="/report">
            Fuser Report
          </Button>
        </div>
      </div>

      {/* ─── Status Bar ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] font-mono">
        {[
          { label: 'System Load', val: '0.04%' },
          { label: 'API Latency', val: '24ms' },
          { label: 'Vision Model', val: 'Calibrated' },
          { label: 'Connection', val: 'SECURE SSL' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col px-4 border-l border-white/[0.06] first:border-l-0">
            <span className="text-[9px] uppercase tracking-wider text-white/30">{s.label}</span>
            <span className="text-body-sm font-semibold text-white/80 mt-1">{s.val}</span>
          </div>
        ))}
      </div>

      {/* ─── Pipeline Modules ──────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-brand-400" />
          <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest font-mono">
            Active Workspace Pipelines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelines.map((p) => (
            <Tilt key={p.id} spotlight={true} intensity={25} className="h-full">
              <Link to={p.path} className="block h-full">
                <Card
                  variant="glass"
                  padding="lg"
                  className="h-full flex flex-col justify-between group hover:border-brand-500/20"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] group-hover:border-brand-500/25 transition-colors">
                        <p.icon className="w-4 h-4 text-brand-400 group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider font-mono">
                          {p.tag}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      </div>
                    </div>

                    <h3 className="font-heading text-heading-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-body-sm text-white/40 mt-3 leading-relaxed font-light line-clamp-3">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between text-caption font-semibold tracking-wider uppercase text-white/30 group-hover:text-brand-400 transition-colors font-mono">
                    <span>Pipeline {p.id}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </Tilt>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

