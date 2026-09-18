import { toys } from "../data";
import Toy from "./Toy";

function GratitudeScene({ starCount, onRestart }) {
  return (
    <section className="scene figmaScene gratitudeScene" aria-label="마음의 온도 100도 달성">
      <div className="figmaStage gratitudeStage">
        <div className="gratitudeStarCounter" aria-label={`별 스티커 ${starCount}개`}>
          <span className="starSticker" aria-hidden="true">★</span>
          <strong>{starCount.toLocaleString()}</strong>
          <span className="starPlus">+1</span>
        </div>

        <div className="gratitudeMessage">
          <strong>마음의 온도 100°C!</strong>
          <span>따뜻하게 고쳐줘서 정말 고마워요.</span>
        </div>

        <div className="gratitudeToys" aria-label="인사하는 인형들">
          {toys.map((item, index) => (
            <div className={`gratitudeToy gratitudeToy-${item.id}`} style={{ "--bow-delay": `${index * 130}ms` }} key={item.id}>
              <Toy toy={item} damage="fixed" repaired />
            </div>
          ))}
        </div>

        <p className="gratitudeThanks">꾸벅, 감사합니다!</p>
        <button className="gratitudeButton" type="button" onClick={onRestart}>
          새로운 손님 맞이하기
        </button>
      </div>
    </section>
  );
}

export default GratitudeScene;
