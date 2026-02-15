import type { ReactNode } from 'react';
import clsx from 'clsx';

interface AppLayoutProps {
  header: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
}

export default function AppLayout({ header, main, footer }: AppLayoutProps) {
  return (
    <div
      data-component="app-layout"
      className={clsx(
        'grid grid-cols-4',
        'w-full h-dvh',
        'bg-white',
      )}
      style={{ gridTemplateRows: 'repeat(8, calc(100% / 8))' }}
    >
      <div className="col-span-4 row-span-1">
        {header}
      </div>

      <div
        className={clsx(
          'col-span-4 row-start-2',
          footer ? 'row-end-7' : 'row-end-9',
        )}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ height: '100%', overflowY: 'auto' }}>
          {main}
        </div>
      </div>

      {footer && (
        <div className="col-span-4 row-start-7 row-end-9 grid grid-cols-subgrid">
          {footer}
        </div>
      )}
    </div>
  );
}
