function DoorScene({ onNext, temperature, temperatureGoal, starCount }) {
  return (
    <section className="scene figmaScene doorScene" aria-label="닫힌 문">
      <div className="figmaStage doorStage">
        <div className="doorHud">
          <div className="starCounter" aria-label={`별 스티커 ${starCount}개`}>
            <span className="starSticker" aria-hidden="true">★</span>
            <strong>{starCount.toLocaleString()}</strong>
          </div>

          <div className="heartTemperature" aria-label={`마음의 온도 ${temperature}도`}>
            <div className="heartTemperatureHeader">
              <strong>마음의 온도</strong>
              <span>{temperature}°C</span>
            </div>
            <div className="thermometer" role="progressbar" aria-valuemin="0" aria-valuemax={temperatureGoal} aria-valuenow={temperature}>
              <span className="thermometerBulb" aria-hidden="true" />
              <span className="thermometerTrack" aria-hidden="true">
                <span className="thermometerFill" style={{ width: `${(temperature / temperatureGoal) * 100}%` }} />
              </span>
            </div>
            <div className="thermometerScale" aria-hidden="true">
              <span>0°</span>
              <span>{temperatureGoal}°</span>
            </div>
          </div>
        </div>

        <button className="closedDoor" type="button" onClick={onNext} aria-label="문 열기">
          <span className="doorSoftHighlight" aria-hidden="true" />
          <span className="doorPlank doorPlankOne" aria-hidden="true" />
          <span className="doorPlank doorPlankTwo" aria-hidden="true" />
          <span className="doorPlank doorPlankThree" aria-hidden="true" />
          <span className="doorBrace doorBraceTop" aria-hidden="true" />
          <span className="doorBrace doorBraceBottom" aria-hidden="true" />
          <span className="doorNameplate" aria-hidden="true">마음 수선소</span>
          <span className="doorKnob" aria-hidden="true" />
        </button>

       
      </div>
    </section>
  );
}

export default DoorScene;
