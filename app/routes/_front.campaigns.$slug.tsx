import React from "react";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { BsCurrencyYen, BsInfoCircle } from "react-icons/bs";
import { GiTalk } from "react-icons/gi";
import { RiArticleLine } from "react-icons/ri";
import { FaRegGrinStars } from "react-icons/fa";

import { BASE_API_URL } from "~/common/constants.server";
import { Swoosh1 } from "~/components/swooshes";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  //Get campaign type
  const typeUrl = `${BASE_API_URL}/pages/?slug=${slug}&fields=_,type`;
  const typeRes = await fetch(typeUrl);
  const typeData = await typeRes.json();
  if (!typeData?.items.length) {
    throw new Response("No page available", { status: 404 });
  }
  //Get page
  const type = typeData.items[0].meta.type;
  const pageUrl = `${BASE_API_URL}/pages/?type=${type}&slug=${slug}&fields=*`;
  const pageRes = await fetch(pageUrl);
  const pageData = await pageRes.json();
  if (!pageData?.items.length) {
    throw new Response("No page available", { status: 404 });
  }
  const page = pageData.items[0];
  return json({ page });
}

export default function CampaignDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  return (
    <>
      <SimpleBanner
        colorType={page.color_type}
        nameJa={page.name_ja}
        offer={page.offer}
        tagline={page.tagline}
        startDate={page.start_date}
        endDate={page.end_date}
        additionalDetails={page.additional_details}
      />
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}

type TSimpleBannerProps = {
  colorType: string;
  nameJa: string;
  offer: string;
  tagline: string;
  startDate: string;
  endDate: string;
  additionalDetails: string;
};

function SimpleBanner({
  colorType,
  nameJa,
  offer,
  tagline,
  startDate,
  endDate,
  additionalDetails,
}: TSimpleBannerProps) {
  const period = getPeriodString(startDate, endDate);
  return (
    <>
      <header className="cn-dp-scb-header">
        <div className="cn-dp-scb-header__side">
          <div>
            <h2>Browse our site</h2>
            <article>
              <h4>
                <BsCurrencyYen />
                <Link to="/price-plans">Our price plans</Link>
              </h4>
              <p>
                Explore our ever expanding range of price plans designed to give
                you the best language education for the best value while also
                suiting your particular needs.
              </p>
            </article>
            <article>
              <h4>
                <GiTalk />
                <Link to="/courses">Language courses</Link>
              </h4>
              <p>
                Our spoken english and other english courses designed and taught
                by our multi lingual expert teachers to help you towards
                speaking and communicating with native like natural language.
              </p>
            </article>
            <article>
              <h4>
                <FaRegGrinStars />
                <Link to="/learning-experiences">Learning experiences</Link>
              </h4>
              <p>
                Explore our learning events created to help you learn to speak
                english naturally all while enjoying yourself, meeting new
                people in our community and also learning new things other than
                language.
              </p>
            </article>
            <article>
              <h4>
                <RiArticleLine />
                <Link to="/blog-lessons">Learning Blog</Link>
              </h4>
              <p>
                We love to help our greater english learning community in
                Nagakute, Miyoshi and Eastern Nagoya. Read our blog lessons
                aimed to help everyone in our community speak more fluently and
                naturally.
              </p>
            </article>
            <article>
              <h4>
                <BsInfoCircle />
                <Link to="/about">About Us</Link>
              </h4>
              <p>
                Read about our mission as a company and learn more about all our
                talented, multilingual teachers who have so much experience with
                language learning and teaching.
              </p>
            </article>
          </div>
        </div>
        <div className="cn-dp-scb-header__main">
          <div>
            <p className="cn-dp-scb-header__main__name">{nameJa}</p>
            <p className="cn-dp-scb-header__main__campaign">キャンペーン</p>
            <p className="cn-dp-scb-header__main__offer">{offer}</p>
            <div>
              <p className="cn-dp-scb-header__main__tagline">{tagline}</p>
            </div>
            <p className="cn-dp-scb-header__main__time">期間: {period}</p>
            <Link to="/contact" className="cn-dp-scb-header__main__btn">
              お問い合わせ
            </Link>
          </div>
        </div>
      </header>

      <section className="cn-dp-scb-details">
        <div dangerouslySetInnerHTML={{ __html: additionalDetails }} />
      </section>
    </>
  );
}

/*
 * Helper functions
 */

function getPeriodString(s: string, e: string): string {
  const start = new Date(s);
  const end = new Date(e);
  const startString = `${start.getFullYear()}年${
    start.getMonth() + 1
  }月${start.getDate()}日`;
  const endString = `${end.getFullYear()}年${
    end.getMonth() + 1
  }月${end.getDate()}日`;
  return `${startString} ~ ${endString}`;
}
