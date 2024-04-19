/*
 * Simple Image Gallery
 */
type TSimpleImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type TSimpleImageValue = {
  image: {
    id: number;
    title: string;
    original: TSimpleImage;
    medium: TSimpleImage;
    thumbnail: TSimpleImage;
  };
  caption: string;
};
type TSimpleImageBlock = {
  type: string;
  value: TSimpleImageValue;
  id: string;
};

type TSIGProps = {
  images: TSimpleImageBlock[];
  baseUrl: string;
};

function SimpleImageGallery({ images, baseUrl }: TSIGProps) {
  return (
    <div className="g-basic-container">
      <div className="c-gallery">
        {images.map((fig) => {
          return (
            <figure key={fig.id} className="c-gallery__figure">
              <img
                src={`${baseUrl}${fig.value.image.medium.src}`}
                alt={fig.value.image.medium.src}
              />
              {fig.value.caption && (
                <figcaption>{fig.value.caption}</figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export { SimpleImageGallery };
