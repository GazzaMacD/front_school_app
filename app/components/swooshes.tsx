import { brandColors } from "~/common/brandColors";

type TSwooshColors = "brown" | "beige" | "cream" | "white";
type TSwoosh = {
  swooshColor: TSwooshColors;
  backColor: TSwooshColors;
};

function Swoosh1({ swooshColor, backColor }: TSwoosh) {
  return (
    <div className="g-swoosh1" style={{ fill: `${brandColors[backColor]}` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          style={{ fill: `${brandColors[swooshColor]}` }}
          fillOpacity="1"
          d="M0,288L80,256C160,224,320,160,480,154.7C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}

export { Swoosh1 };
