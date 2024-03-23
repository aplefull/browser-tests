import { useEffect, useRef, useState } from 'react';
import bcp47Languages from '@data/languages-bcp-47.json';
import styles from './styles.module.scss';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { Select } from '@/app/components/Select/Select';
import { Input } from '@/app/components/Input/Input';
import { Button } from '@/app/components/Button/Button';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import classNames from 'classnames';
import { getErrorMessage } from '@utils';
import { Container } from '@/app/components/Container/Container';

type TGrammarListSource = (typeof GRAMMAR_LIST_SOURCE)[keyof typeof GRAMMAR_LIST_SOURCE];

type TSpeechRecognitionSettings = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  grammars?: SpeechGrammarList;
};

type TSpeechRecognitionState = {
  recognitionInProgress: boolean;
  audioInProgress: boolean;
  soundInProgress: boolean;
  speechInProgress: boolean;
};

type TRecognitionStatusProps = {
  on: boolean;
  label: string;
};

const GRAMMAR_LIST_SOURCE = {
  STRING: 'String',
  URI: 'URI',
};

const RecognitionStatus = ({ on, label }: TRecognitionStatusProps) => {
  return (
    <div className={styles.status}>
      <span>{label}</span>
      <div
        className={classNames(styles.indicator, {
          [styles.on]: on,
        })}
      />
    </div>
  );
};

