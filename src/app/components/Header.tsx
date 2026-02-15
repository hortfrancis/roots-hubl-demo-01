import type { ReactNode } from 'react';
import clsx from 'clsx';

interface HeaderProps {
  title?: string;
  action?: ReactNode;
}

export default function Header({ title = 'Roots', action }: HeaderProps) {
  return (
    <header
      data-component="header"
      className={clsx(
        'flex items-center justify-between',
        'h-full px-4',
        'bg-gray-200',
      )}
    >
      <span className="font-bold text-lg">{title}</span>
      {action && <div>{action}</div>}
    </header>
  );
}
