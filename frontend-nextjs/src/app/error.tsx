'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  RefreshCw,
  AlertTriangle,
  Bug,
  ArrowLeft
} from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-red-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-500/5 to-pink-500/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-16 w-16 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-red-400 via-orange-400 to-red-600 bg-clip-text text-transparent leading-none tracking-tight font-serif mb-4">
            Oops!
          </h1>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bug className="h-8 w-8 text-red-400 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-serif">
              Something Went Wrong
            </h2>
          </div>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
            An unexpected error occurred while processing your blockchain evidence request. 
            Our security protocols have logged this incident.
          </p>

          {/* Error Details Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-slate-200">Error Details</h3>
            </div>
            <div className="text-left space-y-2">
              <p className="text-sm text-slate-400">
                <span className="font-medium text-slate-300">Message:</span> {error.message}
              </p>
              {error.digest && (
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-slate-300">Error ID:</span> {error.digest}
                </p>
              )}
              <p className="text-sm text-slate-400">
                <span className="font-medium text-slate-300">Time:</span> {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">What you can try:</h3>
            <ul className="text-sm text-blue-300 space-y-2 text-left">
              <li>• Refresh the page to retry the operation</li>
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Try again in a few minutes</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="h-5 w-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          
          <Link 
            href="/"
            className="group inline-flex items-center justify-center px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-xl border border-slate-600/50 hover:border-slate-500/50 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Home className="h-5 w-5 mr-3 group-hover:animate-pulse" />
            Return Home
          </Link>
        </div>

        {/* Go Back Link */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Go back to previous page
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-sm text-slate-500">
            Evidence Chain • Secure Blockchain Evidence Management
          </p>
          <p className="text-xs text-slate-600 mt-2">
            If this error persists, please contact system administrator
          </p>
        </div>
      </div>

      {/* Floating Error Indicators */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-400/30 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-400/30 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-300/30 rounded-full animate-ping delay-1000"></div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
