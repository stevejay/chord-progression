import { useEffect, useRef, useState } from 'react';
import { Piano } from '@tonejs/piano';
import * as Tone from 'tone';

// https://github.com/Timtam/musicalsight/blob/7046ddac9b9441789a6c674edd984e14c86cbf7b/src/components/Playback.tsx

export function usePiano(canInitialise: boolean): [Piano | null, boolean, string] {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const piano = useRef<Piano | null>(null);

  useEffect(() => {
    if (!canInitialise) {
      return;
    }
    if (!piano.current) {
      piano.current = new Piano({
        // samples : '../audio/',
        release: true,
        pedal: false,
        velocities: 5 // 16
      }); //.toDestination();
      const vol = new Tone.Volume(-12).toDestination();
      piano.current.connect(vol);

      //   new Tone.Oscillator(440).connect(vol).start();
      //   new Tone.Oscillator(523.25).connect(vol).start();
    }
    piano.current
      .load()
      .then(() => setLoaded(true))
      .catch(() => setError('Failed to initialise the piano'));
  }, [canInitialise]);

  return [piano.current, loaded, error];
}
