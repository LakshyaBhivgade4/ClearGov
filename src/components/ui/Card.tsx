import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export function Card({ children, hover = false, onClick, className = '', selected = false }: CardProps) {
  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick
    ? {
        whileHover: { y: -2 },
        whileTap: onClick ? { scale: 0.99 } : undefined,
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-xl border bg-white p-6
        transition-colors duration-200
        ${selected
          ? 'border-slate-900 ring-1 ring-slate-900'
          : 'border-slate-200'
        }
        ${onClick ? 'cursor-pointer hover:border-slate-300' : ''}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
