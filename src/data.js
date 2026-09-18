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

    images: {
      eye: tigerEye,
      stuffing: tigerStuffing,
      fixed: tigerFixed
    },

    repairSpot: {
      eye: {
        top: "16%",
        left: "61%",
        width: "45px",
        height: "45px"
      },

      stuffing: {
        top: "50%",
        left: "28%",
        width: "16%",
        height: "12%"
      }
    },

    stories: {
      eye: {
        title: "눈 단추가 떨어졌어요",
        story:
          "제가 좋아하는 그림을 그리기가 어려워요",
        request:
          "제 눈을 다시 달아주실 수 있나요?",
        thanks:
          "다시 그림을 그릴 수 있을 것 같아요!"
      },

      stuffing: {
        title: "솜이 터졌어요",
        story:
          "가려워요",
        request:
          "터진 곳을 고쳐주실 수 있나요?",
        thanks:
          "우와 한결 개운해졌어요!"
      }
    }
  },

  {
    id: "elephant",
    name: "콩이",

    images: {
      eye: elephantEye,
      stuffing: elephantStuffing,
      fixed: elephantFixed
    },

    repairSpot: {
      eye: {
        top: "20%",
        left: "33%",
        width: "45px",
        height: "45px"
      },

      stuffing: {
        top: "68%",
        left: "42%",
        width: "15%",
        height: "11%"
      }
    },

    stories: {
      eye: {
        title: "눈 단추가 떨어졌어요",
        story:
          "새로운 곳으로 항해하려했는데 눈이 잘 안 보여요",
        request:
          "새 눈을 달아주실 수 있나요?",
        thanks:
          "세상을 둘러볼 수 있게 됐어요!"
      },

      stuffing: {
        title: "솜이 터졌어요",
        story:
          "놀이터에서 친구들과 너무 신나게 놀았나봐요",
        request:
          "친구들과 신나게 다시 놀 수 있게 꿰매주실 수 있나요?",
        thanks:
          "다시 튼튼해졌어요!"
      }
    }
  },

  {
    id: "horse",
    name: "몽이",

    images: {
      eye: horseEye,
      stuffing: horseStuffing,
      fixed: horseFixed
    },

    repairSpot: {
      eye: {
        top: "40%",
        left: "43%",
        width: "45px",
        height: "45px"
      },

      stuffing: {
        top: "110%",
        left: "45%",
        width: "18%",
        height: "10%"
      }
    },

    stories: {
      eye: {
        title: "눈 단추가 떨어졌어요",
        story:
          "꽃가루 알러지 때문에 눈을 비비다 그만..",
        request:
          "눈을 다시 달아주실 수 있나요?",
        thanks:
          "다시 잘 보여요!"
      },

      stuffing: {
        title: "솜이 터졌어요",
        story:
          "달리다가 넘어졌어요",
        request:
          "터진 곳을 고쳐주세요.",
        thanks:
          "이제 다시 괜찮아요!"
      }
    }
  }
];

export const buttonOptions = [
  {
    id: "round",
    symbol: "●",
    name: "동그란 단추"
  },
  {
    id: "cross",
    symbol: "✕",
    name: "십자 단추"
  },
  {
    id: "flower",
    symbol: "✿",
    name: "꽃 단추"
  }
];

export const threadColors = [
  {
    id: "brown",
    name: "갈색",
    color: "#9c5151"
  },
  {
    id: "blue",
    name: "파랑",
    color: "#44bcfc"
  },
  {
    id: "yellow",
    name: "노랑",
    color: "#ffd103"
  }
];
