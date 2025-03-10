import React, { useEffect, useRef, useState } from "react";
import cover from "../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export default function MainLayout() {
  const songs = [
    {
      title: "Dreams pt. I",
      artist: "Lost Sky",
      src: "/music/Dreams pt. I - Lost Sky.mp3",
      cover: "/images/dreams.jpg",
    },
    {
      title: "Attention",
      artist: "Charlie Puth",
      src: "/music/Attention - Charlie Puth.mp3",
      cover: "/images/attention.jpg",
    },
    {
      title: "Bittersweet",
      artist: "Ellie Goulding",
      src: "/music/Bittersweet - Ellie Goulding.mp3",
      cover: "/images/bittersweet.jpg",
    },
    {
      title: "By Your Side (feat. RAYE)",
      artist: "Jonas Blue",
      src: "/music/By Your Side (feat. RAYE) - Jonas Blue.mp3",
      cover: "/images/by your side.jpg",
    },
    {
      title: "Clarity (feat. Foxes)",
      artist: "Zedd",
      src: "/music/Clarity (feat. Foxes) - Zedd.mp3",
      cover: "/images/clarity.jpg",
    },
  ];

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(0);

  // Play / Pause functionality
  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle song change (Next / Previous)
  const nextSong = () => {
    const newIndex = (currentSong + 1) % songs.length;
    setCurrentSong(newIndex);
  };

  const prevSong = () => {
    const newIndex = (currentSong - 1 + songs.length) % songs.length;
    setCurrentSong(newIndex);
  };

  // Track progress and duration
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // Reset progress and play when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSong].src;
      audioRef.current.load();
      setProgress(0);
      setDuration(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  // Seek functionality
  const handleSeek = (e) => {
    const newTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  // Format time helper
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full max-w-[450px] mx-auto min-h-screen px-5 py-3 bg-gradient-to-t from-purple-200 to-white">
      {/* Cover Image */}
      <div className="flex items-center justify-center mt-10 mx-auto w-[350px] h-[350px]">
        <img
          src={songs[currentSong].cover}
          alt="cover"
          className={`rounded-lg transition-all duration-300 ease-in-out ${
            isPlaying
              ? "w-[320px] h-[320px] shadow-2xl shadow-purple-300"
              : "w-[280px] h-[280px] shadow-md shadow-gray-300"
          }`}
        />
      </div>

      {/* Song Title & Artist */}
      <div className="flex flex-col mt-5 text-center">
        <h1 className="text-2xl font-bold w-full ">
          {songs[currentSong].title}
        </h1>
        <span className="text-xl">{songs[currentSong].artist}</span>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={songs[currentSong].src}></audio>

      {/* Progress Bar */}
      <div
        className="w-full max-w-[300px] mx-auto bg-gray-700 rounded-md h-3 cursor-pointer mt-4 overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-purple-500 rounded"
          style={{ width: `${(progress / duration) * 100}%` }}
        ></div>
      </div>

      {/* Time Display */}
      <div className="w-full max-w-[300px] mx-auto flex items-center justify-between mt-2">
        <span className="text-sm">{formatTime(progress)}</span>
        <span className="text-sm">{formatTime(duration)}</span>
      </div>

      {/* Player Controls */}
      <div className="w-full max-w-[300px] mx-auto flex items-center justify-between mt-4">
        <FontAwesomeIcon
          className="text-5xl cursor-pointer hover:text-purple-700 transition"
          icon={faBackwardStep}
          onClick={prevSong}
        />
        <div
          className="w-[80px] h-[80px] bg-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer"
          onClick={playPause}
        >
          <FontAwesomeIcon
            className="text-3xl"
            icon={isPlaying ? faPause : faPlay}
          />
        </div>
        <FontAwesomeIcon
          className="text-5xl cursor-pointer hover:text-purple-700 transition"
          icon={faForwardStep}
          onClick={nextSong}
        />
      </div>
    </div>
  );
}
