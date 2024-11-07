import { useCarousel } from "nuka-carousel";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Arrows
function CustomArrows() {
  const { currentPage, totalPages, wrapMode, goBack, goForward } =
    useCarousel();

  const allowWrap = wrapMode === "wrap";
  const enablePrevNavButton = allowWrap || currentPage > 0;
  const enableNextNavButton = allowWrap || currentPage < totalPages - 1;

  const prevNavClassName = `c-carousel-btn ${
    enablePrevNavButton ? "" : "inactive"
  }`;

  const nextNavClassName = `c-carousel-btn ${
    enableNextNavButton ? "" : "inactive"
  }`;

  return (
    <div className="c-carousel-controls">
      <button className={prevNavClassName} onClick={goBack}>
        <FaArrowLeft />
      </button>
      <button className={nextNavClassName} onClick={goForward}>
        <FaArrowRight />
      </button>
    </div>
  );
}

export { CustomArrows };
