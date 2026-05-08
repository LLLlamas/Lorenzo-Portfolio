import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  as?: 'div' | 'section' | 'span' | 'li';
  className?: string;
  delay?: number;
};

export function Reveal({ children, as: As = 'div', className }: Props) {
  return <As className={className}>{children}</As>;
}
