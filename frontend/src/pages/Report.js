import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertTriangle, UploadCloud, Map, Droplets } from 'lucide-react';
import { PageHeader, Card, Button, Input, InputGroup, Badge, SectionHeader, Tilt } from '../design-system/components';
import { pageVariants, pageTransition, fadeInLeft, fadeInRight, slideUp } from '../design-system/animations';

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
    Year: 2024
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      setError(err.response?.data?.error || 'Failed to request fused model report compilation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      {...pageVariants}
      transition={pageTransition}
      className="space-y-8 pb-16"
    >
      <PageHeader
        icon={FileText}
        title={t('report_title')}
        subtitle="Unified Farm Intelligence Report Compiler"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Data Fuser Entry Fields */}
        <motion.div {...fadeInLeft} className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col">
            <h2 className="text-[11px] font-bold text-white/30 uppercase tracking-widest font-mono flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-brand-400" /> Pipeline Aggregators
            </h2>
            <p className="text-caption text-white/20 mt-1 leading-relaxed">
              Supply multi-spectral leaf photos, biosphere soil conditions, and target coordinates.
            </p>
          </div>

          <Tilt spotlight={true} intensity={20}>
            <Card variant="glass" padding="md" className="relative overflow-hidden group">
              <form onSubmit={handlePredict} className="space-y-6 relative z-10">

                {/* Leaf Image capture preview dropzone */}
                <div className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-lg">
                  <SectionHeader
                    icon={UploadCloud}
                    title={t('report_plant_image')}
                    iconColor="text-brand-400"
                    className="mb-2"
                  />
                  <div
                    className="border border-dashed border-white/10 bg-surface-900/50 rounded-lg p-5 flex flex-col items-center justify-center text-center hover:border-brand-500/30 hover:bg-white/[0.02] transition-all cursor-pointer font-mono text-caption"
                    onClick={() => document.getElementById('report-file').click()}
                  >
                    <input id="report-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {preview ? (
                      <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={preview} alt="Leaf Specimen" className="h-20 object-contain rounded shadow"
                      />
                    ) : (
                      <span className="text-white/20 uppercase tracking-widest text-[9px] font-bold">specimen leaf image</span>
                    )}
                  </div>
                </div>

                {/* Soil elements */}
                <div className="space-y-3">
                  <SectionHeader
                    icon={Droplets}
                    title={t('report_biosphere_metrics')}
                    iconColor="text-brand-400"
                  />
                  <InputGroup cols={2} gap="gap-4">
                    {[
                      { name: 'Nitrogen', label: t('report_nitrogen'), unit: 'kg/ha' },
                      { name: 'Phosphorus', label: t('report_phosphorus'), unit: 'kg/ha' },
                      { name: 'Potassium', label: t('report_potassium'), unit: 'kg/ha' },
                      { name: 'Temperature', label: t('report_temperature'), unit: '°C' },
                      { name: 'Humidity', label: t('report_humidity'), unit: '%' },
                      { name: 'pH', label: t('report_ph'), unit: 'pH' },
                      { name: 'Rainfall', label: t('report_rainfall'), unit: 'mm' },
                    ].map(f => (
                      <Input
                        key={f.name}
                        type="number"
                        step="any"
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        required
                        label={f.label}
                        unit={f.unit}
                        inputClassName="font-mono text-caption"
                      />
                    ))}
                  </InputGroup>
                </div>

                {/* Spatial targets */}
                <div className="space-y-3 pt-2">
                  <SectionHeader
                    icon={Map}
                    title={t('report_location_details')}
                    iconColor="text-accent-500"
                  />
                  <InputGroup cols={2} gap="gap-4">
                    <Input
                      type="text"
                      name="Area"
                      value={formData.Area}
                      onChange={handleChange}
                      required
                      label={t('report_area')}
                      inputClassName="font-mono text-caption"
                    />
                    <Input
                      type="text"
                      name="Crop"
                      value={formData.Crop}
                      onChange={handleChange}
                      required
                      label={t('report_crop')}
                      inputClassName="font-mono text-caption"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        type="number"
                        name="Year"
                        value={formData.Year}
                        onChange={handleChange}
                        required
                        label={t('report_year')}
                        inputClassName="font-mono text-caption"
                      />
                    </div>
                  </InputGroup>
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    type="submit"
                    icon={FileText}
                  >
                    Compile Aggregations
                  </Button>
                </div>
              </form>
            </Card>
          </Tilt>
        </motion.div>

        {/* RIGHT COLUMN: Fused Report display */}
        <motion.div {...fadeInRight} className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Error */}
            {error && (
              <motion.div
                key="error"
                {...slideUp}
                className="p-4 rounded-lg bg-danger/10 border border-danger/20 flex gap-3 text-danger-light text-body-sm font-mono"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">COMPILATION ERROR</h4>
                  <p className="text-white/50 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Placeholder */}
            {!result && !error && !loading && (
              <motion.div
                key="placeholder"
                {...slideUp}
                className="border border-dashed border-white/5 bg-surface-800/10 rounded-xl p-16 flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <div className="w-12 h-12 rounded-full bg-white/[0.01] border border-white/[0.04] flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-white/20" />
                </div>
                <h4 className="font-heading text-body-md text-white/50 font-semibold">Report Compiler Staged</h4>
                <p className="text-caption text-white/20 mt-1 max-w-xs leading-relaxed">
                  Provide variables in the pipeline console and compile to trigger unified farm intelligence fusion.
                </p>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <div className="border border-white/[0.03] bg-surface-800/20 rounded-xl p-16 flex flex-col items-center justify-center min-h-[500px] font-mono">
                <div className="w-10 h-10 border border-white/20 border-t-white animate-spin rounded-full mb-4" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest animate-pulse">Running Fuser Agents...</span>
              </div>
            )}

            {/* Results output */}
            {result && !loading && (
              <motion.div
                key="result"
                {...slideUp}
                className="space-y-6"
              >
                <Tilt spotlight={true} intensity={25}>
                  <Card variant="glass" padding="md" className="relative overflow-hidden border-brand-500/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/[0.02] rounded-full blur-[60px]" />
                    <div className="flex flex-col items-center justify-center text-center py-4">
                      <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/25 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6 text-brand-400" />
                      </div>
                      <h3 className="font-heading text-heading-md font-bold text-gradient-white uppercase tracking-wider">
                        Fusion Compilation Complete
                      </h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-brand-300 font-mono mt-1">
                        Report Index SEC-4-AG
                      </span>
                    </div>
                  </Card>
                </Tilt>

                {/* Disease panel */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-lg p-5">
                  <SectionHeader
                    icon={FileText}
                    title={t('report_disease_detection')}
                    iconColor="text-brand-400"
                    action={<span className="w-2 h-2 rounded-full bg-danger animate-pulse block" />}
                  />
                  {result.disease_prediction ? (
                    result.disease_prediction.error ? (
                      <p className="text-danger-light font-mono text-body-sm mt-3">{result.disease_prediction.error}</p>
                    ) : (
                      <div className="flex justify-between items-end mt-4 font-mono text-caption">
                        <div>
                          <p className="font-heading text-body-sm font-semibold text-white capitalize leading-none">
                            {result.disease_prediction.disease}
                          </p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_detected_signature')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-danger-light leading-none">
                            {result.disease_prediction.confidence?.toFixed(1)}%
                          </p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_certainty')}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-white/20 font-mono text-[10px] tracking-wider mt-3">NO leaf photo supplied for compilation</p>
                  )}
                </div>

                {/* Crop recommendation */}
                {result.crop_recommendation && (
                  <div className="bg-white/[0.01] border border-white/[0.03] rounded-lg p-5">
                    <SectionHeader
                      icon={CheckCircle}
                      title={t('report_crop_recommendation')}
                      iconColor="text-brand-400"
                    />
                    {result.crop_recommendation.error ? (
                      <p className="text-danger-light font-mono text-body-sm mt-3">{result.crop_recommendation.error}</p>
                    ) : (
                      <div className="flex justify-between items-end mt-4 font-mono text-caption">
                        <div>
                          <p className="font-heading text-body-sm font-semibold text-brand-300 capitalize leading-none">
                            {result.crop_recommendation.recommended_crop}
                          </p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_best_crop')}</p>
                        </div>
                        {result.crop_recommendation.confidence && (
                          <div className="text-right">
                            <p className="font-semibold text-white leading-none">
                              {result.crop_recommendation.confidence.toFixed(1)}%
                            </p>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_match')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Yield Forecast output */}
                {result.yield_prediction && (
                  <div className="bg-white/[0.01] border border-white/[0.03] rounded-lg p-5">
                    <SectionHeader
                      icon={FileText}
                      title={t('report_yield_forecast')}
                      iconColor="text-accent-500"
                    />
                    {result.yield_prediction.error ? (
                      <p className="text-danger-light font-mono text-body-sm mt-3">{result.yield_prediction.error}</p>
                    ) : (
                      <div className="flex justify-between items-end mt-4 font-mono text-caption">
                        <div>
                          <p className="font-heading text-body-sm font-semibold text-accent-400 leading-none">
                            {result.yield_prediction.predicted_yield?.toFixed(2)} <span className="text-[9px] text-white/20">t/ha</span>
                          </p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_estimated_yield')}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={result.yield_prediction.yield_level === 'HIGH' ? 'success' : result.yield_prediction.yield_level === 'MEDIUM' ? 'warning' : 'danger'} size="sm">
                            {result.yield_prediction.yield_level}
                          </Badge>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1.5">{t('report_yield_level')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Report;
