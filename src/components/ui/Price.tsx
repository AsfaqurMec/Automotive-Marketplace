'use client';

import React from 'react';
import { useCurrency } from '@/lib/hooks/CurrencyProvider';

interface PriceProps {
  amountUSD: number;
  /** Optional override for typography element or wrapper */
  component?: React.ElementType;
  /** Optional className to pass through */
  className?: string;
}

export default function Price({ amountUSD, component: Component = 'span', className }: PriceProps): React.JSX.Element {
  const { formatFromUSD } = useCurrency();
  return <Component className={className}>{formatFromUSD(amountUSD)}</Component>;
}


