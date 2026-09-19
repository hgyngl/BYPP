import tigerEye from "./assets/tiger-eye.png";
import tigerStuffing from "./assets/tiger-stuffed.png";
import tigerFixed from "./assets/tiger-fixed.png";
import elephantEye from "./assets/elephant-eye.png";
import elephantStuffing from "./assets/elephant-stuffed.png";
import elephantFixed from "./assets/elephant-fixed.png";
import horseEye from "./assets/horse-eye.png";
import horseStuffing from "./assets/horse-stuffed.png";
import horseFixed from "./assets/horse-fixed.png";
export const toys = [
  {
    id: "tiger",
    name: "랑이",
    repairThreadId: "yellow",
    images: { eye: tigerEye, stuffing: tigerStuffing, fixed: tigerFixed },
    repairSpot: {
      eye: { top: "16%", left: "61%", width: "45px", height: "45px" },
      stuffing: { top: "50%", left: "28%", width: "16%", height: "12%" }
    }
  },
  {
    id: "elephant",
    name: "콩이",
    repairThreadId: "blue",
    images: { eye: elephantEye, stuffing: elephantStuffing, fixed: elephantFixed },
    repairSpot: {
      eye: { top: "20%", left: "33%", width: "45px", height: "45px" },
      stuffing: { top: "68%", left: "42%", width: "15%", height: "11%" }
    }
  },
  {
    id: "horse",
    name: "몽이",
    repairThreadId: "brown",
    images: { eye: horseEye, stuffing: horseStuffing, fixed: horseFixed },
    repairSpot: {
      eye: { top: "40%", left: "43%", width: "45px", height: "45px" },
      stuffing: { top: "82%", left: "45%", width: "18%", height: "10%" }
    }
  }
];

export const buttonOptions = [
  { id: "round", symbol: "●", name: "동그란 단추" },
  { id: "cross", symbol: "✕", name: "십자 단추" },
  { id: "flower", symbol: "✿", name: "꽃 단추" }
];

// 변경: 사연을 특정 인형에 고정하지 않고 손상 종류별 랜덤 풀에서 매번 섞습니다.
export const storyPools = {
  eye: [
    { title: "눈 단추가 떨어졌어요", story: "좋아하는 그림책을 읽다가 눈 단추가 데굴데굴 굴러갔어요.", request: "다시 또렷하게 볼 수 있도록 도와주세요!", thanks: "이제 그림책의 작은 별도 잘 보여요!" },
    { title: "바람이 너무 세게 불었어요", story: "언덕에서 연을 날리다가 바람에 눈 단추가 툭 떨어졌어요.", request: "튼튼한 새 눈을 달아주실래요?", thanks: "다시 신나게 연을 날릴 수 있어요!" },
    { title: "숨바꼭질을 하다가 그만", story: "커튼 뒤에 꼭꼭 숨다가 실밥에 눈 단추가 걸렸어요.", request: "친구들을 다시 찾을 수 있게 고쳐주세요.", thanks: "이제 술래가 되어도 문제없어요!" },
    { title: "별을 보러 가고 싶어요", story: "밤하늘을 보러 나가려는데 한쪽 눈이 잘 보이지 않아요.", request: "반짝이는 별을 볼 수 있게 도와주세요.", thanks: "별자리가 정말 선명하게 보여요!" },
    { title: "소풍 준비 중이에요", story: "가방을 메다가 끈에 눈 단추가 걸려 빠져버렸어요.", request: "소풍을 떠나기 전에 눈을 달아주세요.", thanks: "이제 도시락도 길도 잘 보여요!" },
    { title: "춤 연습을 너무 열심히 했어요", story: "빙글빙글 돌다가 눈 단추가 멀리 날아갔어요.", request: "다시 무대에 설 수 있도록 고쳐주세요.", thanks: "멋진 춤을 보여드릴게요!" }
  ],
  stuffing: [
    { title: "솜이 터졌어요", story: "놀이터에서 너무 신나게 뛰어놀다가 옆구리가 터졌어요.", request: "포근한 솜을 채우고 꿰매주세요.", thanks: "다시 폭신하고 튼튼해졌어요!" },
    { title: "나뭇가지에 걸렸어요", story: "숲길을 산책하다 작은 가지에 배가 살짝 찢어졌어요.", request: "솜이 더 빠지기 전에 도와주세요.", thanks: "이제 산책도 조심조심 잘할게요!" },
    { title: "너무 꼭 안아줬나 봐요", story: "친구가 반가워서 꼭 안아줬더니 솔기가 톡 벌어졌어요.", request: "다시 포근해질 수 있도록 수선해주세요.", thanks: "따뜻한 포옹을 다시 할 수 있어요!" },
    { title: "쿠션 산에서 굴렀어요", story: "쿠션을 쌓아 만든 산에서 데굴데굴 구르다 솜이 나왔어요.", request: "빈 곳을 채우고 예쁘게 꿰매주세요.", thanks: "다시 데굴데굴 놀 수 있어요!" },
    { title: "여행 가방이 꽉 찼어요", story: "작은 가방에 들어가려다 배 부분이 터지고 말았어요.", request: "여행을 계속할 수 있게 고쳐주세요.", thanks: "이제 편안하게 여행할 수 있어요!" },
    { title: "잠결에 침대에서 떨어졌어요", story: "푹 자다가 바닥으로 톡 떨어져 솔기가 벌어졌어요.", request: "오늘 밤 다시 포근하게 잘 수 있게 해주세요.", thanks: "오늘은 정말 달콤한 꿈을 꿀 것 같아요!" }
  ]
};

export const threadColors = [
  { id: "brown", name: "갈색", color: "#9c5151" },
  { id: "blue", name: "파랑", color: "#44bcfc" },
  { id: "yellow", name: "노랑", color: "#ffd103" }
];
