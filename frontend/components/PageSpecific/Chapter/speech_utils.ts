import { useEffect, useState } from "react";

const useSpeechSynthesis = ({ onEnd }) => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);

  const processVoices = (voiceOptions) => {
    setVoices(voiceOptions);
  };

  const getVoices = () => {
    // Firefox seems to have voices upfront and never calls the
    // voiceschanged event
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voiceOptions = window.speechSynthesis.getVoices();
      processVoices(voiceOptions);
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
  }, []);

  const speak = async (args = {}) => {
    //@ts-ignore
    const { voice = null, text = "", rate = 1, pitch = 1, volume = 1 } = args;
    if (!supported) return;
    setSpeaking(true);
    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    await window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  const pause = () => {
    if (!supported) return;
    setPaused(true);
    window.speechSynthesis.pause();
  };

  const resume = () => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
    paused,
    pause,
    resume,
  };
};

export default useSpeechSynthesis;
