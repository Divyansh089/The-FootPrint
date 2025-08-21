'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Home, 
  ArrowLeft,
  Search,
  AlertTriangle,
  FileQuestion
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/5 to-cyan-500/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* 404 Number with Animation */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent leading-none tracking-tight font-serif">
            404
          </h1>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileQuestion className="h-8 w-8 text-blue-400 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-serif">
              Evidence Not Found
            </h2>
          </div>
          
          <p className="text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
            The digital evidence you&apos;re looking for seems to have vanished into the blockchain void. 
            It might have been moved, deleted, or never existed in the first place.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-slate-200">What happened?</h3>
            </div>
            <ul className="text-sm text-slate-400 space-y-2 text-left">
              <li>• The URL might be mistyped</li>
              <li>• The evidence was moved or deleted</li>
              <li>• Access permissions have changed</li>
              <li>• The blockchain record is corrupted</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <Home className="h-5 w-5 mr-3 group-hover:animate-pulse" />
            Return to Dashboard
          </Link>
          
          <Link 
            href="/search"
            className="group inline-flex items-center justify-center px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-xl border border-slate-600/50 hover:border-slate-500/50 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Search className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            Search Evidence
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

        {/* Footer Text */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-sm text-slate-500">
            Evidence Chain • Secure Blockchain Evidence Management
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-400/30 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-300/30 rounded-full animate-ping delay-1000"></div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
