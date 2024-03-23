import { WebSpeechSynthesis } from '@/app/pages/js-tests/components/TestWebSpeech/subcomponents/WebSpeechSynthesis/WebSpeechSynthesis';
import { WebSpeechRecognition } from '@/app/pages/js-tests/components/TestWebSpeech/subcomponents/WebSpeechRecognition/WebSpeechRecognition';
import styles from './styles.module.scss';

export const TestWebSpeech = () => {
  return (
    <div className={styles.container}>
      <WebSpeechSynthesis />
      <WebSpeechRecognition />
    </div>
  );
};
