import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "@remix-run/react";

/**
 * Blog Lesson Card
 */
type TBlogCardProps = {
  i: string;
  slug: string;
  src: string;
  alt: string;
  date: string;
  title: string;
  category: {
    id: number;
    name: string;
    ja_name: string;
    slug: string;
  };
};

function BlogCard({
  i,
  slug,
  src,
  alt,
  date,
  title,
  category,
}: TBlogCardProps) {
  const d = new Date(date);
  return (
    <Link to={`/blog-lessons/${slug}`} className={`c-blog-card-link ${i}`}>
      <div className="c-blog-card">
        <div className="c-blog-card__img-wrapper">
          <img className="c-blog-card__img" src={`${src}`} alt={alt} />
          <div className="c-blog-card__overlay">
            <div className="c-blog-card__overlay-inner">
              <h3>Let's Learn!</h3>
              <p>記事を読む</p>
              <FaArrowRightLong />
            </div>
          </div>
        </div>
        <div className="c-blog-card__details">
          <div className="c-blog-card__details__top">
            <p>{`${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`}</p>
            <p>[ {category.ja_name} ]</p>
          </div>
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}

/**
 * Staff Rounded Picture Card
 */

type TStaffRoundPicCardProps = {
  url: string;
  src: string;
  alt: string;
  name: string;
  tagline: string;
};

function StaffRoundPicCard({
  url,
  src,
  alt,
  name,
  tagline,
}: TStaffRoundPicCardProps) {
  return (
    <article className="c-staff-card">
      <Link to={url} className="c-staff-card__link">
        <div className="c-staff-card__img-wrapper">
          <img className="c-staff-card__img" src={src} alt={alt} />
          <div className="c-staff-card__overlay">
            <h3>View Details</h3>
            <p>詳細を見る</p>
            <FaArrowRightLong />
          </div>
        </div>
      </Link>
      <div className="c-staff-card__details">
        <h3>{name}</h3>
        <p>{tagline}</p>
      </div>
    </article>
  );
}

/**
 * Numbered Bilingual Horizontal Layout Cards
 */

type TNumberedHorizontalProps = {
  number: string;
  enTitle?: string;
  jaTitle: string;
  text: string;
  src: string | null;
  alt: string | null;
};

function NumberedHorizontalCards({
  number,
  enTitle,
  jaTitle,
  text,
  src,
  alt,
}: TNumberedHorizontalProps) {
  return (
    <article className="c-nh-card">
      <div className="c-nh-card__details">
        <div className="c-nh-card__titles">
          <p>{number}</p>
          {enTitle ? <h4>{enTitle}</h4> : null}
          <p>{jaTitle}</p>
        </div>
        <div className="c-nh-card__text">
          <p>{text}</p>
        </div>
      </div>
      {src && alt ? (
        <div className="c-nh-card__img-wrapper">
          <img src={src} alt={alt} />
        </div>
      ) : null}
    </article>
  );
}
export { BlogCard, StaffRoundPicCard, NumberedHorizontalCards };
