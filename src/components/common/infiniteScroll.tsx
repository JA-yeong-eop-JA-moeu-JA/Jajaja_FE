import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

type TProps = HTMLAttributes<HTMLDivElement>;

const InfiniteScrollSentinel = forwardRef<HTMLDivElement, TProps>((props, ref) => {
  return <div ref={ref} {...props} />;
});

InfiniteScrollSentinel.displayName = 'InfiniteScrollSentinel';

export default InfiniteScrollSentinel;
