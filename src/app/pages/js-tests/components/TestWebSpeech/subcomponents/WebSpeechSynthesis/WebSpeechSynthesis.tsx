import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import { TextArea } from '@/app/components/TextArea/TextArea';
import { Container } from '@/app/components/Container/Container';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { Button } from '@/app/components/Button/Button';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';

type TSpeechSynthesisVoiceInfo = {
  voiceURI?: string;
  name?: string;
  lang?: string;
  default?: boolean;
  localService?: boolean;
};

type TSpeechSynthesisInfo = {
  speechSynthesis: {
    paused: boolean;
    pending: boolean;
    speaking: boolean;
  };
  speechSynthesisUtterance: {
    lang?: string;
    pitch?: number;
    rate?: number;
    text?: string;
    voice?: TSpeechSynthesisVoiceInfo | null;
    volume?: number;
  } | null;
  speechSynthesisVoice: TSpeechSynthesisVoiceInfo | null;
};

const getUtteranceInfo = (utterance: SpeechSynthesisUtterance | null) => {
  if (!utterance) return {};

  return {
    lang: utterance.lang,
    pitch: utterance.pitch,
    rate: utterance.rate,
    text: utterance.text,
    voice: getVoiceInfo(utterance.voice),
    volume: utterance.volume,
  };
};

const getVoiceInfo = (voice: SpeechSynthesisVoice | null) => {
  if (!voice) return {};

  return {
    voiceURI: voice.voiceURI,
    name: voice.name,
    lang: voice.lang,
    default: voice.default,
    localService: voice.localService,
  };
};

const getSpeechSynthesisInfo = () => {
  return {
    paused: window.speechSynthesis.paused,
    pending: window.speechSynthesis.pending,
    speaking: window.speechSynthesis.speaking,
  };
};

export const WebSpeechSynthesis = () => {
  const [error, setError] = useState<string>();
  const [synthesisText, setSynthesisText] = useState('Hello world!');
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [synthesisInfo, setSynthesisInfo] = useState<TSpeechSynthesisInfo>({
    speechSynthesis: {
      paused: window.speechSynthesis.paused,
      pending: window.speechSynthesis.pending,
      speaking: window.speechSynthesis.speaking,
    },
    speechSynthesisUtterance: null,
    speechSynthesisVoice: null,
  });
  const [synthesisSettings, setSynthesisSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  const speak = () => {
    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(synthesisText);
    utterance.voice = voice || voices[0];
    utterance.rate = synthesisSettings.rate;
    utterance.pitch = synthesisSettings.pitch;
    utterance.volume = synthesisSettings.volume;

    setCurrentUtterance(utterance);

    setSynthesisInfo({
      speechSynthesis: getSpeechSynthesisInfo(),
      speechSynthesisUtterance: getUtteranceInfo(utterance),
      speechSynthesisVoice: getVoiceInfo(voice),
    });

    setError('');

    synth.cancel();
    synth.speak(utterance);
  };

  const pauseSpeaking = () => {
    window.speechSynthesis.pause();
  };

  const resumeSpeaking = () => {
    window.speechSynthesis.resume();
  };

  const cancelSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const onVoiceSelect = (value: string) => {
    const selectedVoice = voices.find((voice) => voice.voiceURI === value);
    setVoice(selectedVoice || null);

    setSynthesisInfo((prev) => ({
      ...prev,
      speechSynthesisVoice: getVoiceInfo(selectedVoice || null),
    }));
  };

  useEffect(() => {
    if (!currentUtterance) return;

    const updateSpeechSynthesisInfo = () => {
      setSynthesisInfo((prev) => ({
        ...prev,
        speechSynthesis: getSpeechSynthesisInfo(),
      }));
    };

    const onError = (error: SpeechSynthesisErrorEvent) => {
      setError(`Speech synthesis error. Error: "${error.error}"`);
    };

    const onMark = (event: SpeechSynthesisEvent) => {
      console.log('Mark:', event);
    };

    const onBoundary = (event: SpeechSynthesisEvent) => {
      console.log('Boundary:', event);
    };

    currentUtterance.addEventListener('start', updateSpeechSynthesisInfo);
    currentUtterance.addEventListener('resume', updateSpeechSynthesisInfo);
    currentUtterance.addEventListener('pause', updateSpeechSynthesisInfo);
    currentUtterance.addEventListener('end', updateSpeechSynthesisInfo);
    currentUtterance.addEventListener('error', onError);
    currentUtterance.addEventListener('mark', onMark);
    currentUtterance.addEventListener('boundary', onBoundary);

    return () => {
      currentUtterance.removeEventListener('start', updateSpeechSynthesisInfo);
      currentUtterance.removeEventListener('resume', updateSpeechSynthesisInfo);
      currentUtterance.removeEventListener('pause', updateSpeechSynthesisInfo);
      currentUtterance.removeEventListener('end', updateSpeechSynthesisInfo);
      currentUtterance.removeEventListener('error', onError);
      currentUtterance.removeEventListener('mark', onMark);
      currentUtterance.removeEventListener('boundary', onBoundary);
    };
  }, [currentUtterance]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    setVoices(voices);
    setVoice(voices[0]);

    const onVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
    };
  }, []);

  return (
    <Container gap={10} align="start">
      <h2>Speech synthesis:</h2>
      <Select
        className={styles.select}
        options={voices.map((voice) => {
          return {
            label: `${voice.name} - ${voice.lang}`,
            value: voice.voiceURI,
          };
        })}
        value={{
          label: voice ? `${voice.name} - ${voice.lang}` : '',
          value: voice ? voice.voiceURI : '',
        }}
        onChange={onVoiceSelect}
      />
      <TextArea value={synthesisText} onChange={setSynthesisText} />
      <Container gap={10} className={styles.rangeInputs}>
        <RangeInput
          label="Rate"
          step={0.01}
          min={0}
          max={2}
          disabled={synthesisInfo.speechSynthesis.speaking}
          value={synthesisSettings.rate}
          onChange={(value) => setSynthesisSettings({ ...synthesisSettings, rate: value })}
        />
        <RangeInput
          label="Pitch"
          step={0.01}
          min={0}
          max={2}
          disabled={synthesisInfo.speechSynthesis.speaking}
          value={synthesisSettings.pitch}
          onChange={(value) => setSynthesisSettings({ ...synthesisSettings, pitch: value })}
        />
        <RangeInput
          label="Volume"
          step={0.01}
          min={0}
          max={1}
          disabled={synthesisInfo.speechSynthesis.speaking}
          value={synthesisSettings.volume}
          onChange={(value) => setSynthesisSettings({ ...synthesisSettings, volume: value })}
        />
      </Container>
      <Container direction="row" gap={10}>
        <Button text="Speak" onClick={speak} />
        <Button text="Pause" onClick={pauseSpeaking} />
        <Button text="Resume" onClick={resumeSpeaking} />
        <Button text="Cancel" onClick={cancelSpeaking} />
      </Container>
      <ErrorMessage message={error} />
      <span>Info:</span>
      <Json
        data={synthesisInfo}
        settings={{
          maxStringLength: 100,
          collapseLevel: 1,
        }}
      />
    </Container>
  );
};
