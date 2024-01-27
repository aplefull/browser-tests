import { ReactNode } from 'react';

type TWrapperProps = {
  children: ReactNode;
  as: 'div' | 'span';
  props?: Record<string, unknown>;
  wrap?: boolean;
};

export const Wrapper = ({ children, as, wrap, props }: TWrapperProps) => {
  const WrapperComponent = as;

  if (wrap) {
    return <WrapperComponent {...props}>{children}</WrapperComponent>;
  }

  return <>{children}</>;
};
