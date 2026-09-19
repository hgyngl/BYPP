import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import DoorScene from "./components/DoorScene";
import RepairScene from "./components/RepairScene";
import StoryScene from "./components/StoryScene";
import DoneRepair from "./components/DoneRepair";
import GratitudeScene from "./components/GratitudeScene";

import { storyPools, toys } from "./data";
import { playRepairSound } from "./utils/repairSounds";
import { setBackgroundMusicVolume, startBackgroundMusic } from "./utils/cozyBackgroundMusic";

// 디버깅할 때만 값을 지정하세요.
// toy: "horse" | "elephant" | "tiger", damage: "eye" | "stuffing"
const DEBUG_TOY_ID = null;
const DEBUG_DAMAGE = null;
// temperature: 0 ~ 45. 40으로 설정하면 다음 수선에서 45도 보상을 확인할 수 있습니다.
const DEBUG_HEART_TEMPERATURE = 40;
const STAR_STORAGE_KEY = "dollRepairStarCountV2";
const HEART_TEMPERATURE_GOAL = 45;

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

function App() {
  const [scene, setScene] = useState("door");
  const [toy, setToy] = useState(null);
  const [damage, setDamage] = useState(null);
  const [story, setStory] = useState(null);
  const [heartTemperature, setHeartTemperature] = useState(() => {
    const initialTemperature = DEBUG_HEART_TEMPERATURE ?? 0;
    return Math.min(HEART_TEMPERATURE_GOAL, Math.max(0, initialTemperature));
  });
  const [starCount, setStarCount] = useState(() => {
    const savedCount = Number.parseInt(localStorage.getItem(STAR_STORAGE_KEY) ?? "0", 10);
    return Number.isFinite(savedCount) ? Math.min(99999, Math.max(0, savedCount)) : 0;
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const savedVolume = Number.parseFloat(localStorage.getItem("dollRepairMusicVolume") ?? "0.22");
    return Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.22;
  });
  const initialMusicVolume = useRef(musicVolume);

  const createCustomer = useCallback(() => {
    const newToy = DEBUG_TOY_ID
      ? toys.find((item) => item.id === DEBUG_TOY_ID) ?? randomItem(toys)
      : randomItem(toys);

    const newDamage = DEBUG_DAMAGE ?? randomItem(["eye", "stuffing"]);
    const newStory = randomItem(storyPools[newDamage]);

    setToy(newToy);
    setDamage(newDamage);
    setStory(newStory);
  }, []);

  const openDoor = useCallback(() => {
    playRepairSound("doorClick");
    if (DEBUG_HEART_TEMPERATURE !== null) {
      setHeartTemperature(Math.min(HEART_TEMPERATURE_GOAL, Math.max(0, DEBUG_HEART_TEMPERATURE)));
    }
    createCustomer();
    setScene("story");
  }, [createCustomer]);

  const startRepair = useCallback(() => {
    setScene("repair");
  }, []);

  const returnToStory = useCallback(() => {
    setScene("story");
  }, []);

  const finishRepair = useCallback(() => {
    if (heartTemperature >= HEART_TEMPERATURE_GOAL - 5) {
      setHeartTemperature(0);
      setStarCount((count) => Math.min(99999, count + 1));
      setScene("gratitude");
      return;
    }

    setHeartTemperature(Math.min(HEART_TEMPERATURE_GOAL, heartTemperature + 5));
    setScene("done");
  }, [heartTemperature]);

  const restart = useCallback(() => {
    setToy(null);
    setDamage(null);
    setStory(null);
    setScene("door");
  }, []);

  useEffect(() => {
    localStorage.setItem(STAR_STORAGE_KEY, String(starCount));
  }, [starCount]);

  useEffect(() => {
    const beginMusic = () => startBackgroundMusic(initialMusicVolume.current);
    window.addEventListener("pointerdown", beginMusic, { once: true });
    window.addEventListener("keydown", beginMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", beginMusic);
      window.removeEventListener("keydown", beginMusic);
    };
  }, []);

  useEffect(() => {
    setBackgroundMusicVolume(musicVolume);
    localStorage.setItem("dollRepairMusicVolume", String(musicVolume));
  }, [musicVolume]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.code !== "Enter" &&
        event.code !== "Space"
      ) {
        return;
      }

      event.preventDefault();

      if (scene === "door") {
        openDoor();
        return;
      }

      if (scene === "story") {
        startRepair();
      }

      if (scene === "done" || scene === "gratitude") {
        restart();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [openDoor, restart, scene, startRepair]);

  return (
    <main className="game">

      {scene !== "gratitude" && (
        <label className="musicVolumeControl">
          <span aria-hidden="true">♪</span>
          <span className="musicVolumeLabel">배경 음악</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(musicVolume * 100)}
            onChange={(event) => {
              const nextVolume = Number(event.target.value) / 100;
              startBackgroundMusic(nextVolume);
              setMusicVolume(nextVolume);
            }}
            aria-label="배경 음악 크기"
          />
          <output>{Math.round(musicVolume * 100)}%</output>
        </label>
      )}

      {scene === "door" && (
        <DoorScene
          onNext={openDoor}
          temperature={heartTemperature}
          temperatureGoal={HEART_TEMPERATURE_GOAL}
          starCount={starCount}
        />
      )}

      {scene === "story" &&
        toy &&
        damage && (
          <StoryScene
            toy={toy}
            damage={damage}
            story={story}
            onNext={startRepair}
            onHome={restart}
          />
        )}

      {scene === "repair" && (
        toy && damage && (
          <RepairScene
            toy={toy}
            damage={damage}
            onComplete={finishRepair}
            onBack={returnToStory}
          />
        )
      )}

      {scene === "done" && toy && damage && (
        <DoneRepair
          toy={toy}
          story={story}
          onRestart={restart}
        />
      )}

      {scene === "gratitude" && (
        <GratitudeScene
          starCount={starCount}
          temperatureGoal={HEART_TEMPERATURE_GOAL}
          onRestart={restart}
        />
      )}

    </main>
  );
}

export default App;
