import "./VideoPlayer.css";
import { useRef, useState, useEffect } from "react";

const VideoPlayer = () => {
  const src =
    "http://n-22-8.dcs.redcdn.pl/file/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4";
  const sub_src = "/subtitles/subtitles.vtt";

  const videoRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const muteBtn = useRef(null);
  const volumeRange = useRef(null);
  const ccBtn = useRef(null);
  const fsBtn = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [ccClicked, setCcClicked] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    videoRef.current.addEventListener("play", handlePlay);
    videoRef.current.addEventListener("pause", handlePause);
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoRef.current.removeEventListener("play", handlePlay);
      videoRef.current.removeEventListener("pause", handlePause);
      videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      videoRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleTimeChange = (event) => {
    setCurrentTime(event.target.value);
    videoRef.current.currentTime = event.target.value;
  };

  const handleSubtitlesClick = (event) => {
    const textTrc = videoRef.current.textTracks[0];
    textTrc.mode = textTrc.mode === "showing" ? "hidden" : "showing";
    if (ccClicked) {
      setCcClicked(false);
      ccBtn.current.style.color = "white";
    } else {
      setCcClicked(true);
      ccBtn.current.style.color = "#0075ff";
    }
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    videoRef.current.volume = event.target.value;
  };

  const handleFullScreen = () => {
    let el = videoPlayerRef.current;

    if (!fullScreen) {
      el.requestFullscreen();
      fsBtn.current.style.color = "#0075ff";
    }
    if (fullScreen) {
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(err));
      fsBtn.current.style.color = "white";
    }

    setFullScreen(!fullScreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  return (
    <>
      <div className="video-player" ref={videoPlayerRef}>
        <video ref={videoRef}>
          <source src={src} type="video/mp4" />
          <track kind="subtitles" srcLang="en" src={sub_src} mode="hidden" />
        </video>

        <div className="controls">
          <button onClick={handlePlayPauseClick}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="timeline">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              step="1.0"
              value={currentTime}
              onChange={handleTimeChange}
            />
            <span>{formatTime(duration - currentTime)}</span>
          </div>

          <button ref={muteBtn} onClick={handleMuteClick}>
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <input
            className="volume-adjust"
            type="range"
            ref={volumeRange}
            id="volume-range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          ></input>
          
          <button ref={ccBtn} onClick={handleSubtitlesClick}>
            CC
          </button>
          <button ref={fsBtn} onClick={handleFullScreen}>
            [fs]
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