export const WebSpeechRecognition = () => {
  const [recognitionAvailable, setRecognitionAvailable] = useState(true);
  const [useGrammarList, setUseGrammarList] = useState(false);
  const [grammarList, setGrammarList] = useState('');
  const [grammarURI, setGrammarURI] = useState('');
  const [recognitionResultList, setRecognitionResultList] = useState<SpeechRecognitionResultList | null>(null);
  const [error, setError] = useState<string>();
  const [grammarListSource, setGrammarListSource] = useState<TGrammarListSource>(GRAMMAR_LIST_SOURCE.STRING);
  const [recognitionState, setRecognitionState] = useState<TSpeechRecognitionState>({
    recognitionInProgress: false,
    audioInProgress: false,
    soundInProgress: false,
    speechInProgress: false,
  });
  const [recognitionSettings, setRecognitionSettings] = useState<TSpeechRecognitionSettings>({
    continuous: true,
    interimResults: true,
    lang: bcp47Languages.includes(document.documentElement.lang) ? document.documentElement.lang : 'en',
    maxAlternatives: 2,
  });

  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    if (!recognition) return;

    const onRecognitionResult = (event: SpeechRecognitionEvent) => {
      setRecognitionResultList(event.results);
    };

    const setProgress = (key: keyof TSpeechRecognitionState, value: boolean) => () => {
      setRecognitionState((state) => ({ ...state, [key]: value }));
    };

    const onError = (error: SpeechRecognitionErrorEvent) => {
      setError(`Recognition error. Error: "${error.error}" Message: "${error.message}"`);
    };

    const onNoMatch = () => {
      setError('No match found.');
    };

    recognition.addEventListener('result', onRecognitionResult);
    recognition.addEventListener('nomatch', onNoMatch);
    recognition.addEventListener('error', onError);
    recognition.addEventListener('audiostart', setProgress('audioInProgress', true));
    recognition.addEventListener('audioend', setProgress('audioInProgress', false));
    recognition.addEventListener('start', setProgress('recognitionInProgress', true));
    recognition.addEventListener('end', setProgress('recognitionInProgress', false));
    recognition.addEventListener('soundstart', setProgress('soundInProgress', true));
    recognition.addEventListener('soundend', setProgress('soundInProgress', false));
    recognition.addEventListener('speechstart', setProgress('speechInProgress', true));
    recognition.addEventListener('speechend', setProgress('speechInProgress', false));

    recognition.continuous = recognitionSettings.continuous;
    recognition.interimResults = recognitionSettings.interimResults;
    recognition.maxAlternatives = recognitionSettings.maxAlternatives;
    recognition.lang = recognitionSettings.lang;

    if (useGrammarList) {
      recognition.grammars = recognitionSettings.grammars;
    }

    speechRecognitionRef.current = recognition;

    setError('');

    recognition.start();
  };

  const stopRecognition = () => {
    speechRecognitionRef.current?.stop();
  };

  const onGrammarListSourceChange = (value: TGrammarListSource) => {
    setGrammarListSource(value);

    if (value === GRAMMAR_LIST_SOURCE.STRING) {
      onGrammarListStringChange(grammarList);
    }

    if (value === GRAMMAR_LIST_SOURCE.URI) {
      onGrammarListURIChange(grammarURI);
    }
  };

  const onGrammarListStringChange = (value: string) => {
    setGrammarList(value);

    onRecognitionSettingsChange('grammars', value);
  };

  const onGrammarListURIChange = (value: string) => {
    setGrammarURI(value);

    onRecognitionSettingsChange('grammars', value);
  };

  const onRecognitionSettingsChange = (key: keyof TSpeechRecognitionSettings, value: string | boolean | number) => {
    if ((key === 'continuous' || key === 'interimResults') && typeof value === 'boolean') {
      setRecognitionSettings((prev) => ({ ...prev, [key]: value }));
    }

    if (key === 'lang' && typeof value === 'string') {
      setRecognitionSettings((prev) => ({ ...prev, lang: value }));
    }

    if (key === 'grammars' && typeof value === 'string') {
      if (useGrammarList) {
        try {
          const speechGrammarList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();

          if (grammarListSource === GRAMMAR_LIST_SOURCE.URI) {
            speechGrammarList.addFromUri(grammarURI);
          }

          if (grammarListSource === GRAMMAR_LIST_SOURCE.STRING) {
            const tokens = grammarList.split(/,/).map((word) => word.trim());
            const string = `#JSGF V1.0; grammar words; public <word> = ${tokens.join(' | ')} ;`;
            const weight = Math.sqrt(Math.PI) - Math.sin(3.1 * Math.E);

            speechGrammarList.addFromString(string, weight);
          }

          setRecognitionSettings((prev) => ({ ...prev, grammars: speechGrammarList }));
        } catch (error) {
          setError(`Error while setting grammar list: ${getErrorMessage(error)}`);
        }
      }
    }
  };

  useEffect(() => {
    try {
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    } catch {
      setRecognitionAvailable(false);
    }
  }, []);

  return (
    <>
      <h2>Speech recognition:</h2>
      {!recognitionAvailable && <span>Speech recognition is not available.</span>}
      {recognitionAvailable && (
        <Container gap={10}>
          <Checkbox
            disabled={recognitionState.recognitionInProgress}
            checked={useGrammarList}
            onChange={setUseGrammarList}
            label="Use grammar list"
          />
          {useGrammarList && (
            <Container gap={10}>
              <span>Grammar list:</span>
              <Select
                className={styles.grammarListSelect}
                disabled={recognitionState.recognitionInProgress}
                options={Object.values(GRAMMAR_LIST_SOURCE)}
                onChange={onGrammarListSourceChange}
                value={grammarListSource}
              />
              {grammarListSource === GRAMMAR_LIST_SOURCE.STRING && (
                <Input
                  disabled={recognitionState.recognitionInProgress}
                  value={grammarList}
                  onChange={onGrammarListStringChange}
                  placeholder="Comma-separated list of words or phrases (they will be trimmed)"
                />
              )}
              {grammarListSource === GRAMMAR_LIST_SOURCE.URI && (
                <Input
                  disabled={recognitionState.recognitionInProgress}
                  value={grammarURI}
                  onChange={onGrammarListURIChange}
                  placeholder="Enter grammar list URI"
                />
              )}
            </Container>
          )}
          <Container gap={10}>
            <Checkbox
              label="Continuous"
              disabled={recognitionState.recognitionInProgress}
              checked={recognitionSettings.continuous}
              onChange={(value) => onRecognitionSettingsChange('continuous', value)}
            />
            <Checkbox
              label="Interim results"
              disabled={recognitionState.recognitionInProgress}
              checked={recognitionSettings.interimResults}
              onChange={(value) => onRecognitionSettingsChange('interimResults', value)}
            />
            <Select
              searchable
              className={styles.languageSelect}
              options={bcp47Languages}
              disabled={recognitionState.recognitionInProgress}
              onChange={(value) => onRecognitionSettingsChange('lang', value)}
              value={recognitionSettings.lang}
            />
          </Container>
          <Container gap={10} className={styles.controlsContainer}>
            <Container direction="row" gap={10}>
              <Button text="Start" onClick={startRecognition} />
              <Button text="Stop" onClick={stopRecognition} />
            </Container>
            <Container gap={5} className={styles.statusContainer}>
              <RecognitionStatus on={recognitionState.recognitionInProgress} label="Recognition in progress:" />
              <RecognitionStatus on={recognitionState.audioInProgress} label="Capturing audio:" />
              <RecognitionStatus on={recognitionState.soundInProgress} label="Sound detected:" />
              <RecognitionStatus on={recognitionState.speechInProgress} label="Speech detected:" />
            </Container>
            <ErrorMessage message={error} />
          </Container>
          <span>Recognized text:</span>
          <Container gap={5} className={styles.recognizedTextContainer}>
            <div className={styles.textArea}>
              {recognitionResultList &&
                [...recognitionResultList].map((result, index) => {
                  return (
                    <span key={index} title={`Confidence: ${result[0].confidence}`}>
                      {result[0].transcript}
                    </span>
                  );
                })}
            </div>
            <Button className={styles.clearButton} text="Clear" onClick={() => setRecognitionResultList(null)} />
          </Container>
        </Container>
      )}
    </>
  );
};
