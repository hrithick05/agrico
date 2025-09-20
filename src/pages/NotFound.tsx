import React, { useState } from 'react';

interface Loan {
  id: number;
  amount: number;
  status: 'approved' | 'pending' | 'repaid';
  purpose: string;
  circle: string;
  dueDate?: string;
  monthlyEMI?: number;
  appliedDate?: string;
  repaidDate?: string;
}

interface Circle {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'full' | 'new';
  members: number;
  maxMembers: number;
  interestRate: number;
  loanRange: string;
  completedLoans: number;
  trustScore: number;
  memberContribution: number;
  adminId: number;
  adminName: string;
  adminPhone: string;
  whatsappGroupLink: string;
  pendingRequests: LoanRequest[];
}

interface LoanRequest {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  purpose: string;
  circleId: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  repaymentDuration: string;
}

interface User {
  id: number;
  name: string;
  joinedCircles: number[];
  isAdmin: boolean;
}

const MicroLending: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'circles' | 'loans' | 'admin'>('home');
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentDuration, setRepaymentDuration] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showJoinNotification, setShowJoinNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'John Farmer',
    joinedCircles: [],
    isAdmin: false
  });
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

  const loans: Loan[] = [
    {
      id: 1,
      amount: 25000,
      status: 'approved',
      purpose: 'Seed purchase for wheat crop',
      circle: 'Wheat Farmers Circle',
      dueDate: 'June 5, 2024',
      monthlyEMI: 8750
    },
    {
      id: 2,
      amount: 15000,
      status: 'pending',
      purpose: 'Fertilizer for cotton field',
      circle: 'Cotton Growers Collective',
      appliedDate: 'March 10, 2024'
    },
    {
      id: 3,
      amount: 10000,
      status: 'repaid',
      purpose: 'Hand tools and equipment',
      circle: 'Vegetable Farmers Support',
      repaidDate: 'February 28, 2024'
    }
  ];

  // Initialize circles with admin and pending requests
  React.useEffect(() => {
    const initialCircles: Circle[] = [
      {
        id: 1,
        name: 'Wheat Farmers Circle',
        description: 'Supporting wheat cultivation with seasonal loans',
        status: 'active',
        members: 12,
        maxMembers: 15,
        interestRate: 8,
        loanRange: '₹5,000 - ₹250,000',
        completedLoans: 45,
        trustScore: 4.8,
        memberContribution: 2000,
        adminId: 101,
         adminName: 'Karthi',
         adminPhone: '+91-9042743120',
        whatsappGroupLink: 'https://chat.whatsapp.com/BuqJjbmiYRSJeXZYnw6QJy',
        pendingRequests: []
      },
      {
        id: 2,
        name: 'Cotton Growers Collective',
        description: 'Equipment and input financing for cotton farmers',
        status: 'active',
        members: 8,
        maxMembers: 10,
        interestRate: 9,
        loanRange: '₹10,000 - ₹275,000',
        completedLoans: 32,
        trustScore: 4.9,
        memberContribution: 3000,
        adminId: 102,
         adminName: 'Karthi',
         adminPhone: '+91-9042743120',
        whatsappGroupLink: 'https://chat.whatsapp.com/BuqJjbmiYRSJeXZYnw6QJy',
        pendingRequests: []
      },
      {
        id: 3,
        name: 'Vegetable Farmers Support',
        description: 'Quick loans for vegetable farming needs',
        status: 'full',
        members: 15,
        maxMembers: 15,
        interestRate: 7.5,
        loanRange: '₹3,000 - ₹225,000',
        completedLoans: 67,
        trustScore: 4.7,
        memberContribution: 1500,
        adminId: 103,
         adminName: 'Karthi',
         adminPhone: '+91-9042743120',
        whatsappGroupLink: 'https://chat.whatsapp.com/BuqJjbmiYRSJeXZYnw6QJy',
        pendingRequests: []
      },
      {
        id: 4,
        name: 'Dairy Farmers Circle',
        description: 'Cattle purchase and dairy equipment loans',
        status: 'new',
        members: 6,
        maxMembers: 12,
        interestRate: 8.5,
        loanRange: '₹15,000 - ₹1,00,000',
        completedLoans: 12,
        trustScore: 4.6,
        memberContribution: 5000,
        adminId: 104,
         adminName: 'Karthi',
         adminPhone: '+91-9042743120',
        whatsappGroupLink: 'https://chat.whatsapp.com/BuqJjbmiYRSJeXZYnw6QJy',
        pendingRequests: []
      }
    ];
    setCircles(initialCircles);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'repaid': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-gray-100 text-gray-800';
      case 'new': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'repaid':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleJoinCircle = (circleId: number) => {
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return;

    if (!currentUser.joinedCircles.includes(circleId)) {
      // Open WhatsApp group link in new tab
      window.open(circle.whatsappGroupLink, '_blank');
      
      // Update user state after joining
      const updatedUser = {
        ...currentUser,
        joinedCircles: [...currentUser.joinedCircles, circleId]
      };
      setCurrentUser(updatedUser);
      
      // Update circle members count
      setCircles(prevCircles => 
        prevCircles.map(circle => 
          circle.id === circleId 
            ? { ...circle, members: circle.members + 1 }
            : circle
        )
      );
      
      setShowJoinNotification(true);
      setTimeout(() => setShowJoinNotification(false), 3000);
    }
  };

  const handleSubmitLoan = () => {
    const selectedCircleData = circles.find(c => c.name === selectedCircle);
    if (!selectedCircleData) return;

    const newRequest: LoanRequest = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      amount: parseInt(loanAmount),
      purpose: purpose,
      circleId: selectedCircleData.id,
      status: 'pending',
      requestDate: new Date().toLocaleDateString(),
      repaymentDuration: repaymentDuration
    };

    // Create WhatsApp message for loan request
    const whatsappMessage = `🌾 *LOAN REQUEST* 🌾

👤 *Applicant:* ${currentUser.name}
💰 *Amount:* ₹${parseInt(loanAmount).toLocaleString()}
📝 *Purpose:* ${purpose}
⏰ *Repayment Duration:* ${repaymentDuration}
📅 *Request Date:* ${new Date().toLocaleDateString()}
🏦 *Circle:* ${selectedCircleData.name}

Please review and respond with:
✅ APPROVE - to approve this loan
❌ REJECT - to reject this loan

Admin: ${selectedCircleData.adminName} (${selectedCircleData.adminPhone})`;

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${selectedCircleData.adminPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Add request to circle's pending requests
    setCircles(prevCircles => 
      prevCircles.map(circle => 
        circle.id === selectedCircleData.id 
          ? { ...circle, pendingRequests: [...circle.pendingRequests, newRequest] }
          : circle
      )
    );

    setLoanRequests(prev => [...prev, newRequest]);
    setShowLoanModal(false);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
    
    // Reset form
    setSelectedCircle('');
    setLoanAmount('');
    setPurpose('');
    setRepaymentDuration('');
  };

  const handleAdminDecision = (requestId: number, decision: 'approved' | 'rejected') => {
    setLoanRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: decision } : req
      )
    );

    setCircles(prevCircles => 
      prevCircles.map(circle => ({
        ...circle,
        pendingRequests: circle.pendingRequests.filter(req => req.id !== requestId)
      }))
    );
  };

  const getMembershipProgress = (members: number, maxMembers: number) => {
    return (members / maxMembers) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

       <div className="relative z-10 p-6">
         {/* Header */}
         <div className="mb-8">
           <h1 className="text-4xl font-bold text-white mb-2">Micro-Lending</h1>
           <p className="text-green-100 text-lg">Community-based lending circles for farmers by farmers</p>
         </div>

         {/* Navigation */}
         <div className="mb-8">
           <nav className="flex space-x-4 bg-white rounded-lg p-2 shadow-lg">
             <button
               onClick={() => setCurrentPage('home')}
               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                 currentPage === 'home' 
                   ? 'bg-green-600 text-white' 
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               🏠 Home
             </button>
             <button
               onClick={() => setCurrentPage('circles')}
               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                 currentPage === 'circles' 
                   ? 'bg-green-600 text-white' 
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               👥 Circles
             </button>
             <button
               onClick={() => setCurrentPage('loans')}
               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                 currentPage === 'loans' 
                   ? 'bg-green-600 text-white' 
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               💰 My Loans
             </button>
             <button
               onClick={() => setCurrentPage('admin')}
               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                 currentPage === 'admin' 
                   ? 'bg-green-600 text-white' 
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               ⚙️ Admin Panel
             </button>
           </nav>
         </div>

        {/* Main Content */}
        {currentPage === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Micro-Lending Platform</h2>
              <p className="text-lg text-gray-600 mb-6">Connect with farming communities and access affordable loans</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Circles</h3>
                  <p className="text-gray-600">Connect with farmers in your community</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Request Loans</h3>
                  <p className="text-gray-600">Get quick access to affordable financing</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Build Trust</h3>
                  <p className="text-gray-600">Grow your community through responsible lending</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                <div className="text-gray-600">Active Circles</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">41</div>
                <div className="text-gray-600">Total Members</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">156</div>
                <div className="text-gray-600">Loans Completed</div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">₹2.5M</div>
                <div className="text-gray-600">Total Lending</div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'circles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Circles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {circles.map((circle) => (
                  <div key={circle.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{circle.name}</h3>
                        <p className="text-sm text-gray-600">{circle.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(circle.status)}`}>
                        {circle.status.charAt(0).toUpperCase() + circle.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Members</span>
                        <span>{circle.members}/{circle.maxMembers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getMembershipProgress(circle.members, circle.maxMembers)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <div className="font-semibold text-lg">{circle.interestRate}% p.a.</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Loan Range:</span>
                        <div className="font-semibold">{circle.loanRange}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <div className="font-semibold">{circle.completedLoans} loans</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Trust Score:</span>
                        <div className="font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {circle.trustScore}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Member Contribution:</span>
                      <div className="font-semibold text-lg">₹{circle.memberContribution.toLocaleString()}</div>
                    </div>

                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Admin:</div>
                      <div className="font-semibold">{circle.adminName}</div>
                      <div className="text-sm text-gray-500">{circle.adminPhone}</div>
                    </div>

                    {circle.status === 'full' ? (
                      <button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                      >
                        Circle Full
                      </button>
                    ) : currentUser.joinedCircles.includes(circle.id) ? (
                      <button 
                        disabled
                        className="w-full bg-green-200 text-green-800 py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                      >
                        <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Joined WhatsApp Group
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoinCircle(circle.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        Join WhatsApp Group
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'loans' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Loans</h2>
                {currentUser.joinedCircles.length > 0 && (
                  <button
                    onClick={() => setShowLoanModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request Loan
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(loan.status)}
                        <div>
                          <div className="text-2xl font-semibold text-gray-800">₹{loan.amount.toLocaleString()}</div>
                          <div className="text-lg text-gray-600">{loan.purpose}</div>
                          <div className="text-sm text-gray-500">Circle: {loan.circle}</div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </div>
                    
                    {loan.status === 'approved' && loan.dueDate && loan.monthlyEMI && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4 flex justify-between">
                        <span className="text-sm text-gray-600">Due Date: {loan.dueDate}</span>
                        <span className="text-sm text-gray-600">Monthly EMI: ₹{loan.monthlyEMI.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {loan.status === 'pending' && loan.appliedDate && (
                      <div className="mt-4 text-sm text-gray-600">
                        Applied on {loan.appliedDate}
                      </div>
                    )}
                    
                    {loan.status === 'repaid' && loan.repaidDate && (
                      <div className="mt-4 text-sm text-gray-600">
                        Repaid on {loan.repaidDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel - Pending Loan Requests</h2>
              <div className="space-y-4">
                {loanRequests.filter(req => req.status === 'pending').map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-2xl font-semibold text-gray-800">₹{request.amount.toLocaleString()}</div>
                        <div className="text-lg text-gray-600">From: {request.userName}</div>
                        <div className="text-sm text-gray-600">Circle: {circles.find(c => c.id === request.circleId)?.name}</div>
                        <div className="text-sm text-gray-600">Purpose: {request.purpose}</div>
                        <div className="text-sm text-gray-600">Duration: {request.repaymentDuration}</div>
                        <div className="text-sm text-gray-500">Requested: {request.requestDate}</div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAdminDecision(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm transition-colors font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAdminDecision(request.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm transition-colors font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {loanRequests.filter(req => req.status === 'pending').length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <div className="text-xl">No pending loan requests</div>
                    <div className="text-sm">Check back later for new requests</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* How Micro-Lending Works Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How Micro-Lending Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Join Circle</h3>
                <p className="text-sm text-gray-600">Join a lending circle with farmers from your community</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Contribute</h3>
                <p className="text-sm text-gray-600">Make a one-time contribution to the circle's lending pool</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Request Loan</h3>
                <p className="text-sm text-gray-600">Apply for loans when needed, with circle member approval</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Repay & Grow</h3>
                <p className="text-sm text-gray-600">Repay on time to build trust and grow the community fund</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Request a Loan</h2>
              <button
                onClick={() => setShowLoanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitLoan(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Circle</label>
                <select
                  value={selectedCircle}
                  onChange={(e) => setSelectedCircle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Choose a lending circle</option>
                  {circles.filter(c => c.status !== 'full' && currentUser.joinedCircles.includes(c.id)).map(circle => (
                    <option key={circle.id} value={circle.name}>{circle.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount needed"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe how you plan to use the loan"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Duration</label>
                <select
                  value={repaymentDuration}
                  onChange={(e) => setRepaymentDuration(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="18 months">18 months</option>
                  <option value="24 months">24 months</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-800">WhatsApp Message Sent!</div>
              <div className="text-sm text-gray-600">Your loan request has been sent to the admin via WhatsApp</div>
            </div>
          </div>
        </div>
      )}

      {/* Join Notification */}
      {showJoinNotification && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-800">WhatsApp Group Opened!</div>
              <div className="text-sm text-gray-600">Join the group to access loan requests</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroLending;
