import { useRef, useState, useContext, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ToggleContext } from "../../../dataContexts/ToggleContext";


function App() {
  const { setIsLoading } = useContext(ToggleContext);
 
  useEffect(() => {
    setIsLoading(false)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    
    {
      command: "reset background colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  return (
    <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <button>Click to Start Listening</button>
        </div>
        <div className="microphone-status">
          {isListening ? "Listening........." : "Click to start Listening"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div className="microphone-result-text">{transcript}</div>
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
export default App;