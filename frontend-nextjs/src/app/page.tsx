'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  LogOut, 
  Plus, 
  FileText, 
  Database, 
  Key, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  Send,
  Upload
} from 'lucide-react';
import CryptoJS from 'crypto-js';

// Types
interface Evidence {
  id: string;
  hash: string;
  originalFilename: string;
  caseId: string;
  description: string;
  location: string;
  timestamp: string;
  uploadedBy: string;
  blockchainStatus: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  fileSize: number;
  fileType: string;
  encryptionKey?: string;
  ipfsCid?: string;
  metadataCid?: string;
  ownerWallet?: string;
}

interface AccessRequest {
  id: string;
  evidenceId?: string;
  caseId?: string;
  requestedBy: string;
  reason: string;
  justification?: string;
  requestType: 'analysis' | 'testing' | 'report';
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
  approvedBy?: string;
  approvalTimestamp?: string;
}

interface User {
  id: string;
  address?: string;
  role: 'investigator' | 'analyst' | 'prosecutor' | 'judge' | 'admin';
  name: string;
  email: string;
  username: string;
  authenticated: boolean;
  permissions: string[];
  isVerified: boolean;
  walletAddress?: string;
}

interface AppState {
  user: User | null;
  evidence: Evidence[];
  accessRequests: AccessRequest[];
  currentView: string;
  mockMode: boolean;
}

// Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4001';

