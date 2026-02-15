import type { ReactNode } from 'react';

interface FooterProps {
  statusPanel: ReactNode;
  actionPanel: ReactNode;
}

export default function Footer({ statusPanel, actionPanel }: FooterProps) {
  return (
    <>
      <div className="col-span-2">{statusPanel}</div>
      <div className="col-span-2">{actionPanel}</div>
    </>
  );
}
