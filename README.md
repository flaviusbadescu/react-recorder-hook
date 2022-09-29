# react-recorder-hook

Simple screen and webcam recording hook

# install

```
npm install react-recorder-hook
```

or

```
yarn add react-recorder-hook
```

# usage

```
   const {
    pauseRecording,
    startRecording,
    stopRecording,
    resumeRecording,
    resetRecording,
    status,
    url,
    videoRef,
  } = useRecorderHook();
```

```
videoRef is used to display the ongoing stream:
ex:
    <Video
        style={{ border: "1px solid black", width: 640, height: 480 }}
        ref={videoRef}
        muted
        autoPlay
    />

url is used to see the final result.
ex:
    <Video src={url} controls />
```
