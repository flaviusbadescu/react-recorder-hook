import { RefObject } from "react";

export enum Status {
  RECORDING,
  PAUSED,
  IDLE,
  ERROR,
  STOPPED,
  PERMISSION_REQUESTED,
}

export type TRecorder = {
  status: Status;
  url: string | null;
  videoRef: RefObject<HTMLVideoElement> | null;
  startRecording: (audioId?: string, videoId?: string) => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
};
