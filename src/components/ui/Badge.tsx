import React from 'react';

export type BadgeVariant =
  | 'SUFFICIENT EVIDENCE'
  | 'CONDITION NOT SATISFIED'
  | 'ADDITIONAL EVIDENCE REQUIRED'
  | 'HUMAN REVIEW REQUIRED'
  | 'ESTABLISHED'
  | 'NOT SATISFIED'
  | 'MISSING'
  | 'INCOMPLETE'
  | 'UNREADABLE'
  | 'CONTRADICTORY'
  | 'REQUIRES HUMAN CONFIRMATION'
  | 'verified'
  | 'urgent'
  | 'pending'
  | 'neutral'
  | 'info';

interface BadgeProps {
  variant: BadgeVariant | string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ variant, children, size = 'md', className = '' }: BadgeProps) {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (variant) {
    case 'SUFFICIENT EVIDENCE':
    case 'ESTABLISHED':
    case 'verified':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;

    case 'CONDITION NOT SATISFIED':
    case 'NOT SATISFIED':
      style = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-500';
      break;

    case 'ADDITIONAL EVIDENCE REQUIRED':
    case 'MISSING':
    case 'INCOMPLETE':
    case 'UNREADABLE':
    case 'urgent':
      style = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-500';
      break;

    case 'HUMAN REVIEW REQUIRED':
    case 'CONTRADICTORY':
    case 'REQUIRES HUMAN CONFIRMATION':
      style = 'bg-purple-50 text-purple-800 border-purple-200';
      dotColor = 'bg-purple-500';
      break;

    case 'info':
      style = 'bg-sky-50 text-sky-800 border-sky-200';
      dotColor = 'bg-sky-500';
      break;

    case 'pending':
    default:
      style = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
  }

  const sizeClasses = {
    sm: 'text-2xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      <span>{children || variant}</span>
    </span>
  );
}
