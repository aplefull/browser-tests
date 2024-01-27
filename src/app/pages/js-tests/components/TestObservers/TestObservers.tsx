import { ResizeObserverTest } from '@/app/pages/js-tests/components/TestObservers/observers/ResizeObserverTest/ResizeObserverTest';
import { IntersectionObserverTest } from '@/app/pages/js-tests/components/TestObservers/observers/IntersectionObserverTest/IntersectionObserverTest';
import { MutationObserverTest } from '@/app/pages/js-tests/components/TestObservers/observers/MutationObserverTest/MutationObserverTest';
import { PerformanceObserverTest } from '@/app/pages/js-tests/components/TestObservers/observers/PerformanceObserverTest/PerformanceObserverTest';
import { ReportingObserverTest } from '@/app/pages/js-tests/components/TestObservers/observers/ReportingObserverTest/ReportingObserverTest';

import styles from './styles.module.scss';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';

export const TestObservers = () => {
  return (
    <div className={styles.container}>
      <h2>Resize observer</h2>
      <SectionErrorBoundary>
        <ResizeObserverTest />
      </SectionErrorBoundary>
      <h2>Intersection observer</h2>
      <SectionErrorBoundary>
        <IntersectionObserverTest />
      </SectionErrorBoundary>
      <h2>Mutation observer</h2>
      <SectionErrorBoundary>
        <MutationObserverTest />
      </SectionErrorBoundary>
      <h2>Performance observer</h2>
      <SectionErrorBoundary>
        <PerformanceObserverTest />
      </SectionErrorBoundary>
      <h2>Reporting observer</h2>
      <SectionErrorBoundary>
        <ReportingObserverTest />
      </SectionErrorBoundary>
    </div>
  );
};
