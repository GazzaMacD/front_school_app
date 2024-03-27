import { Link } from "@remix-run/react";

import { getDisplay } from "~/common/utils";
import { BsRecord, BsX, BsArrowRightShort } from "react-icons/bs";

/**
 * Class Price Plan Table
 */
type TPriceTableProps = {
  color: "brown" | "beige";
  slug: string;
  titleEn: string;
  titleJa: string;
  duration: number;
  durationUnit: string;
  stdQuantity: number;
  stdQuantityUnit: string;
  maxNum: number;
  isNative: boolean;
  isOnline: boolean;
  isInperson: boolean;
  hasOnlineNotes: boolean;
  bookableOnline: boolean;
  preTaxPrice: string;
  postTaxPrice: string;
  onSale: boolean;
  preSalePreTaxPrice: string | null;
  preSalePostTaxPrice: string | null;
  priceStartDate: string;
  priceEndDate: string;
};
function ClassPricePlanTable({
  color,
  slug,
  titleEn,
  titleJa,
  duration,
  durationUnit,
  stdQuantity,
  stdQuantityUnit,
  maxNum,
  isNative,
  isOnline,
  isInperson,
  hasOnlineNotes,
  bookableOnline,
  preTaxPrice,
  postTaxPrice,
  onSale,
  preSalePreTaxPrice,
  preSalePostTaxPrice,
  priceStartDate,
  priceEndDate,
}: TPriceTableProps) {
  return (
    <div className={`c-pricetable-wrapper ${color}`}>
      {onSale ? (
        <div className="c-pricetable-sale">割引キャンペーン実施中！</div>
      ) : null}
      <table className="c-pricetable">
        <thead>
          <tr className="c-pricetable__heading--en">
            <td colSpan={2}>{titleEn}</td>
          </tr>
          <tr className="c-pricetable__heading--jp">
            <td colSpan={2}>{titleJa}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>料金</td>
            {onSale ? (
              <td>
                <div>¥{preSalePostTaxPrice}</div>
                <div>¥{postTaxPrice}</div>
              </td>
            ) : (
              <td>¥{postTaxPrice}</td>
            )}
          </tr>
          <tr>
            <td>時間</td>
            <td>{`${duration} ${getDisplay(durationUnit, 1)}`}</td>
          </tr>
          <tr>
            <td>頻度</td>
            <td>{`${getDisplay(stdQuantityUnit, 1)}${stdQuantity}回`}</td>
          </tr>
          <tr>
            <td>最大人数</td>
            <td>{maxNum}</td>
          </tr>
          <tr>
            <td>ネイティブ講師</td>
            <td>
              <div>{isNative ? <BsRecord /> : <BsX />}</div>
            </td>
          </tr>
          <tr>
            <td>オンライン受講</td>
            <td>
              <div>{isOnline ? <BsRecord /> : <BsX />}</div>
            </td>
          </tr>
          <tr>
            <td>対面受講</td>
            <td>
              <div>{isInperson ? <BsRecord /> : <BsX />}</div>
            </td>
          </tr>
          <tr>
            <td>レッスンノート</td>
            <td>
              <div>{hasOnlineNotes ? <BsRecord /> : <BsX />}</div>
            </td>
          </tr>
          <tr>
            <td>オンライン予約</td>
            <td>
              <div>{bookableOnline ? <BsRecord /> : <BsX />}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <Link className="c-pricetable__link" to={`/price-plans/${slug}`}>
          詳しく見る
          <BsArrowRightShort />
        </Link>
      </div>
    </div>
  );
}
export { ClassPricePlanTable };
