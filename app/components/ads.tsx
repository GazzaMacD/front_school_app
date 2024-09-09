import { Link } from "@remix-run/react";
import { getJapaneseDurationString } from "~/common/utils";
import { FaArrowRightLong } from "react-icons/fa6";

type TSimpleBannerCampaignAdd = {
  slug: string;
  colorType: string;
  nameJa: string;
  offer: string;
  startDate: string;
  endDate: string;
};

function SimpleBannerCampaignAdd({
  slug,
  colorType,
  nameJa,
  offer,
  startDate,
  endDate,
}: TSimpleBannerCampaignAdd) {
  const duration = getJapaneseDurationString(startDate, endDate);
  return (
    <div className={`c-cmpa-sb-banner ${colorType}`}>
      <h4 className={`c-cmpa-sb-banner__name ${colorType}`}>
        {nameJa}
        <span>キャンペーン</span>
      </h4>
      <p className={`c-cmpa-sb-banner__offer ${colorType}`}>{offer}</p>
      <p className={`c-cmpa-sb-banner__duration ${colorType}`}>
        期間: {duration}
      </p>
      <Link
        to={`/campaigns/${slug}`}
        className={`c-cmpa-sb-banner__link ${colorType}`}
      >
        詳細はこちら
        <FaArrowRightLong />
      </Link>
    </div>
  );
}

export { SimpleBannerCampaignAdd };
