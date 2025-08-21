'use client';

import React from 'react';
import { Shield, Loader2, Database, Lock } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/5 to-cyan-500/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-400/20 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-300/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400/20 rounded-full animate-float-delay-2"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Main Loading Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-blue-500/20 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            
            {/* Inner logo */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Shield className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-serif">
            Evidence Chain
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            Securing the blockchain...
          </p>
        </div>

        {/* Loading Steps Animation */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center space-x-3 text-slate-400">
            <Database className="h-5 w-5 animate-pulse text-blue-400" />
            <span className="text-sm">Connecting to database</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-100"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping delay-200"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-slate-400">
            <Lock className="h-5 w-5 animate-pulse text-cyan-400 delay-500" />
            <span className="text-sm">Verifying security protocols</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-500"></div>
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-600"></div>
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-purple-400 delay-1000" />
            <span className="text-sm">Loading evidence vault</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1100"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1200"></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/50 rounded-full h-2 mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-progress shadow-lg shadow-blue-500/25"></div>
        </div>

        {/* Security Notice */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Establishing secure connection to blockchain network.
            <br />
            All evidence data is encrypted and tamper-proof.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.8;
          }
        }
        
        @keyframes float-delay {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-15px) translateX(-10px); 
            opacity: 0.6;
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-10px) scale(1.2); 
            opacity: 0.8;
          }
        }
        
        @keyframes float-delay-2 {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.25;
          }
          50% { 
            transform: translateY(-25px) rotate(180deg); 
            opacity: 0.7;
          }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          25% { width: 30%; }
          50% { width: 60%; }
          75% { width: 85%; }
          100% { width: 100%; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 7s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
