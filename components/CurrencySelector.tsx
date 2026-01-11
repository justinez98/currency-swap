"use client";

import { useState, useRef, useEffect } from "react";
import { Currency } from "@/types/currency";
import { getCurrencyCodes, CURRENCY_INFO } from "@/utils/currencies";
import { useIsMobile } from '@/hooks/useIsMobile';


interface CurrencySelectorProps {
    selectedCurrency: Currency;
    onSelect: (currency: Currency) => void;
    disabled?: boolean;
}

export function CurrencySelector({
    selectedCurrency,
    onSelect,
    disabled = false,
}: CurrencySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const currencies = getCurrencyCodes();

    // Filter currencies based on search
    const filteredCurrencies = currencies.filter((code) => {
        const info = CURRENCY_INFO[code];
        const query = searchQuery.toLowerCase();
        return (
            code.toLowerCase().includes(query) ||
            info.name.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (isMobile) {
                // For modal, close on backdrop click
                if (
                    modalRef.current &&
                    modalRef.current.contains(target) &&
                    (target as HTMLElement).classList.contains("modal-backdrop")
                ) {
                    setIsOpen(false);
                    setSearchQuery("");
                }
            } else {
                // For dropdown, close on outside click
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(target)
                ) {
                    setIsOpen(false);
                    setSearchQuery("");
                }
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent body scroll when modal is open on mobile
            if (isMobile) {
                document.body.style.overflow = "hidden";
            }
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (isMobile) {
                document.body.style.overflow = "";
            }
        };
    }, [isOpen, isMobile]);

    // Close on Escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && isOpen) {
                setIsOpen(false);
                setSearchQuery("");
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const selectedInfo = CURRENCY_INFO[selectedCurrency as Currency];

    // Currency list component (shared between dropdown and modal)
    const CurrencyList = () => (
        <>
            {/* Search Input */}
            <div className="p-3 border-b border-gray-800">
                <input
                    type="text"
                    placeholder="Search currency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg
                            text-white border border-gray-700
                            focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50
                            placeholder-gray-500"
                    autoFocus={!isMobile}
                />
            </div>

            {/* Currency List */}
            <div className={`${isMobile ? "max-h-[60vh]" : "max-h-64"} overflow-y-auto`}>
                {filteredCurrencies.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No currencies found
                    </div>
                ) : (
                    filteredCurrencies.map((code) => {
                        const info = CURRENCY_INFO[code];
                        const isSelected = code === selectedCurrency;

                        return (
                            <button
                                key={code}
                                type="button"
                                onClick={() => {
                                    onSelect(code);
                                    setIsOpen(false);
                                    setSearchQuery("");
                                }}
                                className={`
                                    w-full px-4 py-3 text-left
                                    hover:bg-gray-800
                                    transition-colors duration-150
                                    flex items-center justify-between
                                    ${isSelected ? "bg-[#00ff88]/10" : ""}
                                `}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold text-white">
                                        {code}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {info.name}
                                    </span>
                                </div>
                                {isSelected && (
                                    <svg
                                        className="w-5 h-5 text-[#00ff88]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </>
    );

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                {/* Currency Button */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full
                        bg-gray-800 hover:bg-gray-700
                        transition-colors duration-200
                        font-medium text-white
                        border-2 border-gray-700
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50
                    `}
                >
                    <span className="text-lg font-semibold">
                        {selectedInfo.code}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${isOpen ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Desktop Dropdown */}
                {isOpen && !isMobile && (
                    <div className="absolute z-50 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                        <CurrencyList />
                    </div>
                )}
            </div>

            {/* Mobile Modal */}
            {isOpen && isMobile && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
                >
                    {/* Backdrop */}
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => {
                            setIsOpen(false);
                            setSearchQuery("");
                        }}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h2 className="text-lg font-semibold text-white">
                                Select Currency
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setSearchQuery("");
                                }}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden">
                            <CurrencyList />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
