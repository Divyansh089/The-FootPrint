'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Upload, 
  Search, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Eye,
  Gavel,
  LogOut,
  Hash,
  ExternalLink,
  Key,
  Database,
  Plus,
  FileCheck,
  Send,
  AlertCircle,
  UserPlus,
  Users,
  Info,
  Link
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
    <div className="min-h-screen bg-gray-900">
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Header user={state.user} onLogout={handleLogout} onViewChange={setView} />
      <main className="pt-16">
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
      </main>
    </div>
  );
}

// Components
function Header({ user, onLogout, onViewChange }: { user: User; onLogout: () => void; onViewChange: (view: string) => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-xl font-bold text-white">Evidence Chain</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onViewChange('dashboard')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </button>
            {(user.role === 'investigator' || user.role === 'admin') && (
              <button
                onClick={() => onViewChange('add-evidence')}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Add Evidence
              </button>
            )}
            <button
              onClick={() => onViewChange('access-requests')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Access Requests
            </button>
            
            <div className="flex items-center space-x-4 ml-6 border-l border-gray-700 pl-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300">{user.name}</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white capitalize">
                  {user.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-white p-2 rounded-md"
              >
                <LogOut className="h-5 w-5" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-400">
          {user.role === 'investigator' && 'Manage evidence and handle access requests.'}
          {user.role === 'analyst' && 'Access evidence for analysis and research.'}
          {user.role === 'prosecutor' && 'Review evidence for prosecution.'}
          {user.role === 'judge' && 'Verify evidence authenticity and integrity.'}
          {user.role === 'admin' && 'Manage users and system administration.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: stat.color + '20' }}
              >
                <stat.icon 
                  className="h-6 w-6" 
                  style={{ color: stat.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div 
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: action.color + '20' }}
              >
                <action.icon 
                  className="h-5 w-5" 
                  style={{ color: action.color }}
                />
              </div>
              <span className="text-white font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const role = credentials.username.includes('admin') ? 'admin' :
                   credentials.username.includes('judge') ? 'judge' :
                   credentials.username.includes('prosecutor') ? 'prosecutor' :
                   credentials.username.includes('analyst') ? 'analyst' :
                   'investigator';

      const user: User = {
        id: credentials.username + '-001',
        role,
        name: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1),
        email: `${credentials.username}@system.gov`,
        username: credentials.username,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-white">Evidence Chain</h1>
          <p className="text-gray-400 mt-2">Secure Blockchain Evidence Management</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Demo Accounts: admin, judge1, prosecutor1, analyst1, investigator1
          </p>
        </div>
      </div>
    </div>
  );
}

function AddEvidenceView({ user, onSuccess }: { user: User; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    caseId: '',
    description: '',
    originalFilename: '',
    fileSize: 0,
    mimeType: '',
    hash: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.evidence.submit({
        ...formData,
        uploadedBy: user.id,
        timestamp: new Date().toISOString(),
        location: 'Evidence Locker',
        fileType: formData.mimeType,
        ipfsCid: 'QmMock' + Date.now()
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to submit evidence:', error);
      alert('Failed to submit evidence: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Evidence</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Case ID
            </label>
            <input
              type="text"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={formData.originalFilename}
              onChange={(e) => setFormData({ ...formData, originalFilename: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hash (SHA-256)
            </label>
            <input
              type="text"
              value={formData.hash}
              onChange={(e) => setFormData({ ...formData, hash: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="64-character SHA-256 hash"
              pattern="[a-fA-F0-9]{64}"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Size (bytes)
              </label>
              <input
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                MIME Type
              </label>
              <input
                type="text"
                value={formData.mimeType}
                onChange={(e) => setFormData({ ...formData, mimeType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., application/pdf"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Evidence...
              </>
            ) : (
              'Submit Evidence'
            )}
          </button>
        </form>
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

  const filteredRequests = user.role === 'investigator' 
    ? accessRequests.filter(request => {
        if (!request.evidenceId) return false;
        const evidence_item = evidence.find(e => e.id === request.evidenceId);
        return evidence_item && evidence_item.uploadedBy === user.id;
      })
    : accessRequests.filter(request => request.requestedBy === user.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Access Requests</h1>
        <p className="text-gray-400">
          {user.role === 'investigator' ? 'Manage access requests for your evidence' : 'Your evidence access requests'}
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Access Requests</h3>
            <p className="text-gray-400">
              {user.role === 'investigator' 
                ? 'No pending access requests for your evidence.' 
                : 'You have not submitted any access requests.'}
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
                      </div>
                    </div>
                    
                    {user.role === 'investigator' && request.status === 'pending' && (
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
