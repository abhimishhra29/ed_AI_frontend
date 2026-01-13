'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface PillButtonProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    target?: string;
}

/**
 * Premium Pill Button with precise geometric circle-reveal effect.
 * Logic ported from reference implementation to ensure perfect fill animation.
 */
export const PillButton: React.FC<PillButtonProps> = ({
    href,
    children,
    onClick,
    className = '',
    target
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [circleStyle, setCircleStyle] = useState({ width: 0, height: 0, bottom: 0, originY: 0 });

    useLayoutEffect(() => {
        const calculateGeometry = () => {
            if (!buttonRef.current) return;

            const rect = buttonRef.current.getBoundingClientRect();
            const { width: w, height: h } = rect;

            // Save dimensions for text animation
            setDimensions({ width: w, height: h });

            // Geometric calculation for the perfect circle fill from bottom
            // R = radius needed to cover the rect from the bottom center
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2; // Diameter plus safety buffer

            // Calculate how far down the circle needs to be positioned
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            setCircleStyle({
                width: D,
                height: D,
                bottom: -delta, // Position circle below the element
                originY: originY // Transform origin for scaling
            });
        };

        calculateGeometry();

        // Recalculate on resize
        window.addEventListener('resize', calculateGeometry);
        return () => window.removeEventListener('resize', calculateGeometry);
    }, [children]);

    return (
        <Link
            ref={buttonRef}
            href={href}
            onClick={onClick}
            target={target}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`pill-button ${className}`}
        >
            {/* Background circle that scales up on hover */}
            <motion.span
                className="pill-button-circle"
                style={{
                    width: circleStyle.width,
                    height: circleStyle.height,
                    bottom: circleStyle.bottom,
                    position: 'absolute',
                    left: '50%',
                    x: '-50%', // Center horizontally
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    pointerEvents: 'none',
                    zIndex: 1,
                    transformOrigin: `50% ${circleStyle.originY}px`
                }}
                initial={{ scale: 0 }}
                animate={{
                    scale: isHovered ? 1.2 : 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: [0.25, 1, 0.5, 1] // Power3.easeOut approximation
                }}
                aria-hidden="true"
            />

            {/* Wrapper for text to ensure z-index layering */}
            <span className="pill-button-text-wrapper" style={{ position: 'relative', zIndex: 2, display: 'inline-block', overflow: 'hidden' }}>
                {/* Default label */}
                <motion.span
                    className="pill-button-label"
                    style={{ display: 'block' }}
                    animate={{
                        y: isHovered ? -(dimensions.height + 8) : 0,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                >
                    {children}
                </motion.span>

                {/* Hover label (slides up into view) */}
                <motion.span
                    className="pill-button-label-hover"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        display: 'block',
                        color: 'var(--primary-dark, #213342)',
                        fontWeight: 600
                    }}
                    initial={{ y: dimensions.height + 8, opacity: 0 }}
                    animate={{
                        y: isHovered ? 0 : dimensions.height + 8,
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 1, 0.5, 1]
                    }}
                    aria-hidden="true"
                >
                    {children}
                </motion.span>
            </span>
        </Link>
    );
};

export default PillButton;
