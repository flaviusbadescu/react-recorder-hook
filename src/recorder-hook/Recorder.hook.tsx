import { useEffect, useRef, useState } from "react";
import { Status, TRecorder } from "./Recorder.types";

export const useRecorderHook = (): TRecorder => {
  const [status, setStatus] = useState(Status.IDLE);
  const [recorder, setRecorder] = useState<MediaRecorder | null>();
  const [url, setUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!recorder) {
      return;
    }

    const blobs: Blob[] = [];
    recorder.ondataavailable = (event: any) => {
      blobs.push(event.data);
    };

    recorder.onstop = () => {
      const url = URL.createObjectURL(new Blob(blobs, { type: "video/webm" }));
      setUrl(url);
    };
  }, [recorder]);

  const startRecording = async (
    audioId?: string,
    videoId?: string,
    webcamRecording = false
  ) => {
    try {
      let mediaRecorder = recorder;
      if (!mediaRecorder) {
        let videoStream = null;

        if (webcamRecording) {
          videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              deviceId: videoId,
            },
          });
        } else {
          videoStream = await navigator.mediaDevices.getDisplayMedia({
            audio: { deviceId: audioId },
            video: true,
          });
        }

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: audioId },
        });

        const stream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        const recorder = new MediaRecorder(stream);
        setRecorder(recorder);
        if (stream && videoRef?.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        mediaRecorder = recorder;
      }
      mediaRecorder.start(1000);
      setStatus(Status.RECORDING);
    } catch (e) {
      console.log(recorder);

      console.log(e);
      resetRecording();
    }
  };

  const pauseRecording = () => {
    if (!recorder) {
      throw new Error("Recorder is not initialized");
    }
    recorder.pause();
    setStatus(Status.PAUSED);
  };

  const resumeRecording = () => {
    if (!recorder) {
      throw new Error("Recorder is not initialized");
    }
    recorder.resume();
    setStatus(Status.RECORDING);
  };

  const stopRecording = () => {
    if (!recorder) {
      throw new Error("Recorder is not initialized");
    }
    setStatus(Status.STOPPED);
    recorder.stream.getTracks().forEach((track: any) => track.stop());
    recorder.stop();
    setRecorder(null);
    if (videoRef?.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

  const resetRecording = () => {
    setUrl(null);
    setStatus(Status.IDLE);
  };

  return {
    status,
    videoRef,
    url,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
};
