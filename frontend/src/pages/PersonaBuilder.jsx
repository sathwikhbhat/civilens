import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const steps = [
    { id: 1, title: 'Demographics' },
    { id: 2, title: 'Economic & Geographic' },
    { id: 3, title: 'Occupation' }
];

const PersonaBuilder = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State matching the Swagger Schema
    const [formData, setFormData] = useState({
        language: 'EN',
        demographics: {
            age: '',
            gender: '',
            category: '',
            familySize: ''
        },
        economic: {
            incomeBracket: '',
            bplStatus: false
        },
        geographic: {
            state: '',
            district: '',
            areaType: ''
        },
        occupation: {
            type: '',
            details: {}
        }
    });

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleOccupationDetailChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            occupation: {
                ...prev.occupation,
                details: {
                    ...prev.occupation.details,
                    [field]: value
                }
            }
        }));
    };

    // Rest of occupation changing logic to clear details on type change
    const handleOccupationTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            occupation: {
                type: value,
                details: value === 'FARMER' ? { landHolding: { value: '', unit: 'ACRE' } } : {}
            }
        }));
    };

    const handleLandHoldingChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            occupation: {
                ...prev.occupation,
                details: {
                    ...prev.occupation.details,
                    landHolding: {
                        ...prev.occupation.details.landHolding,
                        [field]: value
                    }
                }
            }
        }));
    };

    const isStep1Valid = () => {
        const { age, gender, category, familySize } = formData.demographics;
        return !!age && !!gender && !!category && !!familySize;
    };

    const isStep2Valid = () => {
        const { incomeBracket } = formData.economic;
        const { state, district, areaType } = formData.geographic;
        return !!incomeBracket && !!state && !!district && !!areaType;
    };

    const isStep3Valid = () => {
        const { type, details } = formData.occupation;
        if (!type) return false;

        switch (type) {
            case 'FARMER':
                return !!details.landHolding?.value &&
                    !!details.landHolding?.unit &&
                    !!details.irrigationType &&
                    !!details.primaryCropCategory;
            case 'STUDENT':
                return !!details.educationLevel && !!details.institutionType && !!details.stream;
            case 'WORKER':
                return !!details.employmentCategory && !!details.industryType;
            case 'SELF_EMPLOYED':
                return !!details.sector &&
                    !!details.yearsOperational &&
                    !!details.enterpriseSize &&
                    !!details.annualTurnoverBracket;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !isStep1Valid()) return;
        if (currentStep === 2 && !isStep2Valid()) return;
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert numeric fields properly before submitting
        const payload = { ...formData };
        payload.demographics.age = Number(payload.demographics.age);
        payload.demographics.familySize = Number(payload.demographics.familySize);

        if (payload.occupation.type === 'FARMER' && payload.occupation.details.landHolding) {
            payload.occupation.details.landHolding.value = Number(payload.occupation.details.landHolding.value);
        }
        if (payload.occupation.type === 'SELF_EMPLOYED' && payload.occupation.details.yearsOperational) {
            payload.occupation.details.yearsOperational = Number(payload.occupation.details.yearsOperational);
        }

        try {
            const backendBaseUrl = import.meta.env.VITE_APP_BACKEND_URL || import.meta.env.VITE_APP_SCHEME_ENGINE_BASE_URL || 'https://swagger-8fzm.onrender.com';

            const response = await fetch(`${backendBaseUrl}/detect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('Detection Results:', data);

            // Persist the user's successfully created persona securely in localStorage
            localStorage.setItem('civilens_persona', JSON.stringify(payload));

            setTimeout(() => {
                navigate('/schemes', { state: { persona: payload, schemes: data.schemes || [] } });
            }, 1500);

        } catch (err) {
            console.error("Failed to fetch schemes:", err);
            setIsSubmitting(false);
            // Fallback empty navigation so UI doesn't hang in case of failure
            navigate('/schemes', { state: { persona: payload, schemes: [] } });
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                            <input type="number" value={formData.demographics.age} onChange={(e) => handleNestedChange('demographics', 'age', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 35" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                            <select value={formData.demographics.gender} onChange={(e) => handleNestedChange('demographics', 'gender', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                            <select value={formData.demographics.category} onChange={(e) => handleNestedChange('demographics', 'category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select category</option>
                                <option value="GENERAL">General</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="OBC">OBC</option>
                                <option value="MINORITY">Minority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Family Size</label>
                            <input type="number" value={formData.demographics.familySize} onChange={(e) => handleNestedChange('demographics', 'familySize', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 4" />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income Bracket</label>
                            <select value={formData.economic.incomeBracket} onChange={(e) => handleNestedChange('economic', 'incomeBracket', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select bracket</option>
                                <option value="ZERO_TO_1L">Up to 1 Lakh</option>
                                <option value="ONE_TO_3L">1 Lakh to 3 Lakhs</option>
                                <option value="THREE_TO_5L">3 Lakhs to 5 Lakhs</option>
                                <option value="FIVE_L_PLUS">Above 5 Lakhs</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                            <input type="checkbox" id="bplStatus" checked={formData.economic.bplStatus} onChange={(e) => handleNestedChange('economic', 'bplStatus', e.target.checked)} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                            <label htmlFor="bplStatus" className="text-sm font-medium text-slate-700">Below Poverty Line (BPL) Status Verification</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">State / Union Territory</label>
                            <select value={formData.geographic.state} onChange={(e) => handleNestedChange('geographic', 'state', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select State/UT</option>
                                <option value="ANDAMAN_AND_NICOBAR">Andaman and Nicobar Islands</option>
                                <option value="ANDHRA_PRADESH">Andhra Pradesh</option>
                                <option value="ARUNACHAL_PRADESH">Arunachal Pradesh</option>
                                <option value="ASSAM">Assam</option>
                                <option value="BIHAR">Bihar</option>
                                <option value="CHANDIGARH">Chandigarh</option>
                                <option value="CHHATTISGARH">Chhattisgarh</option>
                                <option value="DADRA_AND_NAGAR_HAVELI">Dadra and Nagar Haveli and Daman and Diu</option>
                                <option value="DELHI">Delhi</option>
                                <option value="GOA">Goa</option>
                                <option value="GUJARAT">Gujarat</option>
                                <option value="HARYANA">Haryana</option>
                                <option value="HIMACHAL_PRADESH">Himachal Pradesh</option>
                                <option value="JAMMU_AND_KASHMIR">Jammu and Kashmir</option>
                                <option value="JHARKHAND">Jharkhand</option>
                                <option value="KARNATAKA">Karnataka</option>
                                <option value="KERALA">Kerala</option>
                                <option value="LADAKH">Ladakh</option>
                                <option value="LAKSHADWEEP">Lakshadweep</option>
                                <option value="MADHYA_PRADESH">Madhya Pradesh</option>
                                <option value="MAHARASHTRA">Maharashtra</option>
                                <option value="MANIPUR">Manipur</option>
                                <option value="MEGHALAYA">Meghalaya</option>
                                <option value="MIZORAM">Mizoram</option>
                                <option value="NAGALAND">Nagaland</option>
                                <option value="ODISHA">Odisha</option>
                                <option value="PUDUCHERRY">Puducherry</option>
                                <option value="PUNJAB">Punjab</option>
                                <option value="RAJASTHAN">Rajasthan</option>
                                <option value="SIKKIM">Sikkim</option>
                                <option value="TAMIL_NADU">Tamil Nadu</option>
                                <option value="TELANGANA">Telangana</option>
                                <option value="TRIPURA">Tripura</option>
                                <option value="UTTAR_PRADESH">Uttar Pradesh</option>
                                <option value="UTTARAKHAND">Uttarakhand</option>
                                <option value="WEST_BENGAL">West Bengal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
                            <input type="text" value={formData.geographic.district} onChange={(e) => handleNestedChange('geographic', 'district', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Pune" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Area Type</label>
                            <select value={formData.geographic.areaType} onChange={(e) => handleNestedChange('geographic', 'areaType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select Area Type</option>
                                <option value="RURAL">Rural</option>
                                <option value="URBAN">Urban</option>
                            </select>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Occupation Type</label>
                            <select value={formData.occupation.type} onChange={(e) => handleOccupationTypeChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                                <option value="">Select Type</option>
                                <option value="FARMER">Farmer</option>
                                <option value="STUDENT">Student</option>
                                <option value="WORKER">Worker</option>
                                <option value="SELF_EMPLOYED">Self Employed</option>
                            </select>
                        </div>

                        {/* Dynamic Fields */}
                        {formData.occupation.type === 'FARMER' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
                                <h4 className="font-semibold text-primary-900 mb-2">Farmer Details</h4>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Land Holding Value</label>
                                        <input type="number" value={formData.occupation.details.landHolding?.value || ''} onChange={(e) => handleLandHoldingChange('value', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200" placeholder="0.0" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Unit</label>
                                        <select value={formData.occupation.details.landHolding?.unit || 'ACRE'} onChange={(e) => handleLandHoldingChange('unit', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                            <option value="ACRE">Acre</option>
                                            <option value="HECTARE">Hectare</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Irrigation Type</label>
                                    <select value={formData.occupation.details.irrigationType || ''} onChange={(e) => handleOccupationDetailChange('irrigationType', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="RAINFED">Rainfed</option>
                                        <option value="PARTIAL">Partial</option>
                                        <option value="IRRIGATED">Irrigated</option>
                                        <option value="UNIRRIGATED">Unirrigated</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Primary Crop Category</label>
                                    <select value={formData.occupation.details.primaryCropCategory || ''} onChange={(e) => handleOccupationDetailChange('primaryCropCategory', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="FOODGRAIN">Foodgrain</option>
                                        <option value="HORTICULTURE">Horticulture</option>
                                        <option value="FOOD_CROP">Food Crop</option>
                                        <option value="CASH_CROP">Cash Crop</option>
                                        <option value="MIXED">Mixed</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {formData.occupation.type === 'STUDENT' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
                                <h4 className="font-semibold text-primary-900 mb-2">Student Details</h4>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Education Level</label>
                                    <select value={formData.occupation.details.educationLevel || ''} onChange={(e) => handleOccupationDetailChange('educationLevel', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="SCHOOL">School</option>
                                        <option value="PRIMARY">Primary</option>
                                        <option value="SECONDARY">Secondary</option>
                                        <option value="HIGHER_SECONDARY">Higher Secondary</option>
                                        <option value="DIPLOMA">Diploma</option>
                                        <option value="VOCATIONAL">Vocational</option>
                                        <option value="UG">Undergraduate (UG)</option>
                                        <option value="PG">Postgraduate (PG)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution Type</label>
                                    <select value={formData.occupation.details.institutionType || ''} onChange={(e) => handleOccupationDetailChange('institutionType', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="GOVERNMENT">Government</option>
                                        <option value="PRIVATE">Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Stream</label>
                                    <select value={formData.occupation.details.stream || ''} onChange={(e) => handleOccupationDetailChange('stream', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="ARTS">Arts</option>
                                        <option value="COMMERCE">Commerce</option>
                                        <option value="SCIENCE">Science</option>
                                        <option value="ENGINEERING">Engineering</option>
                                        <option value="MEDICAL">Medical</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {formData.occupation.type === 'WORKER' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
                                <h4 className="font-semibold text-primary-900 mb-2">Worker Details</h4>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Employment Category</label>
                                    <select value={formData.occupation.details.employmentCategory || ''} onChange={(e) => handleOccupationDetailChange('employmentCategory', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="ORGANISED">Organised</option>
                                        <option value="UNORGANISED">Unorganised</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="DAILY_WAGE">Daily Wage</option>
                                        <option value="STREET_VENDOR">Street Vendor</option>
                                        <option value="HOMEMAKER">Homemaker</option>
                                        <option value="RETIRED">Retired</option>
                                        <option value="UNEMPLOYED">Unemployed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Industry Type</label>
                                    <select value={formData.occupation.details.industryType || ''} onChange={(e) => handleOccupationDetailChange('industryType', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="RETAIL">Retail</option>
                                        <option value="CONSTRUCTION">Construction</option>
                                        <option value="MANUFACTURING">Manufacturing</option>
                                        <option value="AGRICULTURE">Agriculture</option>
                                        <option value="TEXTILE">Textile</option>
                                        <option value="HANDICRAFT">Handicraft</option>
                                        <option value="DOMESTIC_WORK">Domestic Work</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                    <input type="checkbox" id="isMigrantWorker" checked={formData.occupation.details.isMigrantWorker || false} onChange={(e) => handleOccupationDetailChange('isMigrantWorker', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                                    <label htmlFor="isMigrantWorker" className="text-xs font-medium text-slate-700">Are you a Migrant Worker?</label>
                                </div>
                            </motion.div>
                        )}

                        {formData.occupation.type === 'SELF_EMPLOYED' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-4 bg-primary-50/50 border border-primary-100 rounded-xl">
                                <h4 className="font-semibold text-primary-900 mb-2">Self-Employed Details</h4>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Sector</label>
                                    <select value={formData.occupation.details.sector || ''} onChange={(e) => handleOccupationDetailChange('sector', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="MANUFACTURING">Manufacturing</option>
                                        <option value="SERVICES">Services</option>
                                        <option value="RETAIL">Retail</option>
                                        <option value="AGRO_PROCESSING">Agro Processing</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Years Operational</label>
                                    <input type="number" value={formData.occupation.details.yearsOperational || ''} onChange={(e) => handleOccupationDetailChange('yearsOperational', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200" placeholder="e.g. 5" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Enterprise Size</label>
                                    <select value={formData.occupation.details.enterpriseSize || ''} onChange={(e) => handleOccupationDetailChange('enterpriseSize', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="MICRO">Micro</option>
                                        <option value="SMALL">Small</option>
                                        <option value="MEDIUM">Medium</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Annual Turnover Bracket</label>
                                    <select value={formData.occupation.details.annualTurnoverBracket || ''} onChange={(e) => handleOccupationDetailChange('annualTurnoverBracket', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200">
                                        <option value="">Select...</option>
                                        <option value="ZERO_TO_5L">0 to 5 Lakhs</option>
                                        <option value="FIVE_TO_10L">5 to 10 Lakhs</option>
                                        <option value="TEN_TO_50L">10 to 50 Lakhs</option>
                                        <option value="FIFTY_L_PLUS">Above 50 Lakhs</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}

                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-24 pb-12 flex-1 w-full bg-slate-50 min-h-screen relative overflow-hidden flex items-center justify-center">
            <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 relative z-10">
                <AnimatePresence>
                    {isSubmitting && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center glass-card">
                            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Sparkles className="text-saffron-500" /> Sending Persona Data...
                            </h3>
                            <p className="text-slate-500 text-center max-w-sm">Linking to Civilens API backend...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Build Your Persona</h1>
                    <p className="text-slate-500">Find exactly what you are eligible for securely.</p>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="bg-slate-50/50 border-b border-slate-200 p-6 sm:px-8">
                        <div className="flex justify-between items-center mb-4">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${currentStep > step.id ? 'bg-india-green-500 text-white' : currentStep === step.id ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                        {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                                </div>
                            ))}
                            <div className="absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-slate-200 -z-10">
                                <motion.div className="h-full bg-primary-500" initial={{ width: '0%' }} animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.3 }} />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8">
                        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
                    </div>
                    <div className="px-6 sm:px-8 py-5 bg-slate-50/50 border-t border-slate-200 flex justify-between items-center">
                        <button onClick={handleBack} disabled={currentStep === 1 || isSubmitting} className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
                            <ChevronLeft size={18} className="mr-1" /> Back
                        </button>
                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                                className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${(currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-black text-white shadow-md'}`}
                            >
                                Next Step <ChevronRight size={18} className="ml-1" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!isStep3Valid() || isSubmitting}
                                className={`flex items-center px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${!isStep3Valid() || isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'}`}
                            >
                                Create Persona <Sparkles size={18} className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaBuilder;
