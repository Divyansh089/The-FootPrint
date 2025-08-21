'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Mail
} from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-red-900 flex items-center justify-center px-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-500/5 to-pink-500/5 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            {/* Critical Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-full shadow-2xl border-4 border-red-400/30">
                  <AlertTriangle className="h-20 w-20 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Critical Error Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-red-400 via-orange-400 to-red-600 bg-clip-text text-transparent leading-none tracking-tight font-serif mb-4">
                Critical Error
              </h1>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-serif">
                Application Crashed
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
                A critical system error has occurred in the Evidence Chain application. 
                The security of your data remains intact, but immediate action is required.
              </p>

              {/* Critical Error Details */}
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-2xl p-6 max-w-lg mx-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-200">System Status</h3>
                </div>
                <div className="text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-300">Security Status:</span>
                    <span className="text-sm font-medium text-green-400">✓ Secure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-300">Data Integrity:</span>
                    <span className="text-sm font-medium text-green-400">✓ Intact</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-300">Application:</span>
                    <span className="text-sm font-medium text-red-400">✗ Crashed</span>
                  </div>
                  {error.digest && (
                    <div className="mt-4 pt-3 border-t border-red-700/50">
                      <p className="text-xs text-red-400">
                        <span className="font-medium">Error ID:</span> {error.digest}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Immediate Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Immediate Actions Required:</h3>
                <ul className="text-sm text-slate-300 space-y-2 text-left">
                  <li>• Restart the application using the button below</li>
                  <li>• Clear browser cache and reload the page</li>
                  <li>• Contact system administrator if error persists</li>
                  <li>• Document any actions taken before the crash</li>
                </ul>
              </div>
            </div>

            {/* Emergency Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-300 border border-red-500/50"
              >
                <RefreshCw className="h-5 w-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Emergency Restart
              </button>
              
              <Link 
                href="/"
                className="group inline-flex items-center justify-center px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-xl border border-slate-600/50 hover:border-slate-500/50 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Home className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                Force Return Home
              </Link>
            </div>

            {/* Support Contact */}
            <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-6 max-w-lg mx-auto mb-8">
              <h3 className="text-lg font-semibold text-blue-200 mb-3">Need Emergency Support?</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="mailto:admin@evidencechain.gov"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium rounded-lg border border-blue-600/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Admin
                </a>
                <a 
                  href="tel:+1-800-EVIDENCE"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-300 font-medium rounded-lg border border-green-600/50 hover:border-green-500/50 transition-all duration-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Emergency Hotline
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-slate-700/50">
              <p className="text-sm text-slate-500">
                Evidence Chain • Critical System Error • {new Date().toLocaleString()}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                This incident has been automatically logged for forensic analysis
              </p>
            </div>
          </div>

          {/* Critical Error Indicators */}
          <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-400/40 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-orange-400/40 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-300/40 rounded-full animate-ping delay-1000"></div>
          
          {/* Emergency Alert Animation */}
          <style jsx>{`
            @keyframes emergency-flash {
              0%, 100% { 
                border-color: rgb(239 68 68 / 0.5); 
                box-shadow: 0 0 20px rgb(239 68 68 / 0.3);
              }
              50% { 
                border-color: rgb(251 146 60 / 0.8); 
                box-shadow: 0 0 40px rgb(251 146 60 / 0.5);
              }
            }
            .emergency-flash {
              animation: emergency-flash 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      </body>
    </html>
  );
}
