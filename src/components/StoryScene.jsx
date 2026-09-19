import Toy from "./Toy";
import doorArt from "../assets/door.svg";

function StoryScene({
  toy,
  damage,
  story,
  onNext,
  onHome
}) {
	const handleHome = (event) => {
		event.stopPropagation();
		onHome();
	};

  return (
    <section
      className="scene figmaScene storyScene clickableScene"
      onClick={onNext}
      aria-label={`${toy.name} 인형의 사연`}
    >
      <div className="figmaStage storyStage">
        <button className="storyHomeButton" type="button" onClick={handleHome}>
          <span aria-hidden="true">⌂</span> 홈으로
        </button>

        <img className="openDoorArt" src={doorArt} alt="열린 문" />

        <div className={`storyToy storyToy-${toy.id}`}>
          <Toy toy={toy} damage={damage} />
        </div>

        <div className="storyCard">
          <strong>{toy.name}</strong>
          {/* 변경: 인형과 독립적으로 매번 섞인 랜덤 사연을 표시합니다. */}
          <h2>{story.title}</h2>
          <p>{story.story}</p>
          <p className="storyRequest">“{story.request}”</p>
        </div>

        
      </div>
    </section>
  );
}

export default StoryScene;
