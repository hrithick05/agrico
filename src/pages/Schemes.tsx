import React, { useState, useMemo } from 'react';
import '../components/TamilNaduFarmerSchemes.css';
import { useLanguage } from '@/contexts/LanguageContext';

// Type definitions for the Tamil Nadu Farmer Schemes
interface Scheme {
  id: number;
  title: string;
  category: string;
  caste: string;
  description: string;
  benefits: string[];
  eligibility: string;
  applicationProcess: string;
  contact: string;
  directBenefits: string;
}

interface Category {
  value: string;
  label: string;
}

interface CasteOption {
  value: string;
  label: string;
  color: string;
}

const TamilNaduFarmerSchemes: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCaste, setSelectedCaste] = useState<string | null>(null);

  // Tamil Nadu Farmer Schemes Data
  const schemes: Scheme[] = [
    {
      id: 1,
      title: t('schemes.cmFarmersProtection'),
      category: "general",
      caste: "all",
      description: t('schemes.cmFarmersProtectionDesc'),
      benefits: [t('schemes.benefits.lifeInsurance'), t('schemes.benefits.accidentCoverage'), t('schemes.benefits.naturalCalamity')],
      eligibility: t('schemes.eligibility.allFarmers'),
      applicationProcess: t('schemes.application.onlineESevai'),
      contact: t('schemes.contact.tollFree'),
      directBenefits: t('schemes.directBenefits.cmProtection')
    },
    {
      id: 9,
      title: t('schemes.summerPloughing'),
      category: "agriculture",
      caste: "all",
      description: t('schemes.summerPloughingDesc'),
      benefits: [t('schemes.benefits.perHectare'), t('schemes.benefits.totalLand'), t('schemes.benefits.directTransfer')],
      eligibility: t('schemes.eligibility.landRecords'),
      applicationProcess: t('schemes.application.agricultureDept'),
      contact: t('schemes.contact.agricultureDept'),
      directBenefits: t('schemes.directBenefits.summerPloughing')
    },
    {
      id: 10,
      title: t('schemes.wellRenovation'),
      category: "irrigation",
      caste: "all",
      description: t('schemes.wellRenovationDesc'),
      benefits: [t('schemes.benefits.perFarmer'), t('schemes.benefits.abandonedWell'), t('schemes.benefits.technicalSupport')],
      eligibility: t('schemes.eligibility.abandonedWells'),
      applicationProcess: t('schemes.application.waterResources'),
      contact: t('schemes.contact.waterResources'),
      directBenefits: t('schemes.directBenefits.wellRenovation')
    },
    {
      id: 11,
      title: t('schemes.naturalFarming'),
      category: "agriculture",
      caste: "all",
      description: t('schemes.naturalFarmingDesc'),
      benefits: [t('schemes.benefits.averageAmount'), t('schemes.benefits.trainingSupport'), t('schemes.benefits.marketLinkage')],
      eligibility: t('schemes.eligibility.naturalFarming'),
      applicationProcess: t('schemes.application.agricultureDept2'),
      contact: t('schemes.contact.naturalFarming'),
      directBenefits: t('schemes.directBenefits.naturalFarming')
    },
    {
      id: 12,
      title: t('schemes.hillFarmers'),
      category: "development",
      caste: "all",
      description: t('schemes.hillFarmersDesc'),
      benefits: [t('schemes.benefits.aroundAmount'), t('schemes.benefits.infrastructureDev'), t('schemes.benefits.marketAccess')],
      eligibility: t('schemes.eligibility.hillAreas'),
      applicationProcess: t('schemes.application.hillDevelopment'),
      contact: t('schemes.contact.hillDevelopment'),
      directBenefits: t('schemes.directBenefits.hillFarmers')
    },
    {
      id: 13,
      title: t('schemes.sugarcaneIncentive'),
      category: "agriculture",
      caste: "all",
      description: t('schemes.sugarcaneIncentiveDesc'),
      benefits: [t('schemes.benefits.perTon'), t('schemes.benefits.directPayment'), t('schemes.benefits.seasonalSupport')],
      eligibility: t('schemes.eligibility.sugarcaneFarmers'),
      applicationProcess: t('schemes.application.automaticSugarMills'),
      contact: t('schemes.contact.sugarCommissioner'),
      directBenefits: t('schemes.directBenefits.sugarcane')
    },
    {
      id: 14,
      title: t('schemes.cropInsurance'),
      category: "insurance",
      caste: "all",
      description: t('schemes.cropInsuranceDesc'),
      benefits: [t('schemes.benefits.premiumSubsidized'), t('schemes.benefits.coverageAmount'), t('schemes.benefits.noContribution')],
      eligibility: t('schemes.eligibility.landRecords'),
      applicationProcess: t('schemes.application.automaticAgriculture'),
      contact: t('schemes.contact.cropInsurance'),
      directBenefits: t('schemes.directBenefits.cropInsurance')
    },
    {
      id: 15,
      title: t('schemes.paddyProcurement'),
      category: "agriculture",
      caste: "all",
      description: t('schemes.paddyProcurementDesc'),
      benefits: [t('schemes.benefits.commonVariety'), t('schemes.benefits.fineVariety'), t('schemes.benefits.stateIncentive')],
      eligibility: t('schemes.eligibility.sugarcaneFarmers'),
      applicationProcess: t('schemes.application.procurementCentres'),
      contact: t('schemes.contact.procurementDept'),
      directBenefits: t('schemes.directBenefits.paddy')
    },
    {
      id: 16,
      title: t('schemes.agriMachinery'),
      category: "equipment",
      caste: "all",
      description: t('schemes.agriMachineryDesc'),
      benefits: [t('schemes.benefits.sixtyPercent'), t('schemes.benefits.powerWeeder'), t('schemes.benefits.installationAssist')],
      eligibility: t('schemes.eligibility.landRecords'),
      applicationProcess: t('schemes.application.agricultureEngineering'),
      contact: t('schemes.contact.agriEngineering'),
      directBenefits: t('schemes.directBenefits.machinery')
    },
    {
      id: 17,
      title: t('schemes.cmServiceCentres'),
      category: "infrastructure",
      caste: "all",
      description: t('schemes.cmServiceCentresDesc'),
      benefits: [t('schemes.benefits.thirtyPercent'), t('schemes.benefits.infrastructureSupport'), t('schemes.benefits.businessDev')],
      eligibility: t('schemes.eligibility.entrepreneurial'),
      applicationProcess: t('schemes.application.agricultureDept3'),
      contact: t('schemes.contact.serviceCentre'),
      directBenefits: t('schemes.directBenefits.serviceCentres')
    },
    {
      id: 18,
      title: t('schemes.nutritionFarming'),
      category: "agriculture",
      caste: "all",
      description: t('schemes.nutritionFarmingDesc'),
      benefits: [t('schemes.benefits.freeSeedKits'), t('schemes.benefits.saplingsWorth'), t('schemes.benefits.trainingSupport2')],
      eligibility: t('schemes.eligibility.allFarmingFamilies'),
      applicationProcess: t('schemes.application.agricultureDept4'),
      contact: t('schemes.contact.nutritionMission'),
      directBenefits: t('schemes.directBenefits.nutrition')
    },
    {
      id: 19,
      title: t('schemes.internationalVisits'),
      category: "training",
      caste: "all",
      description: t('schemes.internationalVisitsDesc'),
      benefits: [t('schemes.benefits.fullyFunded'), t('schemes.benefits.twoLakh'), t('schemes.benefits.internationalLearning')],
      eligibility: t('schemes.eligibility.progressiveFarmers'),
      applicationProcess: t('schemes.application.agricultureDept5'),
      contact: t('schemes.contact.internationalCell'),
      directBenefits: t('schemes.directBenefits.international')
    },
    {
      id: 20,
      title: t('schemes.electricitySubsidy'),
      category: "utility",
      caste: "all",
      description: t('schemes.electricitySubsidyDesc'),
      benefits: [t('schemes.benefits.hundredPercent'), t('schemes.benefits.freePower'), t('schemes.benefits.annualSavings')],
      eligibility: t('schemes.eligibility.agriculturalConnections'),
      applicationProcess: t('schemes.application.electricityBoard'),
      contact: t('schemes.contact.tangedco'),
      directBenefits: t('schemes.directBenefits.electricity')
    },
    {
      id: 2,
      title: t('schemes.adiDravidarWelfare'),
      category: "welfare",
      caste: "SC",
      description: t('schemes.adiDravidarWelfareDesc'),
      benefits: [t('schemes.benefits.landDevSubsidy'), t('schemes.benefits.equipmentSubsidy'), t('schemes.benefits.trainingPrograms')],
      eligibility: t('schemes.eligibility.scCertificate'),
      applicationProcess: t('schemes.application.districtWelfare'),
      contact: t('schemes.contact.districtWelfare'),
      directBenefits: t('schemes.directBenefits.adiDravidar')
    },
    {
      id: 3,
      title: t('schemes.backwardClasses'),
      category: "development",
      caste: "BC",
      description: t('schemes.backwardClassesDesc'),
      benefits: [t('schemes.benefits.modernEquipment'), t('schemes.benefits.seedSubsidy'), t('schemes.benefits.irrigationSupport')],
      eligibility: t('schemes.eligibility.bcCertificate'),
      applicationProcess: t('schemes.application.bcWelfareOnline'),
      contact: t('schemes.contact.bcWelfare'),
      directBenefits: t('schemes.directBenefits.backwardClasses')
    },
    {
      id: 4,
      title: t('schemes.mbcAgriculture'),
      category: "agriculture",
      caste: "MBC",
      description: t('schemes.mbcAgricultureDesc'),
      benefits: [t('schemes.benefits.cropInsurancePremium'), t('schemes.benefits.fertilizerSubsidy'), t('schemes.benefits.marketLinkageSupport')],
      eligibility: t('schemes.eligibility.mbcCertificate'),
      applicationProcess: t('schemes.application.mbcCorporation'),
      contact: t('schemes.contact.mbcCorporation'),
      directBenefits: t('schemes.directBenefits.mbc')
    },
    {
      id: 5,
      title: t('schemes.minorityFarmers'),
      category: "minority",
      caste: "minority",
      description: t('schemes.minorityFarmersDesc'),
      benefits: [t('schemes.benefits.interestFree'), t('schemes.benefits.skillDev'), t('schemes.benefits.marketAccessSupport')],
      eligibility: t('schemes.eligibility.minorityCertificate'),
      applicationProcess: t('schemes.application.minoritiesCorporation'),
      contact: t('schemes.contact.minoritiesCorp'),
      directBenefits: t('schemes.directBenefits.minority')
    },
    {
      id: 6,
      title: t('schemes.tribalFarmers'),
      category: "tribal",
      caste: "ST",
      description: t('schemes.tribalFarmersDesc'),
      benefits: [t('schemes.benefits.landRights'), t('schemes.benefits.traditionalFarming'), t('schemes.benefits.marketAccess')],
      eligibility: t('schemes.eligibility.tribalCertificate'),
      applicationProcess: t('schemes.application.tribalWelfare'),
      contact: t('schemes.contact.tribalWelfare'),
      directBenefits: t('schemes.directBenefits.tribal')
    },
    {
      id: 7,
      title: t('schemes.womenFarmers'),
      category: "women",
      caste: "all",
      description: t('schemes.womenFarmersDesc'),
      benefits: [t('schemes.benefits.womenSpecific'), t('schemes.benefits.financialAssist'), t('schemes.benefits.leadershipDev')],
      eligibility: t('schemes.eligibility.womenAbove18'),
      applicationProcess: t('schemes.application.womenDevelopment'),
      contact: t('schemes.contact.womenDevelopment'),
      directBenefits: t('schemes.directBenefits.women')
    },
    {
      id: 8,
      title: t('schemes.youthFarmers'),
      category: "youth",
      caste: "all",
      description: t('schemes.youthFarmersDesc'),
      benefits: [t('schemes.benefits.startupCapital'), t('schemes.benefits.techTraining'), t('schemes.benefits.mentorship')],
      eligibility: t('schemes.eligibility.age18to35'),
      applicationProcess: t('schemes.application.startupMission'),
      contact: t('schemes.contact.startupMission'),
      directBenefits: t('schemes.directBenefits.youth')
    },
  ];

  // Filter schemes based on search term, category, and caste
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.caste.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      
      // If no caste selected, show only general schemes (caste: 'all')
      // If caste selected, show schemes for that caste + general schemes
      const matchesCaste = selectedCaste === null 
        ? scheme.caste === 'all' 
        : scheme.caste === 'all' || scheme.caste === selectedCaste;
      
      return matchesSearch && matchesCategory && matchesCaste;
    });
  }, [searchTerm, selectedCategory, selectedCaste]);

  const categories: Category[] = [
    { value: 'all', label: t('schemes.allCategories') },
    { value: 'general', label: t('schemes.categories.general') },
    { value: 'welfare', label: t('schemes.categories.welfare') },
    { value: 'development', label: t('schemes.categories.development') },
    { value: 'agriculture', label: t('schemes.categories.agricultural') },
    { value: 'irrigation', label: t('schemes.categories.irrigation') },
    { value: 'insurance', label: t('schemes.categories.insurance') },
    { value: 'equipment', label: t('schemes.categories.equipment') },
    { value: 'infrastructure', label: t('schemes.categories.infrastructure') },
    { value: 'training', label: t('schemes.categories.training') },
    { value: 'utility', label: t('schemes.categories.utility') },
    { value: 'minority', label: t('schemes.castes.minority') },
    { value: 'tribal', label: t('schemes.categories.tribal') },
    { value: 'women', label: t('schemes.categories.women') },
    { value: 'youth', label: t('schemes.categories.youth') }
  ];

  const getCasteColor = (caste: string): string => {
    const colors: Record<string, string> = {
      'all': '#4CAF50',
      'SC': '#FF9800',
      'BC': '#2196F3',
      'MBC': '#9C27B0',
      'minority': '#00BCD4',
      'ST': '#795548'
    };
    return colors[caste] || '#607D8B';
  };

  const casteOptions: CasteOption[] = [
    { value: 'SC', label: `${t('schemes.castes.sc')} (SC)`, color: '#FF9800' },
    { value: 'BC', label: `${t('schemes.castes.obc')} (BC)`, color: '#2196F3' },
    { value: 'MBC', label: `${t('schemes.castes.mbc')} (MBC)`, color: '#9C27B0' },
    { value: 'ST', label: `${t('schemes.castes.st')} (ST)`, color: '#795548' },
    { value: 'minority', label: t('schemes.castes.minority'), color: '#00BCD4' }
  ];

  return (
    <div className="schemes-container">
      <div className="schemes-header">
        <h1>{t('schemes.title')}</h1>
        <p>{t('schemes.subtitle')}</p>
      </div>

      {!selectedCaste && (
        <div className="caste-selection-section">
        <div className="caste-selection-header">
          <h2>{t('schemes.selectCommunity')}</h2>
          <p>{t('schemes.selectCommunityDesc')}</p>
        </div>
          
          <div className="caste-options-grid">
            {casteOptions.map(caste => (
              <button
                key={caste.value}
                className="caste-option-btn"
                onClick={() => setSelectedCaste(caste.value)}
                style={{ borderColor: caste.color }}
              >
                <div className="caste-option-content">
                  <div 
                    className="caste-option-icon"
                    style={{ backgroundColor: caste.color }}
                  >
                    {caste.value}
                  </div>
                  <span className="caste-option-label">{caste.label}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="general-schemes-note">
            <p>
              <strong>{t('common.note')}:</strong> {t('schemes.generalSchemesNote')}
            </p>
          </div>
        </div>
      )}

      {selectedCaste && (
        <div className="selected-caste-info">
          <div className="selected-caste-badge">
            <span 
              className="selected-caste-text"
              style={{ backgroundColor: getCasteColor(selectedCaste) }}
            >
              {casteOptions.find(c => c.value === selectedCaste)?.label}
            </span>
            <button 
              className="change-caste-btn"
              onClick={() => setSelectedCaste(null)}
            >
              {t('schemes.changeCommunity')}
            </button>
          </div>
        </div>
      )}

      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('schemes.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="schemes-grid">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map(scheme => (
            <div key={scheme.id} className="scheme-card">
              <div className="scheme-header">
                <h3 className="scheme-title">{scheme.title}</h3>
                 <span 
                   className="caste-badge"
                   style={{ backgroundColor: scheme.caste === 'all' && selectedCaste ? getCasteColor(selectedCaste) : getCasteColor(scheme.caste) }}
                 >
                   {scheme.caste === 'all' ? 
                     (selectedCaste ? 
                       (selectedCaste === 'SC' ? t('schemes.castes.sc') :
                        selectedCaste === 'BC' ? t('schemes.castes.obc') :
                        selectedCaste === 'MBC' ? t('schemes.castes.mbc') :
                        selectedCaste === 'ST' ? t('schemes.castes.st') :
                        selectedCaste === 'minority' ? t('schemes.castes.minority') : selectedCaste) 
                       : t('schemes.allCastes')) :
                    scheme.caste === 'SC' ? t('schemes.castes.sc') :
                    scheme.caste === 'BC' ? t('schemes.castes.obc') :
                    scheme.caste === 'MBC' ? t('schemes.castes.mbc') :
                    scheme.caste === 'ST' ? t('schemes.castes.st') :
                    scheme.caste === 'minority' ? t('schemes.castes.minority') : scheme.caste}
                 </span>
              </div>

              <div className="scheme-content">
                <p className="scheme-description">{scheme.description}</p>
                
                <div className="direct-benefits-section">
                  <h4>💰 {t('schemes.directBenefits')}:</h4>
                  <div className="direct-benefits-highlight">
                    {scheme.directBenefits}
                  </div>
                </div>

                <div className="benefits-section">
                  <h4>{t('schemes.benefits')}:</h4>
                  <ul className="benefits-list">
                    {scheme.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="scheme-details">
                  <div className="detail-item">
                    <strong>{t('schemes.eligibility')}:</strong>
                    <span>{scheme.eligibility}</span>
                  </div>
                  
                  <div className="detail-item">
                    <strong>{t('schemes.applicationProcess')}:</strong>
                    <span>{scheme.applicationProcess}</span>
                  </div>
                  
                  <div className="detail-item">
                    <strong>{t('schemes.contact')}:</strong>
                    <span className="contact-info">{scheme.contact}</span>
                  </div>
                </div>
              </div>

              <div className="scheme-footer">
                <a 
                  href="https://www.tnagrisnet.tn.gov.in/home/schemes/en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="info-btn"
                >
                  {t('schemes.viewDetails')}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>{t('schemes.noSchemesFound')}</h3>
            <p>{t('schemes.noSchemesFoundDesc')}</p>
          </div>
        )}
      </div>

      <div className="how-to-use-section">
        <div className="how-to-header">
          <h2>📋 {t('schemes.howToApply')}</h2>
          <p>{t('schemes.howToApplyDesc')}</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>🌾 {t('schemes.step1.title')}</h3>
              <ul>
                <li>{t('schemes.step1.desc1')}</li>
                <li>{t('schemes.step1.desc2')}</li>
                <li>{t('schemes.step1.desc3')}</li>
                <li>{t('schemes.step1.desc4')}</li>
              </ul>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>✅ {t('schemes.step2.title')}</h3>
              <ul>
                <li>{t('schemes.step2.desc1')}</li>
                <li>{t('schemes.step2.desc2')}</li>
                <li>{t('schemes.step2.desc3')}</li>
                <li>{t('schemes.step2.desc4')}</li>
              </ul>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>💻 {t('schemes.step3.title')}</h3>
              <ul>
                <li>{t('schemes.step3.desc1')}</li>
                <li>{t('schemes.step3.desc2')}</li>
                <li>{t('schemes.step3.desc3')}</li>
                <li>{t('schemes.step3.desc4')}</li>
              </ul>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>📊 {t('schemes.step4.title')}</h3>
              <ul>
                <li>{t('schemes.step4.desc1')}</li>
                <li>{t('schemes.step4.desc2')}</li>
                <li>{t('schemes.step4.desc3')}</li>
                <li>{t('schemes.step4.desc4')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="quick-links-section">
          <h3>🔗 {t('schemes.quickLinks')}</h3>
          <div className="links-grid">
            <a href="https://www.tnesevai.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span className="link-icon">🏛️</span>
              <span className="link-text">{t('schemes.eSevaiPortal')}</span>
            </a>
            <a href="tel:1800-425-1556" className="quick-link">
              <span className="link-icon">📞</span>
              <span className="link-text">{t('schemes.helpline')}</span>
            </a>
            <a href="https://www.tn.gov.in/departments/agriculture" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span className="link-icon">🌱</span>
              <span className="link-text">{t('schemes.agricultureDepartment')}</span>
            </a>
            <a href="https://youtu.be/33vzuGfzSgI?si=xGMf09IGCbMhcK6h" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span className="link-icon">🚜</span>
              <span className="link-text">{t('schemes.freeTractor')}</span>
            </a>
            <a href="https://youtu.be/EFTwvVXSZ0E?si=Qyz0zV1v7FhnSW7f" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span className="link-icon">🏆</span>
              <span className="link-text">{t('schemes.top5Schemes')}</span>
            </a>
            <a href="https://youtu.be/AqhhkWJmyJk?si=wDLweczdzRMr4BXE" target="_blank" rel="noopener noreferrer" className="quick-link">
              <span className="link-icon">⚙️</span>
              <span className="link-text">{t('schemes.modernMachines')}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="schemes-footer">
        <p>
          <strong>{t('common.note')}:</strong> {t('schemes.footerNote')}
        </p>
      </div>
    </div>
  );
};

export default TamilNaduFarmerSchemes;