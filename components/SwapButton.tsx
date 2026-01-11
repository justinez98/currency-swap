"use client";

import { useState, memo } from "react";

interface SwapButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const SwapButton = memo(function SwapButton({ onClick, disabled = false }: SwapButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                    w-12 h-12 rounded-full
                    bg-gray-900
                    border-2 border-gray-800
                    shadow-lg hover:shadow-xl hover:shadow-[#00ff88]/20
                    flex items-center justify-center
                    transition-all duration-200
                    hover:scale-110 active:scale-95
                    hover:border-[#00ff88]/50
                    focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
            aria-label="Swap currencies"
        >
            <svg
                className={`
                        w-5 h-5 text-[#00ff88]
                        transition-transform duration-200
                        ${isHovered && !disabled ? "rotate-180" : ""}
                    `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
            </svg>
        </button>
    );
});
