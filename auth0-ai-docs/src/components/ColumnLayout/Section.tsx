import { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode[];
};

export default function Section({ children }: SectionProps): ReactNode {
  return <>{children}</>;
}
