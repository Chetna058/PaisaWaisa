import React from 'react';

interface PaisaWaisaLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const PaisaWaisaLogo: React.FC<PaisaWaisaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimension mapping
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 88,
  };

  const iconDim = iconSizes[size];

  // The custom vector SVG symbol: Wallet + ₹ Rupee Notes + Golden Coin Stacks + Growth Arrow
  const SymbolIcon = () => (
    <svg
      width={iconDim}
      height={iconDim}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <defs>
        {/* Soft Shadow Filter */}
        <filter id="pwShadow" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#042F2C" floodOpacity="0.16" />
        </filter>

        {/* Wallet Gradients */}
        <linearGradient id="walletGrad" x1="16" y1="36" x2="100" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B4644" />
          <stop offset="100%" stopColor="#062E2D" />
        </linearGradient>

        <linearGradient id="walletFlapGrad" x1="18" y1="46" x2="98" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D5C58" />
          <stop offset="100%" stopColor="#093F3C" />
        </linearGradient>

        {/* Currency Note Gradients */}
        <linearGradient id="noteGrad1" x1="30" y1="16" x2="86" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="noteGrad2" x1="22" y1="24" x2="74" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Coin Stack Gold Gradients */}
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="coinHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Growth Arrow Gradient */}
        <linearGradient id="growthArrowGrad" x1="44" y1="92" x2="114" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Background Emblem Glow */}
        <linearGradient id="emblemBackdrop" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>

      {/* Rounded Hexagonal / Shield Base Emblem */}
      <rect x="4" y="4" width="112" height="112" rx="28" fill="url(#emblemBackdrop)" stroke="#A7F3D0" strokeWidth="2.5" />

      {/* 1. Indian Currency Notes (Peeking out from the top of the wallet) */}
      {/* Back Rupee Note */}
      <g transform="rotate(10 60 40)">
        <rect x="36" y="16" width="46" height="26" rx="4" fill="url(#noteGrad1)" stroke="#A7F3D0" strokeWidth="1" />
        <circle cx="59" cy="29" r="6" fill="#047857" opacity="0.35" />
        <text x="59" y="33" fontSize="10" fontWeight="bold" fill="#ECFDF5" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">
          ₹
        </text>
      </g>

      {/* Front Rupee Note with ₹ Symbol */}
      <g transform="rotate(-6 52 38)">
        <rect x="28" y="20" width="50" height="28" rx="4" fill="url(#noteGrad2)" stroke="#D1FAE5" strokeWidth="1.2" />
        <circle cx="53" cy="34" r="7" fill="#065F46" opacity="0.4" />
        <text x="53" y="38" fontSize="12" fontWeight="800" fill="#FFFFFF" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">
          ₹
        </text>
        <line x1="33" y1="26" x2="40" y2="26" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="66" y1="26" x2="73" y2="26" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* 2. Sleek Modern Wallet Body */}
      <g filter="url(#pwShadow)">
        {/* Main Wallet Leather Body */}
        <rect x="18" y="38" width="80" height="58" rx="14" fill="url(#walletGrad)" stroke="#115E59" strokeWidth="2" />
        
        {/* Wallet Flap Contour */}
        <path
          d="M18 48 C36 54, 76 54, 98 48 L98 58 C76 64, 36 64, 18 58 Z"
          fill="url(#walletFlapGrad)"
          opacity="0.9"
        />

        {/* Wallet Clasp / Fastener */}
        <rect x="74" y="60" width="24" height="15" rx="7.5" fill="#042F2C" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="82" cy="67.5" r="3" fill="#34D399" />
      </g>

      {/* 3. Golden Coin Stacks (Savings & Wealth) */}
      <g transform="translate(14, 70)">
        {/* Left Coin Stack */}
        {/* Coin 1 (Bottom) */}
        <ellipse cx="14" cy="25" rx="11" ry="4" fill="#B45309" />
        <ellipse cx="14" cy="23" rx="11" ry="4" fill="url(#coinGrad)" stroke="#FDE047" strokeWidth="0.8" />
        {/* Coin 2 (Middle) */}
        <ellipse cx="14" cy="19" rx="11" ry="4" fill="#B45309" />
        <ellipse cx="14" cy="17" rx="11" ry="4" fill="url(#coinGrad)" stroke="#FDE047" strokeWidth="0.8" />
        {/* Coin 3 (Top with ₹) */}
        <ellipse cx="14" cy="13" rx="11" ry="4" fill="#B45309" />
        <ellipse cx="14" cy="11" rx="11" ry="4" fill="url(#coinHighlight)" stroke="#FEF08A" strokeWidth="0.8" />
        <text x="14" y="13.5" fontSize="6.5" fontWeight="bold" fill="#78350F" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">
          ₹
        </text>

        {/* Right Coin Stack (Slightly taller) */}
        {/* Coin 1 */}
        <ellipse cx="28" cy="27" rx="9" ry="3.5" fill="#B45309" />
        <ellipse cx="28" cy="25" rx="9" ry="3.5" fill="url(#coinGrad)" stroke="#FDE047" strokeWidth="0.8" />
        {/* Coin 2 */}
        <ellipse cx="28" cy="21" rx="9" ry="3.5" fill="#B45309" />
        <ellipse cx="28" cy="19" rx="9" ry="3.5" fill="url(#coinGrad)" stroke="#FDE047" strokeWidth="0.8" />
        {/* Coin 3 */}
        <ellipse cx="28" cy="15" rx="9" ry="3.5" fill="#B45309" />
        <ellipse cx="28" cy="13" rx="9" ry="3.5" fill="url(#coinHighlight)" stroke="#FEF08A" strokeWidth="0.8" />
      </g>

      {/* 4. Dynamic Rising Financial Growth Arrow */}
      <g filter="url(#pwShadow)">
        {/* Rising Arc Trail */}
        <path
          d="M48 94 C68 84, 82 66, 94 36"
          stroke="url(#growthArrowGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Arrow Head */}
        <path
          d="M80 32 L98 32 L98 50"
          stroke="#10B981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sparkling Star at Arrow Tip */}
        <circle cx="98" cy="32" r="3.5" fill="#FEF08A" />
      </g>
    </svg>
  );

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <SymbolIcon />
      </div>
    );
  }

  // Centered / Vertical Brand Mark (Ideal for Splash, Modal, README, and Presentations)
  if (variant === 'mark') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        <SymbolIcon />
        <div className="flex flex-col items-center">
          <div className="font-headline-md tracking-tight leading-none text-2xl md:text-3xl font-extrabold flex items-center">
            <span className="text-[#093F3C] dark:text-[#5EEAD4]">Paisa</span>
            <span className="text-[#059669] dark:text-[#34D399]">Waisa</span>
          </div>
          {showTagline && (
            <span className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant mt-1.5 font-sans">
              Spend Smart • Save More • Live Better
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Lockup (for Navbar & Sidebar)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <SymbolIcon />
      <div className="flex flex-col text-left">
        <div className="tracking-tight leading-none text-xl lg:text-2xl font-black font-sans flex items-center">
          <span className="text-[#093F3C] dark:text-[#5EEAD4]">Paisa</span>
          <span className="text-[#059669] dark:text-[#34D399]">Waisa</span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-tight text-on-surface-variant mt-0.5 whitespace-nowrap">
            Spend Smart. Save More. Live Better.
          </span>
        )}
      </div>
    </div>
  );
};