// API Functions
const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let message = res.statusText;
    try { const err = await res.json(); message = err.error || message; } catch {}
    throw new Error(message);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const api = {
  evidence: {
    submit: async (e: Omit<Evidence, 'id' | 'blockchainStatus' | 'txHash'>): Promise<Evidence> => {
      return await fetchJson(`${API_BASE}/api/evidence`, {
        method: 'POST',
        body: JSON.stringify(e)
      });
    },
    list: async (): Promise<Evidence[]> => {
      return await fetchJson(`${API_BASE}/api/evidence`);
    }
  },
  access: {
    request: async (r: Omit<AccessRequest, 'id' | 'status' | 'timestamp'>): Promise<AccessRequest> => {
      return await fetchJson(`${API_BASE}/api/access-requests`, {
        method: 'POST',
        body: JSON.stringify(r)
      });
    },
    list: async (): Promise<AccessRequest[]> => {
      return await fetchJson(`${API_BASE}/api/access-requests`);
    },
    approve: async (requestId: string, approvedBy: string): Promise<void> => {
      await fetchJson(`${API_BASE}/api/access-requests/${requestId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approvedBy })
      });
    },
    deny: async (requestId: string, approvedBy: string): Promise<void> => {
      await fetchJson(`${API_BASE}/api/access-requests/${requestId}/deny`, {
        method: 'POST',
        body: JSON.stringify({ approvedBy })
      });
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(59,130,246,0.1),rgba(255,255,255,0))]"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m40 40c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0-40c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <BlockchainEvidenceApp />
    </div>
  );
}

function BlockchainEvidenceApp() {
  const [state, setState] = useState<AppState>({
    user: null,
    evidence: [],
    accessRequests: [],
    currentView: 'login',
    mockMode: false
  });

  // Load data when user logs in
  const refreshEvidence = async () => {
    try {
      const evidence = await api.evidence.list();
      setState(prev => ({ ...prev, evidence }));
    } catch (error) {
      console.error('Failed to load evidence:', error);
    }
  };

  const refreshAccessRequests = async () => {
    try {
      const accessRequests = await api.access.list();
      setState(prev => ({ ...prev, accessRequests }));
    } catch (error) {
      console.error('Failed to load access requests:', error);
    }
  };

  useEffect(() => {
    if (state.user) {
      refreshEvidence();
      refreshAccessRequests();
    }
  }, [state.user]);

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, user, currentView: 'dashboard' }));
  };

  const handleLogout = () => {
    setState({
      user: null,
      evidence: [],
      accessRequests: [],
      currentView: 'login',
      mockMode: false
    });
  };

  const setView = (view: string) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  if (!state.user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),rgba(255,255,255,0))]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-50"></div>
      
      <Header user={state.user} onLogout={handleLogout} onViewChange={setView} />
      <main className="pt-16 relative z-10">
        {state.currentView === 'dashboard' && (
          <DashboardView 
            user={state.user} 
            evidence={state.evidence} 
            accessRequests={state.accessRequests}
            onViewChange={setView}
            refreshEvidence={refreshEvidence}
            refreshAccessRequests={refreshAccessRequests}
          />
        )}
        {state.currentView === 'add-evidence' && (
          <AddEvidenceView 
            user={state.user} 
            onSuccess={() => {
              refreshEvidence();
              setView('dashboard');
            }}
          />
        )}
        {state.currentView === 'access-requests' && (
          <AccessRequestsView 
            user={state.user}
            evidence={state.evidence}
            accessRequests={state.accessRequests}
            refreshAccessRequests={refreshAccessRequests}
          />
        )}
        {state.currentView === 'browse-evidence' && (
          <BrowseEvidenceView 
            user={state.user}
            evidence={state.evidence}
            onViewChange={setView}
          />
        )}
        {state.currentView === 'request-access' && (
          <RequestAccessView 
            user={state.user}
            evidence={state.evidence}
            onSuccess={() => {
              refreshAccessRequests();
              setView('access-requests');
            }}
          />
        )}
      </main>
    </div>
  );
}

// Components
function Header({ user, onLogout, onViewChange }: { user: User; onLogout: () => void; onViewChange: (view: string) => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Enhanced Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Evidence Chain
              </h1>
              <div className="flex items-center mt-0.5">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-1"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mx-1"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onViewChange('dashboard')}
              className="relative text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {(user.role === 'investigator' || user.role === 'admin') && (
              <button
                onClick={() => onViewChange('add-evidence')}
                className="relative text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
              >
                <span className="relative z-10">Add Evidence</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-blue-500/0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
            
            <button
              onClick={() => onViewChange('access-requests')}
              className="relative text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              <span className="relative z-10">Access Requests</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-cyan-500/0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* Enhanced User Profile Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 rounded-full text-white capitalize font-medium">
                      {user.role}
                    </span>
                    <div className="w-1 h-1 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="relative text-blue-200 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-red-500/20 backdrop-blur-sm border border-transparent hover:border-red-500/30 group"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function DashboardView({ 
  user, 
  evidence, 
  accessRequests, 
  onViewChange,
  refreshEvidence,
  refreshAccessRequests 
}: { 
  user: User; 
  evidence: Evidence[]; 
  accessRequests: AccessRequest[];
  onViewChange: (view: string) => void;
  refreshEvidence: () => Promise<void>;
  refreshAccessRequests: () => Promise<void>;
}) {
  const createTestData = async () => {
    try {
      console.log('Creating test data...');
      
      const randomContent = 'test-evidence-content-' + Date.now() + Math.random();
      const hash = CryptoJS.SHA256(randomContent).toString();
      console.log('Generated hash:', hash);

      const evidenceData = {
        originalFilename: 'test-evidence-sample.pdf',
        caseId: 'CASE-2024-TEST',
        description: 'Sample evidence for testing access requests',
        mimeType: 'application/pdf',
        uploadedBy: user.id,
        fileSize: 2048,
        hash: hash,
        ipfsCid: 'QmTestCID' + Date.now(),
        blockchainStatus: 'pending' as const,
        tags: ['test', 'sample'],
        location: 'Test Location',
        timestamp: new Date().toISOString(),
        fileType: 'application/pdf'
      };

      console.log('Creating evidence with data:', evidenceData);
      
      const newEvidence = await fetchJson(`${API_BASE}/api/evidence`, {
        method: 'POST',
        body: JSON.stringify(evidenceData)
      });

      console.log('Evidence created:', newEvidence);

      const requestData = {
        evidenceId: newEvidence.id,
        requestedBy: 'analyst-test-user',
        caseId: 'CASE-2024-TEST',
        reason: 'Trial preparation',
        justification: 'This is a test access request to demonstrate the approval workflow for investigators.',
        requestType: 'analysis' as const
      };

      console.log('Creating access request with data:', requestData);
      
      const accessRequest = await fetchJson(`${API_BASE}/api/access-requests`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });

      console.log('Access request created:', accessRequest);

      await refreshEvidence();
      await refreshAccessRequests();
      
      alert('✅ Test data created successfully! Check "Access Requests" to see the sample request.');
      
    } catch (error) {
      console.error('Failed to create test data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to create test data: ${errorMessage}. Check browser console for details.`);
    }
  };

  const getStats = () => {
    switch (user.role) {
      case 'investigator': {
        const myEvidence = evidence.filter(e => e.uploadedBy === user.id);
        const myEvidenceIds = myEvidence.map(e => e.id);
        const requestsForMyEvidence = accessRequests.filter(r => r.evidenceId && myEvidenceIds.includes(r.evidenceId));
        const pendingRequestsForMyEvidence = requestsForMyEvidence.filter(r => r.status === 'pending');
        
        return [
          { label: 'My Evidence', value: myEvidence.length, icon: FileText, color: '#3b82f6' },
          { label: 'Access Requests', value: pendingRequestsForMyEvidence.length, icon: Key, color: '#f59e0b' },
          { label: 'Blockchain Confirmed', value: myEvidence.filter(e => e.blockchainStatus === 'confirmed').length, icon: CheckCircle, color: '#10b981' },
        ];
      }
      case 'analyst': {
        const myRequests = accessRequests.filter(r => r.requestedBy === user.id);
        const availableEvidence = evidence.length;
        
        return [
          { label: 'Available Evidence', value: availableEvidence, icon: Database, color: '#3b82f6' },
          { label: 'My Requests', value: myRequests.length, icon: Send, color: '#f59e0b' },
          { label: 'Approved Access', value: myRequests.filter(r => r.status === 'approved').length, icon: CheckCircle, color: '#10b981' },
        ];
      }
      case 'prosecutor': {
        const pendingRequests = accessRequests.filter(r => r.status === 'pending');
        const approvedRequests = accessRequests.filter(r => r.status === 'approved');
        
        return [
          { label: 'Total Evidence', value: evidence.length, icon: Database, color: '#3b82f6' },
          { label: 'Pending Requests', value: pendingRequests.length, icon: Clock, color: '#f59e0b' },
          { label: 'Approved Requests', value: approvedRequests.length, icon: CheckCircle, color: '#10b981' },
        ];
      }
      case 'judge': {
        const pendingRequests = accessRequests.filter(r => r.status === 'pending');
        const totalRequests = accessRequests.length;
        
        return [
          { label: 'Total Evidence', value: evidence.length, icon: Database, color: '#3b82f6' },
          { label: 'Pending Review', value: pendingRequests.length, icon: Clock, color: '#f59e0b' },
          { label: 'Total Requests', value: totalRequests, icon: FileText, color: '#10b981' },
        ];
      }
      case 'admin': {
        const pendingRequests = accessRequests.filter(r => r.status === 'pending');
        const confirmedEvidence = evidence.filter(e => e.blockchainStatus === 'confirmed');
        
        return [
          { label: 'System Evidence', value: evidence.length, icon: Database, color: '#3b82f6' },
          { label: 'Pending Requests', value: pendingRequests.length, icon: Key, color: '#f59e0b' },
          { label: 'Blockchain Confirmed', value: confirmedEvidence.length, icon: CheckCircle, color: '#10b981' },
        ];
      }
      default:
        return [
          { label: 'Total Evidence', value: evidence.length, icon: Database, color: '#3b82f6' },
          { label: 'Access Requests', value: accessRequests.length, icon: Key, color: '#f59e0b' },
          { label: 'Blockchain Confirmed', value: evidence.filter(e => e.blockchainStatus === 'confirmed').length, icon: CheckCircle, color: '#10b981' },
        ];
    }
  };

  const getQuickActions = () => {
    switch (user.role) {
      case 'investigator':
        return [
          { label: 'Add Evidence', action: () => onViewChange('add-evidence'), icon: Plus, color: '#3b82f6' },
          { label: 'Pending Requests', action: () => onViewChange('access-requests'), icon: Clock, color: '#f59e0b' },
          { label: 'Create Test Data', action: createTestData, icon: Plus, color: '#f59e0b' },
        ];
      case 'analyst':
        return [
          { label: 'Browse Evidence', action: () => onViewChange('browse-evidence'), icon: Search, color: '#3b82f6' },
          { label: 'Request Access', action: () => onViewChange('request-access'), icon: Key, color: '#10b981' },
          { label: 'My Requests', action: () => onViewChange('access-requests'), icon: FileText, color: '#f59e0b' },
        ];
      case 'prosecutor':
        return [
          { label: 'Browse Evidence', action: () => onViewChange('browse-evidence'), icon: Search, color: '#3b82f6' },
          { label: 'Review Requests', action: () => onViewChange('access-requests'), icon: Key, color: '#f59e0b' },
          { label: 'Create Test Data', action: createTestData, icon: Plus, color: '#10b981' },
        ];
      case 'judge':
        return [
          { label: 'View Evidence', action: () => onViewChange('browse-evidence'), icon: Eye, color: '#3b82f6' },
          { label: 'Review Requests', action: () => onViewChange('access-requests'), icon: CheckCircle, color: '#f59e0b' },
          { label: 'Judicial Review', action: () => onViewChange('browse-evidence'), icon: Search, color: '#10b981' },
        ];
      case 'admin':
        return [
          { label: 'System Evidence', action: () => onViewChange('browse-evidence'), icon: Database, color: '#3b82f6' },
          { label: 'Manage Requests', action: () => onViewChange('access-requests'), icon: Key, color: '#f59e0b' },
          { label: 'Create Test Data', action: createTestData, icon: Plus, color: '#10b981' },
        ];
      default:
        return [
          { label: 'View Evidence', action: () => onViewChange('browse-evidence'), icon: Eye, color: '#3b82f6' },
          { label: 'Access Requests', action: () => onViewChange('access-requests'), icon: Key, color: '#f59e0b' },
        ];
    }
  };

  const stats = getStats();
  const quickActions = getQuickActions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Welcome Section */}
      <div className="mb-8 relative">
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-3">
              Welcome back, {user.name}
            </h1>
            <p className="text-blue-200/80 text-lg">
              {user.role === 'investigator' && 'Manage evidence and handle access requests.'}
              {user.role === 'analyst' && 'Access evidence for analysis and research.'}
              {user.role === 'prosecutor' && 'Review evidence and approve access requests for prosecution cases.'}
              {user.role === 'judge' && 'Verify evidence authenticity and review access requests for judicial proceedings.'}
              {user.role === 'admin' && 'Manage users, evidence, and system-wide access requests.'}
            </p>
            {/* Status Indicator */}
            <div className="flex items-center mt-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-300 text-sm">Blockchain Network Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Card Glow Effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ backgroundColor: stat.color + '20' }}
            ></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-200/70 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-xl blur-lg opacity-30 animate-pulse"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <div 
                    className="relative p-3 rounded-xl border border-white/20"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <stat.icon 
                      className="h-6 w-6" 
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <div className="flex items-center ml-4">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-1"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Button Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{ backgroundColor: action.color + '20' }}
                ></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative z-10 flex items-center">
                  <div className="relative mr-4">
                    <div 
                      className="absolute inset-0 rounded-lg blur-sm opacity-50"
                      style={{ backgroundColor: action.color }}
                    ></div>
                    <div 
                      className="relative p-2 rounded-lg border border-white/20"
                      style={{ backgroundColor: action.color + '20' }}
                    >
                      <action.icon 
                        className="h-5 w-5" 
                        style={{ color: action.color }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium text-left block">{action.label}</span>
                    <div className="w-2 h-2 bg-white/40 rounded-full mt-1 animate-pulse"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { username: 'admin', role: 'admin', displayName: 'System Admin', color: 'bg-purple-600 hover:bg-purple-700' },
    { username: 'investigator1', role: 'investigator', displayName: 'Investigator', color: 'bg-blue-600 hover:bg-blue-700' },
    { username: 'analyst1', role: 'analyst', displayName: 'Evidence Analyst', color: 'bg-green-600 hover:bg-green-700' },
    { username: 'prosecutor1', role: 'prosecutor', displayName: 'Prosecutor', color: 'bg-orange-600 hover:bg-orange-700' },
    { username: 'judge1', role: 'judge', displayName: 'Judge', color: 'bg-red-600 hover:bg-red-700' }
  ];

  const handleDemoLogin = (username: string) => {
    setCredentials({ username, password: 'demo123' });
    // Auto-login after a brief moment to show the credentials
    setTimeout(() => {
      handleLogin(null, username, 'demo123');
    }, 500);
  };

  const handleLogin = async (e: React.FormEvent | null, directUsername?: string, directPassword?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const username = directUsername || credentials.username;
      const password = directPassword || credentials.password;

      // Basic validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      const role = username.includes('admin') ? 'admin' :
                   username.includes('judge') ? 'judge' :
                   username.includes('prosecutor') ? 'prosecutor' :
                   username.includes('analyst') ? 'analyst' :
                   'investigator';

      const user: User = {
        id: username + '-001',
        role,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@system.gov`,
        username: username,
        authenticated: true,
        permissions: [],
        isVerified: true
      };

      onLogin(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-indigo-400 rounded-full"></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
          
          <div className="relative z-10">
            {/* Header with Enhanced Styling */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                {/* Shield Icon with Glow */}
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                Evidence Chain
              </h1>
              <p className="text-blue-200/80 text-lg font-light">
                Secure Blockchain Evidence Management
              </p>
              
              {/* Blockchain Visual Element */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your username"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 pointer-events-none"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-cyan-500/0 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                      Connect to Evidence Chain
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Enhanced Demo Accounts Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-transparent via-gray-800/50 to-transparent text-blue-200 backdrop-blur-sm">
                    Web3 Demo Accounts
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {demoAccounts.map((account, index) => (
                  <button
                    key={account.username}
                    onClick={() => handleDemoLogin(account.username)}
                    disabled={isLoading}
                    className={`group relative overflow-hidden ${account.color.replace('bg-', 'from-').replace('hover:bg-', 'to-')} bg-gradient-to-r disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border border-white/10 backdrop-blur-sm`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                      <User className="h-4 w-4 mr-2" />
                      Connect as {account.displayName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Blockchain Info */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 text-blue-300/60 text-sm">
                <span>Secured by Blockchain</span>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Decentralized Evidence</span>
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Immutable Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddEvidenceView({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    caseId: '',
    description: '',
    tags: '',
    location: 'Evidence Locker'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Function to calculate SHA-256 hash of file
  const calculateFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    return CryptoJS.SHA256(wordArray).toString();
  };

  // Function to upload file to Pinata (mock implementation)
  const uploadToPinata = async (file: File): Promise<string> => {
    // This is a mock implementation - in a real app, you'd upload to Pinata
    setUploadProgress('Uploading to IPFS...');
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock IPFS CID
    const mockCid = `Qm${CryptoJS.SHA256(file.name + Date.now()).toString().substring(0, 44)}`;
    setUploadProgress('Upload complete');
    
    return mockCid;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadProgress('Calculating hash...');
    
    try {
      const hash = await calculateFileHash(file);
      setFileHash(hash);
      setUploadProgress('');
    } catch (error) {
      console.error('Error calculating hash:', error);
      setUploadProgress('Error calculating hash');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!fileHash) {
      alert('File hash is being calculated, please wait');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload to Pinata first
      const ipfsCid = await uploadToPinata(selectedFile);
      
      setUploadProgress('Submitting to blockchain...');
      
      // Submit evidence with file metadata
      const evidenceData = {
        caseId: formData.caseId,
        description: formData.description,
        originalFilename: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        hash: fileHash,
        uploadedBy: user.id,
        timestamp: new Date().toISOString(),
        location: formData.location,
        fileType: selectedFile.type,
        ipfsCid: ipfsCid,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      await api.evidence.submit(evidenceData);
      
      setUploadProgress('Evidence submitted successfully!');
      setTimeout(() => {
        onSuccess();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to submit evidence:', error);
      alert('Failed to submit evidence: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-2">
              Add New Evidence
            </h1>
            <div className="flex items-center justify-center">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-2"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 mx-2"></div>
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Evidence File
              </label>
              <div className="relative">
                <div className="border-2 border-dashed border-white/20 hover:border-blue-400/50 rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-sm bg-white/5">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center group"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                        </p>
                        {fileHash && (
                          <p className="text-green-400 text-xs mt-2">
                            SHA-256: {fileHash.substring(0, 16)}...
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-white font-medium">Click to upload file</p>
                        <p className="text-gray-400 text-sm">
                          PDF, DOC, Images, Videos up to 100MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {uploadProgress && (
                  <p className="text-blue-400 text-sm mt-2">{uploadProgress}</p>
                )}
              </div>
            </div>

          {/* Case Information */}
          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Case ID *
            </label>
            <input
              type="text"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
              placeholder="e.g., CASE-2024-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 resize-none"
              rows={4}
              placeholder="Detailed description of the evidence..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
                placeholder="Evidence storage location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
                placeholder="e.g., weapon, fingerprint, DNA"
              />
              <p className="text-gray-400 text-xs mt-1">Separate multiple tags with commas</p>
            </div>
          </div>

          {/* File Information Display (Read-only) */}
          {selectedFile && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                File Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Filename:</span>
                  <p className="text-white">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <p className="text-white">{selectedFile.size.toLocaleString()} bytes</p>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <p className="text-white">{selectedFile.type || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Hash:</span>
                  <p className="text-white font-mono text-xs">
                    {fileHash ? `${fileHash.substring(0, 16)}...` : 'Calculating...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !selectedFile || !fileHash}
            className="relative w-full group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center group-hover:scale-[1.02] transform">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {uploadProgress || 'Submitting Evidence...'}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-3" />
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Submit Evidence
                  </span>
                </>
              )}
            </div>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

function AccessRequestsView({ 
  user, 
  evidence, 
  accessRequests, 
  refreshAccessRequests 
}: {
  user: User;
  evidence: Evidence[];
  accessRequests: AccessRequest[];
  refreshAccessRequests: () => Promise<void>;
}) {
  const handleApprove = async (requestId: string) => {
    try {
      await api.access.approve(requestId, user.id);
      await refreshAccessRequests();
      alert('Access request approved successfully!');
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Failed to approve request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      await api.access.deny(requestId, user.id);
      await refreshAccessRequests();
      alert('Access request denied successfully!');
    } catch (error) {
      console.error('Failed to deny request:', error);
      alert('Failed to deny request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredRequests = (() => {
    switch (user.role) {
      case 'investigator':
        // Investigators see requests for evidence they uploaded
        return accessRequests.filter(request => {
          if (!request.evidenceId) return false;
          const evidence_item = evidence.find(e => e.id === request.evidenceId);
          return evidence_item && evidence_item.uploadedBy === user.id;
        });
      
      case 'analyst':
        // Analysts see only their own requests
        return accessRequests.filter(request => request.requestedBy === user.id);
      
      case 'prosecutor':
      case 'judge':
      case 'admin':
        // Prosecutors, judges, and admins can see all access requests
        return accessRequests;
      
      default:
        return accessRequests.filter(request => request.requestedBy === user.id);
    }
  })();

  const canApproveRequests = ['investigator', 'prosecutor', 'judge', 'admin'].includes(user.role);

  const getViewDescription = () => {
    switch (user.role) {
      case 'investigator':
        return 'Manage access requests for your evidence';
      case 'prosecutor':
        return 'Review and approve access requests for prosecution cases';
      case 'judge':
        return 'Review and approve access requests for judicial review';
      case 'admin':
        return 'Manage all access requests in the system';
      default:
        return 'Your evidence access requests';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Access Requests</h1>
        <p className="text-gray-400">
          {getViewDescription()}
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Access Requests</h3>
            <p className="text-gray-400">
              {user.role === 'analyst' 
                ? 'You have not submitted any access requests.' 
                : canApproveRequests 
                  ? 'No pending access requests to review.'
                  : 'No access requests found.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredRequests.map((request) => {
              const evidenceItem = request.evidenceId ? evidence.find(e => e.id === request.evidenceId) : null;
              
              return (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-white">
                          {evidenceItem ? evidenceItem.originalFilename : `Case ${request.caseId}`}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                          request.status === 'approved' ? 'bg-green-900 text-green-200' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-2">{request.reason}</p>
                      {request.justification && (
                        <p className="text-gray-400 text-sm mb-2">{request.justification}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Requested by: {request.requestedBy}</span>
                        <span>Type: {request.requestType}</span>
                        <span>Date: {new Date(request.timestamp).toLocaleDateString()}</span>
                        {(user.role === 'prosecutor' || user.role === 'judge' || user.role === 'admin') && evidenceItem && (
                          <span>Owner: {evidenceItem.uploadedBy}</span>
                        )}
                      </div>
                    </div>
                    
                    {canApproveRequests && request.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeny(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BrowseEvidenceView({ user, evidence, onViewChange }: { user: User; evidence: Evidence[]; onViewChange: (view: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState('');

  // Get unique case IDs for filtering
  const uniqueCases = [...new Set(evidence.map(e => e.caseId))].filter(Boolean);

  // Filter evidence based on search and case selection
  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCase = selectedCase === '' || item.caseId === selectedCase;
    
    return matchesSearch && matchesCase;
  });

  const handleRequestAccess = (evidenceId: string) => {
    // Navigate to request access form with pre-selected evidence
    // TODO: Pass evidenceId to pre-select the evidence in the form: evidenceId
    console.log('Request access for evidence:', evidenceId);
    onViewChange('request-access');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Evidence</h1>
        <p className="text-gray-400">
          {user.role === 'analyst' ? 'Find evidence to request access for analysis' : 'Browse available evidence in the system'}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Evidence
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by filename, description, or case ID..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Case
            </label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cases</option>
              {uniqueCases.map(caseId => (
                <option key={caseId} value={caseId}>{caseId}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {filteredEvidence.length === 0 ? (
          <div className="p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Evidence Found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCase ? 'Try adjusting your search criteria.' : 'No evidence has been uploaded yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredEvidence.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-medium text-white">{item.originalFilename}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.blockchainStatus === 'confirmed' ? 'bg-green-900 text-green-200' :
                        item.blockchainStatus === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-gray-900 text-gray-200'
                      }`}>
                        {item.blockchainStatus}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-2">{item.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                      <div>
                        <span className="font-medium">Case ID:</span>
                        <p className="text-white">{item.caseId}</p>
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>
                        <p className="text-white">{(item.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <p className="text-white">{item.fileType}</p>
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span>
                        <p className="text-white">{new Date(item.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {item.hash && (
                      <div className="mt-2">
                        <span className="text-gray-400 text-sm font-medium">Hash:</span>
                        <p className="text-white font-mono text-xs">{item.hash.substring(0, 32)}...</p>
                      </div>
                    )}
                  </div>
                  
                  {user.role === 'analyst' && (
                    <button
                      onClick={() => handleRequestAccess(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center ml-4"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Request Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestAccessView({ user, evidence, onSuccess }: { user: User; evidence: Evidence[]; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    evidenceId: '',
    caseId: '',
    reason: '',
    justification: '',
    requestType: 'analysis' as 'analysis' | 'testing' | 'report'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Handle evidence selection
  const handleEvidenceSelect = (evidenceId: string) => {
    const evidence_item = evidence.find(e => e.id === evidenceId);
    setSelectedEvidence(evidence_item || null);
    setFormData(prev => ({
      ...prev,
      evidenceId,
      caseId: evidence_item?.caseId || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        evidenceId: formData.evidenceId,
        requestedBy: user.id,
        caseId: formData.caseId,
        reason: formData.reason,
        justification: formData.justification,
        requestType: formData.requestType
      };

      await api.access.request(requestData);
      
      alert('✅ Access request submitted successfully!');
      onSuccess();
      
    } catch (error) {
      console.error('Failed to submit access request:', error);
      alert('❌ Failed to submit access request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Request Evidence Access</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Evidence Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Evidence *
            </label>
            <select
              value={formData.evidenceId}
              onChange={(e) => handleEvidenceSelect(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose evidence to request access to...</option>
              {evidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.originalFilename} - {item.caseId}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Evidence Preview */}
          {selectedEvidence && (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">Selected Evidence</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Filename:</span>
                  <p className="text-white">{selectedEvidence.originalFilename}</p>
                </div>
                <div>
                  <span className="text-gray-400">Case ID:</span>
                  <p className="text-white">{selectedEvidence.caseId}</p>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <p className="text-white">{(selectedEvidence.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <p className="text-white">{selectedEvidence.fileType}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-400 text-sm">Description:</span>
                <p className="text-white">{selectedEvidence.description}</p>
              </div>
            </div>
          )}

          {/* Request Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Case ID *
            </label>
            <input
              type="text"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Case ID associated with this request"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Request Type *
            </label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value as 'analysis' | 'testing' | 'report' })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="analysis">Evidence Analysis</option>
              <option value="testing">Forensic Testing</option>
              <option value="report">Case Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for Access *
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Trial preparation, Investigation analysis"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detailed Justification *
            </label>
            <textarea
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Provide detailed justification for why access to this evidence is needed..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.evidenceId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Access Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
