import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "@remix-run/react";

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
    <Link to={`/blog-lessons/${slug}`} className={`g-blog-card-link ${i}`}>
      <div className="g-blog-card">
        <div className="g-blog-card__img-wrapper">
          <img className="g-blog-card__img" src={`${src}`} alt={alt} />
          <div className="g-blog-card__overlay">
            <div className="g-blog-card__overlay-inner">
              <h3>Let's Learn!</h3>
              <p>記事を読む</p>
              <FaArrowRightLong />
            </div>
          </div>
        </div>
        <div className="g-blog-card__details">
          <div className="g-blog-card__details__top">
            <p>{`${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`}</p>
            <p>
              <Link to={`/blog-lessons?category=${category.ja_name}`}>
                [ {category.ja_name} ]
              </Link>
            </p>
          </div>
          <h3>{title}</h3>
        </div>
      </div>
    </Link>
  );
}

export { BlogCard };
