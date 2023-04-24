import "../App.css";
import { useRef, useState, useEffect } from "react";
import { sub } from "../formatSubtitles";

const subData = sub;
console.log(subData);

const VideoPlayer = () => {
  const src =
    "http://n-22-8.dcs.redcdn.pl/file/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4";
  const sub_src = "subtitles.vtt";
  const videoRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const muteBtn = useRef(null);
  const volumeRange = useRef(null);
  const subtitles = document.getElementById("subtitles");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [ccOn, setCcIsOn] = useState(false);
  //   const [subtitles, setSubtitles] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // subtitles.addEventListener("click", handleCC);
    videoRef.current.addEventListener("play", handlePlay);
    videoRef.current.addEventListener("pause", handlePause);
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    // volumeContainer.current.addEventListener("hoover", function () {
    //   volumeRange.current.style.display = "block";
    // });

    // volumeContainer.current.addEventListener("blur", function () {
    //   volumeRange.current.style.display = "none";
    // });

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
    // let now = new Date(videoRef.current.currentTime * 1000).toISOString().substring(11, 16)
    // now = "00:" + now + ".100";
    // let lineToPrint;
    // if (ccOn) {
    //   lineToPrint = subData.find(
    //     (time) =>
    //       time.start <= now &&
    //       time.stop > now
    //   );
    // }
    // console.log(now)
    // if (lineToPrint && lineToPrint.text !== subtitles) {
    //   setSubtitles(lineToPrint.text);
    // } else if (!lineToPrint) {
    //   setSubtitles("");
    // }
  };
  const handleCC = () => {};

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

  const handleSubtitlesClick = () => {
    setCcIsOn(!ccOn);
    for (let i = 0; i < videoRef.textTracks.length; i++) {
      videoRef.textTracks[i].mode = "hidden";
    }
    console.log("csIsOn: " + ccOn);
    let subtitlesMenu;
    if (videoRef.textTracks) {
      const df = document.createDocumentFragment();
      const subtitlesMenu = df.appendChild(document.createElement("ul"));
      subtitlesMenu.className = "subtitles-menu";
      subtitlesMenu.appendChild(createMenuItem("subtitles-off", "", "Off"));
      for (let i = 0; i < videoRef.textTracks.length; i++) {
        subtitlesMenu.appendChild(
          createMenuItem(
            `subtitles-${videoRef.textTracks[i].language}`,
            videoRef.textTracks[i].language,
            videoRef.textTracks[i].label
          )
        );
      }
      videoContainer.appendChild(subtitlesMenu);
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
    }
    if (fullScreen) {
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(err));
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
          <track
            label="Poland"
            kind="subtitles"
            srclang="pl"
            src={sub_src}
            default
          />
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
          {/* <div ref={volumeContainer} id="volume-container"> */}
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
          {/* </div> */}
          {/* <input className="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={()=>{setVolume(value)}}
          /> */}
          <button id="subtitles" type="button" data-state="subtitles">
            CC
          </button>

          <button onClick={handleFullScreen}>[fs]</button>
        </div>
      </div>
      {ccOn ? <div className="subtitle">{subtitles}Hello</div> : <></>}
    </>
  );
};

export default VideoPlayer;
