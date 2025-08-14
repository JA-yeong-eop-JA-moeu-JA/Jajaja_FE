import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement>;

const InfiniteScrollSentinel = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref} {...props} />;
});

InfiniteScrollSentinel.displayName = 'InfiniteScrollSentinel';

export default InfiniteScrollSentinel;
