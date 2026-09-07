import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { transcribeAudioFile } from '../services/api';

export default function VoiceRecorder({ onTranscriptChange, currentText, isUrdu }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [audioLevel, setAudioLevel] = useState([12, 24, 18, 30, 20, 15, 28, 22]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animIntervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      animIntervalRef.current = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 25) + 10,
          Math.floor(Math.random() * 35) + 10,
          Math.floor(Math.random() * 30) + 10,
          Math.floor(Math.random() * 40) + 15,
          Math.floor(Math.random() * 32) + 10,
          Math.floor(Math.random() * 28) + 10,
          Math.floor(Math.random() * 38) + 12,
          Math.floor(Math.random() * 22) + 10,
        ]);
      }, 120);
    } else {
      clearInterval(animIntervalRef.current);
      setAudioLevel([8, 12, 10, 14, 10, 8, 12, 10]);
    }
    return () => clearInterval(animIntervalRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMsg('');
    
    // 1. Try Browser Native Speech Recognition (Works directly on mobile & desktop with zero backend)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = isUrdu ? 'ur-PK' : 'en-PK';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(r => r[0].transcript)
            .join('');
          if (transcript) {
            onTranscriptChange(transcript);
          }
        };

        recognition.onerror = (err) => {
          console.warn('SpeechRecognition note:', err.error);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        mediaRecorderRef.current = { stop: () => recognition.stop() };
        setIsRecording(true);
        return;
      } catch (speechErr) {
        console.warn('Native speech error, falling back to MediaRecorder:', speechErr);
      }
    }

    // 2. Fallback to MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        setIsTranscribing(true);
        try {
          const res = await transcribeAudioFile(audioBlob);
          if (res && res.success && res.text) {
            onTranscriptChange((currentText ? currentText + ' ' : '') + res.text);
          } else {
            setErrorMsg('Audio recorded! You can also type your complaint or select a quick issue below.');
          }
        } catch (err) {
          setErrorMsg('Audio recorded! You can also type your complaint or select a quick issue below.');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setErrorMsg('Could not access microphone. Please allow microphone permissions or tap any quick sample below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const demoVoiceSamples = [
    { label: 'پینے کا پانی (Water Burst)', text: 'ہمارے محلے میں چار دن سے پینے کا صاف پانی نہیں آ رہا، مین پائپ لائن پھٹ چکی ہے۔' },
    { label: 'سڑک میں گڑھے (Road Damage)', text: 'مین چورنگی پر سڑک بہت بری طرح ٹوٹی ہوئی ہے جس سے ٹریفک جام اور حادثات ہو رہے ہیں۔' },
    { label: 'ننگی تاریں (Electric Hazard)', text: 'بجلی کے پول سے ننگی تاریں نیچے لٹک رہی ہیں جس سے کرنٹ لگنے کا شدید خطرہ ہے۔' },
    { label: 'کچرے کا ڈھیر (Waste Dump)', text: 'گلی کے کونے پر کوڑے دان پانچ دنوں سے بھرا پڑا ہے اور شدید بدبو اور بیماریاں پھیل رہی ہیں۔' }
  ];

  return (
    <div className="space-y-3">
      
      {/* Main Voice Recording Container */}
      <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-900 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 ' + (
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-xl ring-4 ring-rose-400/40 scale-105'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/30 hover:scale-105 active:scale-95'
            )}
          >
            {isTranscribing ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                {isRecording ? 'ریکارڈنگ جاری ہے... (Recording)' : isTranscribing ? 'ترجمہ ہو رہا ہے...' : isUrdu ? 'اردو میں بول کر شکایت درج کریں' : 'Record Urdu/English Voice Grievance'}
              </span>
              <span className="bg-emerald-800/80 border border-emerald-700 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Voice Input Engine
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {isRecording ? 'بات مکمل کرنے پر دوبارہ کلک کریں' : 'Click mic to speak freely in Urdu, Roman Urdu, or English'}
            </p>
          </div>
        </div>

        {/* Animated Soundwave Equalizer */}
        <div className="flex items-center gap-1.5 h-10 px-3 bg-emerald-900/60 rounded-xl border border-emerald-800">
          {audioLevel.map((height, i) => (
            <div
              key={i}
              style={{ height: height + 'px' }}
              className={'w-1.5 rounded-full transition-all duration-100 ' + (isRecording ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400')}
            />
          ))}
        </div>

      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Audio Samples */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-900 mb-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isUrdu ? 'فوری آزمائشی آوازیں (Quick Voice Samples):' : 'Instant Pakistani Civic Audio Presets:'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {demoVoiceSamples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onTranscriptChange(sample.text)}
              className="text-left text-xs p-3 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-300 rounded-xl transition text-slate-800 flex items-center justify-between group shadow-xs"
            >
              <span className="font-bold text-emerald-950">{sample.label}</span>
              <Volume2 className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
