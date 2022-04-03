import { useCallback, useState } from 'react';
import * as Tone from 'tone';

export function useStartTone(): [() => void, boolean, boolean, string] {
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const startTone = useCallback(() => {
    setStarting(true);
    Tone.start()
      .then(() => {
        // TODO batch these.
        setStarting(false);
        setStarted(true);
      })
      .catch(() => setError('Failed to start Tone.js'));
  }, []);

  return [startTone, starting, started, error];
}
