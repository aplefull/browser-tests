import styles from './styles.module.scss';
import { Component, ReactNode } from 'react';
import { getErrorMessage } from '@/utils/utils';
import { Code } from '@/app/components/Code/Code';

type TSectionErrorBoundaryProps = {
  children: ReactNode;
};

type TSectionErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string | null;
  errorInfo?: string | null;
};

export class SectionErrorBoundary extends Component<TSectionErrorBoundaryProps, TSectionErrorBoundaryState> {
  constructor(props: TSectionErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false, errorMessage: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    this.setState({ errorMessage: getErrorMessage(error), errorInfo: info.componentStack });
  }

  render() {
    const { hasError, errorInfo, errorMessage } = this.state;

    if (hasError) {
      return (
        <div className={styles.container}>
          <h3>This section crashed 😢</h3>
          <div className={styles.errorData}>
            <span>Error: {`${errorMessage}`}</span>
            {errorInfo && <Code>{errorInfo.trim()}</Code>}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
