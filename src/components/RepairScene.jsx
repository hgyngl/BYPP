import { useEffect, useRef, useState } from "react";
import { threadColors } from "../data";
import Toy from "./Toy";
import buttonToolArt from "../assets/button-tool.png";
import cottonToolArt from "../assets/cotton-tool.png";
import needleToolArt from "../assets/needle-tool.png";
import speechTailArt from "../assets/speech-tail.svg";
import stageArt from "../assets/stage.svg";
import threadDarkArt from "../assets/thread-dark.svg";
import threadLightArt from "../assets/thread-light.svg";
import cottonFillSound from "../assets/sounds/cotton-fill.mp3";
import { playRepairSound } from "../utils/repairSounds";

const SEWING_GUIDES = [
	"M 8 58 C 15 18 35 18 39 48 C 43 78 18 84 20 57 C 22 31 57 25 62 52 C 67 80 43 84 45 56 C 47 28 77 24 92 53",
	"M 9 52 C 18 16 83 14 91 50 C 98 83 31 88 24 57 C 19 31 70 27 76 53 C 82 75 42 79 38 56 C 34 39 58 37 63 53",
	"M 7 67 C 19 18 30 18 39 66 C 47 92 55 14 64 39 C 72 62 75 88 92 36 C 84 69 71 77 58 56 C 45 35 32 88 19 59",
	"M 8 48 C 21 16 44 24 50 50 C 56 78 79 83 92 49 C 78 18 57 21 50 50 C 42 82 20 82 8 48 C 24 39 36 39 50 50 C 64 61 77 61 92 49",
	"M 8 61 C 18 29 34 23 48 44 C 61 65 76 72 92 43 C 77 20 61 28 50 53 C 39 80 22 78 13 54 C 27 45 40 43 53 56 C 66 70 80 66 90 52"
];

function cssValueToPixels(value, size) {
	if (typeof value !== "string") return 0;
	return value.endsWith("%") ? (parseFloat(value) / 100) * size : parseFloat(value);
}

