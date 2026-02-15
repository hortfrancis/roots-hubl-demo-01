import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ConvoScreenLayoutProps {
  header: ReactNode;
  main: ReactNode;
  footer: ReactNode;
}

export default function ConvoScreenLayout({ header, main, footer }: ConvoScreenLayoutProps) {
  return (
    <div
      data-component="convo-screen-layout"
      className={clsx(
        'grid grid-cols-4 grid-rows-8',
        'w-[400px] h-[800px]',
        'bg-white overflow-hidden',
      )}
    >
      <div className="col-span-4 row-span-1">
        {header}
      </div>

      <div className="col-span-4 row-start-2 row-end-7">
        {main}
      </div>

      <div className="col-span-4 row-start-7 row-end-9 grid grid-cols-subgrid">
        {footer}
      </div>
    </div>
  );
}
