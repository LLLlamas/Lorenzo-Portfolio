import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  step?: number;
};

export function Stagger({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}