function RepairScene({ toy, damage, onComplete, onBack }) {
	const [step, setStep] = useState("select");
	const [cottonSelected, setCottonSelected] = useState(false);
	const [threadColor, setThreadColor] = useState(threadColors[0]);
	const [buttonDrag, setButtonDrag] = useState({ x: 0, y: 0, dragging: false });
	const [sewingPoints, setSewingPoints] = useState([]);
	const [guidePath, setGuidePath] = useState(SEWING_GUIDES[0]);
	const [isCompleting, setIsCompleting] = useState(false);
	const toySlotRef = useRef(null);
	const buttonDragRef = useRef(null);
	const sewingRef = useRef({ active: false, length: 0, lastPoint: null });
	const guidePathRef = useRef(null);
	const cottonAudioRef = useRef(null);
	const cottonStopTimerRef = useRef(null);
	const lastSewingSoundRef = useRef(0);

	useEffect(() => {
		const cottonAudio = new Audio(cottonFillSound);

		cottonAudio.preload = "auto";
		cottonAudio.volume = 0.7;
		cottonAudioRef.current = cottonAudio;

		return () => {
			if (cottonStopTimerRef.current) {
				window.clearTimeout(cottonStopTimerRef.current);
			}
			cottonAudio.pause();
		};
	}, []);

	const isReady = step === "ready";
	const showStitch = damage === "stuffing" && isReady;
	const showSewingGuide = damage === "stuffing" && step === "sewing";
	const toyVariant = isReady ? "fixed" : damage;
	const stitchStyle = { ...toy.repairSpot.stuffing, color: threadColor.color };
	const repairSpot = toy.repairSpot.stuffing;
	const repairCenter = {
		x: parseFloat(repairSpot.left),
		y: parseFloat(repairSpot.top),
		width: parseFloat(repairSpot.width),
		height: parseFloat(repairSpot.height)
	};
	const handleToyClick = () => {
		if (damage === "stuffing" && step === "select" && cottonSelected) {
			const cottonAudio = cottonAudioRef.current;
			if (cottonAudio) {
				if (cottonStopTimerRef.current) {
					window.clearTimeout(cottonStopTimerRef.current);
				}
				cottonAudio.currentTime = 0;
				cottonAudio.play().catch(() => {});
				cottonStopTimerRef.current = window.setTimeout(() => {
					cottonAudio.pause();
					cottonAudio.currentTime = 0;
					cottonStopTimerRef.current = null;
				}, 1000);
			}
			setStep("stitch");
		}
	};

	const handleNeedleClick = () => {
		if (damage === "stuffing" && step === "stitch") {
			playRepairSound("needle");
			setSewingPoints([]);
			setGuidePath(SEWING_GUIDES[Math.floor(Math.random() * SEWING_GUIDES.length)]);
			setStep("sewing");
		}
	};

	const handleButtonPointerDown = (event) => {
		if (damage !== "eye" || isReady) return;
		event.preventDefault();
		playRepairSound("pickup");
		event.currentTarget.setPointerCapture(event.pointerId);
		buttonDragRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY
		};
		setButtonDrag({ x: 0, y: 0, dragging: true });
	};

	const handleButtonPointerMove = (event) => {
		const drag = buttonDragRef.current;
		if (!drag || drag.pointerId !== event.pointerId) return;
		setButtonDrag({
			x: event.clientX - drag.startX,
			y: event.clientY - drag.startY,
			dragging: true
		});
	};

	const handleButtonPointerUp = (event) => {
		const drag = buttonDragRef.current;
		const slot = toySlotRef.current;
		if (!drag || !slot || drag.pointerId !== event.pointerId) return;

		const rect = slot.getBoundingClientRect();
		const spot = toy.repairSpot.eye;
		const targetX = rect.left + cssValueToPixels(spot.left, rect.width)
			+ cssValueToPixels(spot.width, rect.width) / 2;
		const targetY = rect.top + cssValueToPixels(spot.top, rect.height)
			+ cssValueToPixels(spot.height, rect.height) / 2;
		const distance = Math.hypot(event.clientX - targetX, event.clientY - targetY);
		const dropRadius = Math.max(38, rect.width * 0.16);

		buttonDragRef.current = null;
		if (distance <= dropRadius) {
			playRepairSound("button");
			setStep("ready");
		}
		setButtonDrag({ x: 0, y: 0, dragging: false });
	};

	const pointFromPointer = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		return {
			x: ((event.clientX - rect.left) / rect.width) * 100,
			y: ((event.clientY - rect.top) / rect.height) * 100
		};
	};

	const isPointNearGuide = (point) => {
		const path = guidePathRef.current;
		if (!path) return false;
		const totalLength = path.getTotalLength();
		for (let index = 0; index <= 72; index += 1) {
			const guidePoint = path.getPointAtLength((totalLength * index) / 72);
			if (Math.hypot(point.x - guidePoint.x, point.y - guidePoint.y) <= 12) return true;
		}
		return false;
	};

	const handleSewingPointerDown = (event) => {
		event.preventDefault();
		const point = pointFromPointer(event);
		if (!isPointNearGuide(point)) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		sewingRef.current = { active: true, length: 0, lastPoint: point };
		setSewingPoints([point]);
	};

	const handleSewingPointerMove = (event) => {
		const sewing = sewingRef.current;
		if (!sewing.active) return;
		const point = pointFromPointer(event);
		if (!isPointNearGuide(point)) return;
		const distance = Math.hypot(point.x - sewing.lastPoint.x, point.y - sewing.lastPoint.y);
		if (distance < 2) return;
		sewing.length += Math.min(distance, 8);
		sewing.lastPoint = point;
		setSewingPoints((points) => [...points, point]);
		const now = performance.now();
		if (now - lastSewingSoundRef.current > 85) {
			playRepairSound("stitch");
			lastSewingSoundRef.current = now;
		}
	};

	const handleSewingPointerUp = () => {
		const guideLength = guidePathRef.current?.getTotalLength() ?? 120;
		const completed = sewingRef.current.length >= Math.max(55, guideLength * 0.45);
		sewingRef.current.active = false;
		if (completed) {
			playRepairSound("sewComplete");
			setStep("ready");
		}
	};

	const handleCottonSelect = () => {
		playRepairSound("pickup");
		setCottonSelected(true);
	};

	const handleComplete = () => {
		if (isCompleting) return;
		setIsCompleting(true);
		playRepairSound("complete");
		onComplete();
	};

	const instruction = damage === "eye"
		? isReady
			? "눈 단추를 잘 달았어요. 수선 완료를 눌러 주세요."
			: "단추를 인형의 빈 눈 위치로 드래그해 달아 주세요."
		: step === "select"
			? "먼저 솜을 고른 뒤 인형을 눌러 채워 주세요."
			: step === "stitch"
				? "실 색을 고른 뒤 바늘을 눌러 주세요."
				: step === "sewing"
					? "빨간 점선을 따라 한붓그리기로 꿰매 주세요."
					: "튼튼하게 꿰맸어요. 수선 완료를 눌러 주세요.";

	return (
		<section className={`scene figmaScene repairScene ${isCompleting ? "isCompleting" : ""}`}>
			<div className={`figmaStage repairStage ${showSewingGuide ? "sewingMode" : ""}`}>
				<button className="repairBackButton" type="button" onClick={onBack}>
					<span aria-hidden="true">←</span> 뒤로 가기
				</button>

				<div className="repairSpeech">
					<strong>{toy.name}</strong>
					<span>{instruction}</span>
				</div>
				<img className="repairSpeechTail" src={speechTailArt} alt="" />
				<img className="repairStageShadow" src={stageArt} alt="" />

				<div
					ref={toySlotRef}
					className={`repairToySlot ${cottonSelected || buttonDrag.dragging ? "toyReady" : ""}`}
					onClick={handleToyClick}
					role="button"
					tabIndex={0}
					aria-label={`${toy.name} 수선 대상`}
				>
					<Toy toy={toy} damage={damage} variant={toyVariant} />
					{damage === "eye" && !isReady && (
						<span className="buttonDropTarget" style={toy.repairSpot.eye} aria-hidden="true" />
					)}
					{showStitch && (
						<span className="stitchMark" style={stitchStyle} aria-hidden="true">
							<span /><span /><span />
						</span>
					)}
				</div>

				<div className="repairTools" aria-label="수선 도구">
					<button
						className={`repairTool buttonTool ${buttonDrag.dragging ? "dragging" : ""}`}
						type="button"
						style={{ "--drag-x": `${buttonDrag.x}px`, "--drag-y": `${buttonDrag.y}px` }}
						onPointerDown={handleButtonPointerDown}
						onPointerMove={handleButtonPointerMove}
						onPointerUp={handleButtonPointerUp}
						onPointerCancel={handleButtonPointerUp}
						disabled={damage !== "eye" || isReady}
						aria-label="단추를 인형의 눈으로 드래그"
					>
						<img src={buttonToolArt} alt="" draggable="false" />
					</button>

					<button
						className={`repairTool cottonTool ${cottonSelected ? "selected" : ""}`}
						type="button"
						onClick={handleCottonSelect}
						disabled={damage !== "stuffing" || step !== "select"}
						aria-label="솜 채우기"
					>
						<img src={cottonToolArt} alt="" />
					</button>

					<div className="threadOptions" aria-label="실 색상">
						{threadColors.map((thread) => (
							<button
								className={`threadTool ${threadColor.id === thread.id ? "selected" : ""}`}
								key={thread.id}
								type="button"
								aria-label={thread.name}
								style={{ backgroundColor: thread.color }}
								onClick={() => setThreadColor(thread)}
								disabled={damage !== "stuffing" || step !== "stitch"}
							>
								<img src={thread.id === "blue" ? threadDarkArt : threadLightArt} alt="" />
							</button>
						))}
					</div>

					<button
						className="needleTool"
						type="button"
						onClick={handleNeedleClick}
						disabled={damage !== "stuffing" || step !== "stitch"}
						aria-label="바늘로 꿰매기 시작"
					>
						<img src={needleToolArt} alt="" />
					</button>
				</div>

				{showSewingGuide && (
					<div
						className="sewingFocus"
						style={{
							backgroundImage: `url(${toy.images[damage]})`,
							backgroundPosition: `${repairCenter.x}% ${repairCenter.y}%`
						}}
					>
						<svg
							className="sewingCanvas"
							style={{ color: threadColor.color }}
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							onPointerDown={handleSewingPointerDown}
							onPointerMove={handleSewingPointerMove}
							onPointerUp={handleSewingPointerUp}
							onPointerCancel={handleSewingPointerUp}
							aria-label="확대된 점선을 따라 드래그하여 꿰매기"
						>
							<path ref={guidePathRef} className="sewingGuide" d={guidePath} />
							{sewingPoints.length > 1 && (
								<polyline
									className="sewingTrace"
									points={sewingPoints.map((point) => `${point.x},${point.y}`).join(" ")}
								/>
							)}
						</svg>
					</div>
				)}

				<button className="completeButton" type="button" disabled={!isReady || isCompleting} onClick={handleComplete}>
					수선 완료
				</button>
			</div>
		</section>
	);
}

export default RepairScene;
