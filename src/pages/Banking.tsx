import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Building2, 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  CreditCard, 
  Users, 
  Star,
  CheckCircle,
  FileText,
  DollarSign,
  Calendar,
  Target,
  Shield,
  Award,
  TrendingUp,
  Search,
  X,
  Navigation
} from "lucide-react";

// TypeScript Interfaces
interface LoanScheme {
  name: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  eligibility: string[];
  documents: string[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  ifscCode: string;
  timings: string;
}

interface BankDetails {
  id: string;
  name: string;
  logo: string;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  loanSchemes: LoanScheme[];
  specialFeatures: string[];
  eligibilityCriteria: string[];
  branches: Branch[];
}

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  district: string;
}

export default function Banking() {
  const { t } = useLanguage();
  
  // Bank Data
  const banksData: BankDetails[] = [
  {
    id: 'tn-grama-bank',
    name: t('banking.tnGramaBank'),
    logo: '🏦',
    description: t('banking.tnGramaBankDesc'),
    contactInfo: {
      phone: '1800-425-2233',
      email: 'info@tngramabank.in',
      website: 'https://netbanking.tngb.in/'
    },
    loanSchemes: [
      {
        name: t('banking.kcc'),
        interestRate: t('banking.fourPercent'),
        maxAmount: t('banking.threeLakh'),
        tenure: t('banking.fiveYears'),
        eligibility: [t('banking.minTwoAcres'), t('banking.age18to65'), t('banking.validLandDocs')],
        documents: [t('banking.landOwnershipDocs'), t('banking.aadhaarCard'), t('banking.panCard'), t('banking.bankAccountStatement')]
      },
      {
        name: t('banking.termLoan'),
        interestRate: t('banking.eightFivePercent'),
        maxAmount: t('banking.fiftyLakh'),
        tenure: t('banking.fifteenYears'),
        eligibility: [t('banking.minFiveAcres'), t('banking.goodCreditHistory'), t('banking.incomeProof')],
        documents: [t('banking.landDocuments'), t('banking.incomeCertificate'), t('banking.bankStatements'), t('banking.projectReport')]
      },
      {
        name: t('banking.dairyLoan'),
        interestRate: t('banking.ninePercent'),
        maxAmount: t('banking.fiveLakh'),
        tenure: t('banking.sevenYears'),
        eligibility: [t('banking.dairyExperience'), t('banking.minTwoCows'), t('banking.properShed')],
        documents: [t('banking.animalPurchaseReceipts'), t('banking.veterinaryCertificates'), t('banking.shedDocuments'), t('banking.incomeProof')]
      }
    ],
    specialFeatures: [
      t('banking.subsidizedRates'),
      t('banking.quickApproval'),
      t('banking.doorstepBanking'),
      t('banking.cropInsuranceTieups'),
      t('banking.governmentSchemeBenefits')
    ],
    eligibilityCriteria: [
      t('banking.tamilNaduResident'),
      t('banking.minimum18Years'),
      t('banking.validAgriculturalLand'),
      t('banking.goodCreditHistory2'),
      t('banking.incomeFromAgriculture')
    ],
    branches: [
      {
        id: 'tngb-chennai-1',
        name: t('banking.chennaiMain'),
        address: t('banking.annaSalai'),
        city: 'Chennai',
        district: 'Chennai',
        phone: '044-2855-1234',
        ifscCode: 'TNGB0001001',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-coimbatore-1',
        name: t('banking.coimbatoreMain'),
        address: t('banking.dbRoad'),
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-5678',
        ifscCode: 'TNGB0001002',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-coimbatore-2',
        name: t('banking.tngbGandhipuram'),
        address: t('banking.crossCutRoad'),
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-5679',
        ifscCode: 'TNGB0001003',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-coimbatore-3',
        name: t('banking.tngbRsPuram'),
        address: t('banking.avinashiRoad'),
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-5680',
        ifscCode: 'TNGB0001004',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-coimbatore-4',
        name: t('banking.tngbPeelamedu'),
        address: t('banking.trichyRoad'),
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-5681',
        ifscCode: 'TNGB0001005',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-coimbatore-5',
        name: t('banking.tngbSaibabaColony'),
        address: t('banking.dbRoadSaibaba'),
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-5682',
        ifscCode: 'TNGB0001006',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-madurai-1',
        name: t('banking.maduraiBranch'),
        address: t('banking.westPerumalMaistry'),
        city: 'Madurai',
        district: 'Madurai',
        phone: '0452-234-5678',
        ifscCode: 'TNGB0001003',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      },
      {
        id: 'tngb-salem-1',
        name: t('banking.salemBranch'),
        address: t('banking.fortMainRoad'),
        city: 'Salem',
        district: 'Salem',
        phone: '0427-234-5678',
        ifscCode: 'TNGB0001004',
        timings: `${t('banking.monFri9to5')}, ${t('banking.sat9to1')}`
      }
    ]
  },
  {
    id: 'bank-of-baroda',
    name: t('banking.bankOfBaroda'),
    logo: '🏛️',
    description: t('banking.bankOfBarodaDesc'),
    contactInfo: {
      phone: '1800-258-4455',
      email: 'customer.care@bankofbaroda.com',
      website: 'https://www.bankofbaroda.in'
    },
    loanSchemes: [
      {
        name: t('banking.barodaKcc'),
        interestRate: t('banking.sevenFivePercent'),
        maxAmount: t('banking.fiveLakh'),
        tenure: t('banking.fiveYears'),
        eligibility: [t('banking.agriculturalLand'), t('banking.age18to70'), t('banking.regularFarmingIncome')],
        documents: [t('banking.landOwnershipProof'), t('banking.aadhaarPan'), t('banking.bankStatements'), t('banking.incomeCertificate')]
      },
      {
        name: t('banking.barodaAgriBusiness'),
        interestRate: t('banking.nineFivePercent'),
        maxAmount: t('banking.oneCrore'),
        tenure: t('banking.tenYears'),
        eligibility: [t('banking.agriBusinessEntity'), t('banking.minThreeYears'), t('banking.collateralSecurity')],
        documents: [t('banking.businessRegistration'), t('banking.financialStatements'), t('banking.projectReport'), t('banking.securityDocuments')]
      },
      {
        name: t('banking.barodaTractor'),
        interestRate: t('banking.tenPercent'),
        maxAmount: t('banking.fifteenLakh'),
        tenure: t('banking.fiveYears'),
        eligibility: [t('banking.validDrivingLicense'), t('banking.validAgriculturalLand'), t('banking.downPayment15')],
        documents: [t('banking.drivingLicense'), t('banking.landDocuments'), t('banking.quotationFromDealer'), t('banking.incomeProof')]
      }
    ],
    specialFeatures: [
      t('banking.nationwideNetwork'),
      t('banking.digitalBanking'),
      t('banking.agriAdvisory'),
      t('banking.weatherInsurance'),
      t('banking.governmentSubsidy')
    ],
    eligibilityCriteria: [
      t('banking.indianCitizen'),
      t('banking.age18to70'),
      t('banking.agriculturalLandOwnership'),
      t('banking.regularIncomeFromAgriculture'),
      t('banking.validIdentityAddress')
    ],
    branches: [
      {
        id: 'bob-chennai-1',
        name: 'Chennai Central Branch',
        address: '789 Mount Road, Chennai - 600002',
        city: 'Chennai',
        district: 'Chennai',
        phone: '044-2855-2345',
        ifscCode: 'BARB0CHENNA',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-coimbatore-1',
        name: 'Coimbatore Main Branch',
        address: '234 Trichy Road, Coimbatore - 641018',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-6789',
        ifscCode: 'BARB0COIMBA',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-coimbatore-2',
        name: 'BoB Ukkadam Branch',
        address: '456 Mettupalayam Road, Ukkadam, Coimbatore - 641001',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-6790',
        ifscCode: 'BARB0UKKADA',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-coimbatore-3',
        name: 'BoB Peelamedu Branch',
        address: '789 Trichy Road, Peelamedu, Coimbatore - 641004',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-6791',
        ifscCode: 'BARB0PEELAM',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-coimbatore-4',
        name: 'BoB Saibaba Colony Branch',
        address: '123 DB Road, Saibaba Colony, Coimbatore - 641011',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-6792',
        ifscCode: 'BARB0SAIBAB',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-coimbatore-5',
        name: 'BoB Saravanampatti Branch',
        address: '456 Trichy Road, Saravanampatti, Coimbatore - 641035',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-6793',
        ifscCode: 'BARB0SARAVA',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-madurai-1',
        name: 'Madurai Central Branch',
        address: '567 East Veli Street, Madurai - 625001',
        city: 'Madurai',
        district: 'Madurai',
        phone: '0452-234-6789',
        ifscCode: 'BARB0MADURA',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      },
      {
        id: 'bob-trichy-1',
        name: 'Tiruchirappalli Branch',
        address: '890 Rockins Road, Tiruchirappalli - 620001',
        city: 'Tiruchirappalli',
        district: 'Tiruchirappalli',
        phone: '0431-234-5678',
        ifscCode: 'BARB0TIRUCH',
        timings: '9:30 AM - 4:30 PM (Mon-Fri), 9:30 AM - 12:30 PM (Sat)'
      }
    ]
  },
  {
    id: 'paccs',
    name: 'Primary Agricultural Cooperative Credit Societies (PACCS)',
    logo: '🤝',
    description: 'Local cooperative credit societies providing personalized agricultural financing and support to Tamil Nadu farmers.',
    contactInfo: {
      phone: '044-2855-4000',
      email: 'info@tamilnaducooperative.in',
      website: 'https://rcs.tn.gov.in/credit_copperative.php'
    },
    loanSchemes: [
      {
        name: 'Short Term Crop Loan',
        interestRate: '7% per annum',
        maxAmount: '₹2,00,000',
        tenure: '1 year',
        eligibility: ['Member of PACCS', 'Agricultural land ownership', 'Seasonal farming'],
        documents: ['Membership certificate', 'Land documents', 'Crop insurance', 'Bank passbook']
      },
      {
        name: 'Medium Term Agricultural Loan',
        interestRate: '8.5% per annum',
        maxAmount: '₹10,00,000',
        tenure: '3 years',
        eligibility: ['Active member for 2+ years', 'Good repayment history', 'Collateral security'],
        documents: ['Membership history', 'Previous loan records', 'Security documents', 'Project proposal']
      }
    ],
    specialFeatures: [
      'Local community-based lending',
      'Flexible repayment options',
      'Agricultural extension services',
      'Group lending schemes',
      'Government scheme implementation'
    ],
    eligibilityCriteria: [
      'Must be a member of PACCS',
      'Resident of the local area',
      'Agricultural land ownership/lease',
      'Regular income from farming',
      'Good character certificate'
    ],
    branches: [
      {
        id: 'paccs-chennai-1',
        name: 'Chennai PACCS',
        address: '123 Royapuram, Chennai - 600013',
        city: 'Chennai',
        district: 'Chennai',
        phone: '044-2345-6789',
        ifscCode: 'PACC0001001',
        timings: '9:00 AM - 5:00 PM (Mon-Fri), 9:00 AM - 2:00 PM (Sat)'
      },
      {
        id: 'paccs-coimbatore-1',
        name: 'Coimbatore PACCS',
        address: '456 Gandhipuram, Coimbatore - 641012',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-7890',
        ifscCode: 'PACC0001002',
        timings: '9:00 AM - 5:00 PM (Mon-Fri), 9:00 AM - 2:00 PM (Sat)'
      }
    ]
  },
  {
    id: 'hdfc-bank',
    name: 'HDFC Bank',
    logo: '🏦',
    description: 'Private sector bank offering modern agricultural financing solutions with digital banking convenience for Tamil Nadu farmers.',
    contactInfo: {
      phone: '1800-202-6161',
      email: 'customer.care@hdfcbank.com',
      website: 'https://www.hdfcbank.com'
    },
    loanSchemes: [
      {
        name: 'HDFC Kisan Credit Card',
        interestRate: '8.5% per annum',
        maxAmount: '₹10,00,000',
        tenure: '5 years',
        eligibility: ['Agricultural land ownership', 'Age 21-65 years', 'Regular farming income'],
        documents: ['Land ownership proof', 'Income certificate', 'Bank statements', 'Identity proof']
      },
      {
        name: 'HDFC Agri Business Loan',
        interestRate: '11% per annum',
        maxAmount: '₹50,00,000',
        tenure: '7 years',
        eligibility: ['Agricultural business', 'Minimum 2 years experience', 'Annual turnover ₹10 lakhs'],
        documents: ['Business registration', 'Financial statements', 'GST returns', 'Project report']
      },
      {
        name: 'HDFC Equipment Finance',
        interestRate: '12% per annum',
        maxAmount: '₹25,00,000',
        tenure: '5 years',
        eligibility: ['Equipment purchase purpose', 'Down payment 20%', 'Valid business/agricultural activity'],
        documents: ['Equipment quotation', 'Business proof', 'Down payment proof', 'Security documents']
      }
    ],
    specialFeatures: [
      '24/7 digital banking',
      'Quick online application',
      'Mobile banking app',
      'Competitive interest rates',
      'Dedicated agricultural relationship manager'
    ],
    eligibilityCriteria: [
      'Indian resident',
      'Age 21-65 years',
      'Agricultural land ownership/lease',
      'Regular income from agriculture/business',
      'Valid KYC documents'
    ],
    branches: [
      {
        id: 'hdfc-chennai-1',
        name: 'HDFC Chennai Central',
        address: '456 Nungambakkam High Road, Chennai - 600034',
        city: 'Chennai',
        district: 'Chennai',
        phone: '044-2345-7890',
        ifscCode: 'HDFC0001234',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-coimbatore-1',
        name: 'HDFC Coimbatore Main',
        address: '789 Avinashi Road, Coimbatore - 641018',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-8901',
        ifscCode: 'HDFC0001235',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-coimbatore-2',
        name: 'HDFC Saravanampatti Branch',
        address: '456 Trichy Road, Saravanampatti, Coimbatore - 641035',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-8902',
        ifscCode: 'HDFC0001236',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-coimbatore-3',
        name: 'HDFC Saibaba Colony Branch',
        address: '123 DB Road, Saibaba Colony, Coimbatore - 641011',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-8903',
        ifscCode: 'HDFC0001237',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-coimbatore-4',
        name: 'HDFC Ukkadam Branch',
        address: '789 Mettupalayam Road, Ukkadam, Coimbatore - 641001',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-8904',
        ifscCode: 'HDFC0001238',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-coimbatore-5',
        name: 'HDFC Peelamedu Branch',
        address: '456 Trichy Road, Peelamedu, Coimbatore - 641004',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-8905',
        ifscCode: 'HDFC0001239',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-madurai-1',
        name: 'HDFC Madurai Central',
        address: '123 East Veli Street, Madurai - 625001',
        city: 'Madurai',
        district: 'Madurai',
        phone: '0452-234-8901',
        ifscCode: 'HDFC0001236',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      },
      {
        id: 'hdfc-salem-1',
        name: 'HDFC Salem Branch',
        address: '567 Omalur Main Road, Salem - 636009',
        city: 'Salem',
        district: 'Salem',
        phone: '0427-234-6789',
        ifscCode: 'HDFC0001237',
        timings: '9:15 AM - 5:15 PM (Mon-Fri), 9:15 AM - 1:15 PM (Sat)'
      }
    ]
  },
  {
    id: 'pcardb',
    name: 'Primary Cooperative Agricultural and Rural Development Banks (PCARDBs)',
    logo: '🌾',
    description: 'Specialized cooperative banks focusing on agricultural and rural development financing for Tamil Nadu farmers.',
    contactInfo: {
      phone: '044-2855-4100',
      email: 'info@pcardb.tn.gov.in',
      website: 'https://cooperatives.gov.in/en/home/pacard'
    },
    loanSchemes: [
      {
        name: 'Long Term Agricultural Loan',
        interestRate: '6.5% per annum',
        maxAmount: '₹20,00,000',
        tenure: '20 years',
        eligibility: ['Agricultural land ownership', 'Member of PCARDB', 'Land improvement purpose'],
        documents: ['Land documents', 'Membership certificate', 'Project report', 'Technical sanction']
      },
      {
        name: 'Irrigation Loan',
        interestRate: '7% per annum',
        maxAmount: '₹15,00,000',
        tenure: '15 years',
        eligibility: ['Irrigation project approval', 'Water source availability', 'Land ownership'],
        documents: ['Irrigation project plan', 'Water rights certificate', 'Land documents', 'Technical approval']
      },
      {
        name: 'Rural Housing Loan',
        interestRate: '8% per annum',
        maxAmount: '₹12,00,000',
        tenure: '20 years',
        eligibility: ['Rural area residence', 'Land ownership', 'Income proof'],
        documents: ['Land ownership proof', 'House plan approval', 'Income certificate', 'Identity proof']
      }
    ],
    specialFeatures: [
      'Government-backed schemes',
      'Lowest interest rates',
      'Long repayment tenure',
      'Technical guidance support',
      'Subsidy assistance processing'
    ],
    eligibilityCriteria: [
      'Member of PCARDB',
      'Agricultural land ownership',
      'Rural area residence',
      'Regular income from agriculture',
      'Good repayment capacity'
    ],
    branches: [
      {
        id: 'pcardb-chennai-1',
        name: 'PCARDB Chennai',
        address: '234 T. Nagar, Chennai - 600017',
        city: 'Chennai',
        district: 'Chennai',
        phone: '044-2345-8901',
        ifscCode: 'PCAR0001001',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-coimbatore-1',
        name: 'PCARDB Coimbatore',
        address: '567 Pollachi Road, Coimbatore - 641021',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-9012',
        ifscCode: 'PCAR0001002',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-coimbatore-2',
        name: 'PCARDB Mettupalayam Branch',
        address: '234 Mettupalayam Road, Coimbatore - 641301',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-9013',
        ifscCode: 'PCAR0001003',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-coimbatore-3',
        name: 'PCARDB Kinathukadavu Branch',
        address: '789 Kinathukadavu Road, Coimbatore - 642109',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-9014',
        ifscCode: 'PCAR0001004',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-coimbatore-4',
        name: 'PCARDB Sulur Branch',
        address: '123 Main Road, Sulur, Coimbatore - 641402',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '0422-234-9015',
        ifscCode: 'PCAR0001005',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-coimbatore-5',
        name: 'PCARDB Pollachi Branch',
        address: '456 Market Road, Pollachi, Coimbatore - 642001',
        city: 'Coimbatore',
        district: 'Coimbatore',
        phone: '04259-234-568',
        ifscCode: 'PCAR0001006',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-madurai-1',
        name: 'PCARDB Madurai',
        address: '890 South Veli Street, Madurai - 625001',
        city: 'Madurai',
        district: 'Madurai',
        phone: '0452-234-9012',
        ifscCode: 'PCAR0001003',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      },
      {
        id: 'pcardb-villupuram-1',
        name: 'PCARDB Villupuram',
        address: '123 Gandhi Road, Villupuram - 605602',
        city: 'Villupuram',
        district: 'Villupuram',
        phone: '04146-234-567',
        ifscCode: 'PCAR0001004',
        timings: '9:00 AM - 4:30 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)'
      }
    ]
  }
];

  const [selectedBank, setSelectedBank] = useState<BankDetails | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanScheme | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  const filteredBanks = banksData.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bank: BankDetails) => {
    setSelectedBank(bank);
    setSelectedLoan(null);
  };

  const handleLoanSelect = (loan: LoanScheme) => {
    setSelectedLoan(loan);
  };

  // Function to get user's location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          let district = data.principalSubdivision || data.adminDistrict || 'Unknown';
          let city = data.city || data.locality || 'Unknown';
          
          if (district.includes('Tamil Nadu') || district.includes('TamilNadu')) {
            district = city;
          }
          
          if (city.toLowerCase().includes('sulur') || city.toLowerCase().includes('coimbatore')) {
            district = 'Coimbatore';
            city = city.toLowerCase().includes('sulur') ? 'Sulur' : 'Coimbatore';
          }
          
          setUserLocation({
            latitude,
            longitude,
            city,
            district
          });
        } catch (error) {
          setUserLocation({
            latitude,
            longitude,
            city: 'Chennai',
            district: 'Chennai'
          });
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Function to get nearby branches for a bank
  const getNearbyBranches = (bank: BankDetails, userCity: string, userDistrict: string) => {
    return bank.branches.filter(branch => {
      const cityMatch = branch.city.toLowerCase() === userCity.toLowerCase() ||
                       branch.city.toLowerCase() === userDistrict.toLowerCase();
      const districtMatch = branch.district.toLowerCase() === userDistrict.toLowerCase() ||
                           branch.district.toLowerCase() === userCity.toLowerCase();
      
      return cityMatch || districtMatch;
    });
  };

  // Load location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Building2 className="h-10 w-10" />
            {t('banking.title')}
          </h1>
          <p className="text-xl opacity-90">
            {t('banking.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('banking.searchBanks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-green-200 focus:border-green-500 rounded-full"
            />
          </div>
        </div>

        {/* Banks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBanks.map((bank) => (
            <Card 
              key={bank.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-100 hover:border-green-300"
              onClick={() => handleBankSelect(bank)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{bank.logo}</div>
                  <CardTitle className="text-xl text-green-800">{bank.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">{bank.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-green-600" />
                    {bank.contactInfo.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4 text-green-600" />
                    {bank.contactInfo.website}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-green-700 font-semibold">
                    {bank.loanSchemes.length} {t('banking.loanSchemes')} {t('common.available')}
                  </div>
                  {userLocation && (
                    <div className="text-sm text-green-600 mt-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {getNearbyBranches(bank, userLocation.city, userLocation.district).length} {t('banking.nearbyBranches')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bank Details Modal */}
        {selectedBank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
              {/* Sticky Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">{selectedBank.logo}</span>
                    {selectedBank.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBank(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                {/* Location Section */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      {t('banking.getLocation')}
                      {isLoadingLocation && <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userLocation ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <div className="font-semibold text-blue-700">{t('banking.city')}</div>
                          <div className="text-gray-700">{userLocation.city}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="font-semibold text-blue-700">{t('banking.district')}</div>
                          <div className="text-gray-700">{userLocation.district}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="font-semibold text-blue-700">{t('banking.coordinates')}</div>
                          <div className="text-gray-700 text-sm">
                            {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    ) : locationError ? (
                      <div className="text-red-600 mb-4">
                        ⚠️ {locationError}
                        <Button onClick={getUserLocation} className="ml-4" size="sm">
                          {t('banking.tryAgain')}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        🔄 {t('banking.detectingLocation')}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Nearby Branches */}
                {userLocation && (
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-800 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {t('banking.nearbyBranches')}
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                          {getNearbyBranches(selectedBank, userLocation.city, userLocation.district).length} {t('banking.branches')}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getNearbyBranches(selectedBank, userLocation.city, userLocation.district).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getNearbyBranches(selectedBank, userLocation.city, userLocation.district).map((branch) => (
                            <Card key={branch.id} className="bg-white">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-purple-800 mb-2">{branch.name}</h4>
                                <p className="text-gray-600 text-sm mb-3">{branch.address}</p>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-purple-600" />
                                    {branch.phone}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-purple-600" />
                                    {branch.ifscCode}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-purple-600" />
                                    {branch.timings}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-600 py-8">
                          🚫 {t('banking.noBranchesFound')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {t('banking.contact')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">{t('banking.phone')}:</span>
                        <span>{selectedBank.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">{t('banking.email')}:</span>
                        <span>{selectedBank.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">{t('banking.website')}:</span>
                        <a href={selectedBank.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {t('banking.visitWebsite')}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Schemes */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {t('banking.loanSchemes')} {t('common.available')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedBank.loanSchemes.map((loan, index) => (
                        <Card 
                          key={index}
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedLoan?.name === loan.name 
                              ? 'border-green-500 bg-green-100' 
                              : 'border-yellow-200 bg-white hover:border-yellow-300'
                          }`}
                          onClick={() => handleLoanSelect(loan)}
                        >
                          <CardContent className="p-4">
                            <h4 className={`font-semibold mb-3 ${
                              selectedLoan?.name === loan.name ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              {loan.name}
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t('banking.interestRate')}:</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {loan.interestRate}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t('banking.maxAmount')}:</span>
                                <span className="font-semibold">{loan.maxAmount}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{t('banking.tenure')}:</span>
                                <span className="font-semibold">{loan.tenure}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Loan Details */}
                {selectedLoan && (
                  <Card className="border-green-300 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
{selectedLoan.name} - {t('banking.detailedInformation')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">📊 {t('banking.loanDetails')}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">{t('banking.interestRate')}:</span>
                              <Badge className="bg-green-100 text-green-800">{selectedLoan.interestRate}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">{t('banking.maxAmount')}:</span>
                              <span className="font-semibold">{selectedLoan.maxAmount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">{t('banking.tenure')}:</span>
                              <span className="font-semibold">{selectedLoan.tenure}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">✅ {t('banking.eligibilityCriteria')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {selectedLoan.eligibility.map((criteria, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-white">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">📄 {t('banking.requiredDocuments')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {selectedLoan.documents.map((doc, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <FileText className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Special Features */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <Star className="h-5 w-5" />
{t('banking.specialFeatures')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedBank.specialFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Eligibility Criteria */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <Target className="h-5 w-5" />
{t('banking.generalEligibility')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedBank.eligibilityCriteria.map((criteria, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span><strong className="text-yellow-400">{t('common.note')}:</strong> {t('banking.footerNote')}</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-green-400" />
                <span><strong className="text-green-400">{t('banking.governmentBenefits')}</strong></span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
