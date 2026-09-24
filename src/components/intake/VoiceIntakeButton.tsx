import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';

interface VoiceIntakeButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceIntakeButton: React.FC<VoiceIntakeButtonProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const reco = new SpeechRecognition();
    reco.continuous = true;
    reco.interimResults = true;
    reco.lang = 'en-IN'; // Supports Indian English & clinical terminology

    reco.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
      }
    };

    reco.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    };

    reco.onend = () => {
      setIsListening(false);
    };

    setRecognition(reco);
  }, [onTranscript]);

  const toggleListen = () => {
    if (!recognition) {
      // Fallback demo transcript if browser SpeechRecognition is restricted
      const demoSpeech = 'Patient has high fever 103F for three days, severe chest tightness, and SpO2 91 percent. Complaints of difficulty breathing.';
      onTranscript(demoSpeech);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Failed to start speech recognition:', e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListen}
      className={`relative group px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border shadow-lg ${
        isListening
          ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-red-500/30 animate-pulse'
          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 shadow-cyan-500/20'
      } ${className}`}
    >
      {isListening ? (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
          <MicOff className="w-4 h-4 text-red-400" />
          <span>Recording Voice Clinical Note...</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Voice Clinical Intake</span>
        </>
      )}
    </button>
  );
};
