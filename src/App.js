import "./App.css";
import VideoPlayer from "./components/VideoPlayer";


function App() {
  const src =
  "http://n-22-8.dcs.redcdn.pl/file/o2/atendesoftware/portal/video/atendesoftware/atendesoftware2.mp4";
  return (
    <div className="App">
      <h1>Awesome Video Player</h1>
      <VideoPlayer className="video-player" />
    </div>
  );
}

export default App;
