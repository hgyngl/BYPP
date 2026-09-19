import Toy from "./Toy";
import speechTailArt from "../assets/speech-tail.svg";
import stageArt from "../assets/stage.svg";

function DoneRepair({ toy, story, onRestart }) {
  return (
    <section className="scene figmaScene doneScene" aria-label="수선 완료">
      <div className="figmaStage doneStage">
        <div className="doneSpeech">
          <strong>고마워요!</strong>
          {/* 변경: 선택된 랜덤 사연에 맞는 감사 인사를 이어서 보여줍니다. */}
          <span>{story?.thanks ?? "제가 꼭 안아 드릴게요"}</span>
        </div>
        <img className="doneSpeechTail" src={speechTailArt} alt="" />
        <img className="doneStageShadow" src={stageArt} alt="" />

        <div className="doneToySlot" aria-label={`${toy.name} 수선 완료`}>
          <Toy toy={toy} damage="fixed" repaired />
        </div>

        <button className="restartButton" type="button" onClick={onRestart}>
          처음부터
        </button>
      </div>
    </section>
  );
}

export default DoneRepair;
