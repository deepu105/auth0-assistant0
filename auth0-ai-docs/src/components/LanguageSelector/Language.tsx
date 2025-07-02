import { ReactNode } from 'react';

type Props = {
  id: string;
  name: string;
  icon: string;
  children: ReactNode[];
  disabled?: boolean;
};

export default function Language({
  name,
  children,
  disabled = false,
}: Props): ReactNode {
  return <>{children}</>;
}
