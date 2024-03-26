import { Link } from "@remix-run/react";

import { getDisplay } from "~/common/utils";
import { BsRecord, BsX, BsArrowRightShort } from "react-icons/bs";
/*
function getTableRows(classes) {
  const rows = {
    sale: [{ id: 0, title: "On Sale" }],
    title: [{ id: 0, title: "" }],
    price: [{ id: 0, title: "Price" }],
    classLength: [{ id: 0, title: "Class Length" }],
    quantity: [{ id: 0, title: "Frequency" }],
    peopleNumbers: [{ id: 0, title: "Max People" }],
    isNative: [{ id: 0, title: "Native, Multilingual Teacher" }],
    isOnline: [{ id: 0, title: "Can take online" }],
    isInperson: [{ id: 0, title: "Can take inperson" }],
    hasOnlineNotes: [{ id: 0, title: "Has Online Notes" }],
    canBookOnline: [{ id: 0, title: "Can Book Online" }],
    slug: [{ id: 0, title: "Find out more" }],
  };
  classes.forEach((c, i) => {
    const cs = c.class_service;
    const pr = c.class_service.price_info;
    rows.sale.push({
      id: i + 1,
      onSale: pr.is_sale,
    });
    rows.title.push({
      id: i + 1,
      title: c.title,
      display_title: c.display_title,
    });
    rows.price.push({
      id: i + 1,
      onSale: pr.is_sale,
      preSalePrice: pr.before_sale_posttax_price,
      price: pr.posttax_price,
    });
    rows.classLength.push({
      id: i + 1,
      length: cs.length,
      unit: cs.length_unit,
    });
    rows.quantity.push({
      id: i + 1,
      quantity: cs.quantity,
      unit: cs.quantity_unit,
    });
    rows.peopleNumbers.push({
      id: i + 1,
      min: cs.min_num,
      max: cs.max_num,
    });
    rows.isNative.push({
      id: i + 1,
      val: cs.is_online,
    });
    rows.isOnline.push({
      id: i + 1,
      val: cs.is_online,
    });
    rows.isInperson.push({
      id: i + 1,
      val: cs.is_inperson,
    });
    rows.hasOnlineNotes.push({
      id: i + 1,
      val: cs.has_onlinenotes,
    });
    rows.canBookOnline.push({
      id: i + 1,
      val: cs.bookable_online,
    });
    rows.slug.push({
      id: i + 1,
      val: c.meta.slug,
    });
  });
  return rows;
}

function PriceTable({ classes, hasLink }) {
  const rows = getTableRows(classes);
  return (
    <table>
      <tr>
        {rows.sale.map((c, i) => {
          if (i === 0) {
            return <th key={c.id} className="side-header"></th>;
          }
          return c.onSale ? (
            <td key={c.id} className="l">
              On Sale!
            </td>
          ) : (
            <td key={c.id} className="l"></td>
          );
        })}
      </tr>
      <tr>
        {rows.title.map((c, i) => {
          if (i === 0) {
            return <th key={c.id} className="side-header"></th>;
          }
          return (
            <td key={c.id} className="l">
              <div>{c.title}</div>
              {c.display_title}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.price.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return c.onSale ? (
            <td className="l" key={c.id}>
              <div>
                <s>￥{c.preSalePrice}</s>
              </div>
              ￥{c.price}
            </td>
          ) : (
            <td key={c.id} className="l">
              ￥{c.price}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.classLength.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.length}
              {getDisplay(c.unit, 1)}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.quantity.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.quantity}回/{getDisplay(c.unit, 1)}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.peopleNumbers.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.max}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.isNative.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.val ? "O" : "X"}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.isOnline.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.val ? "O" : "X"}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.isInperson.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.val ? "O" : "X"}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.hasOnlineNotes.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.val ? "O" : "X"}
            </td>
          );
        })}
      </tr>
      <tr>
        {rows.canBookOnline.map((c, i) => {
          if (i === 0) {
            return (
              <th key={c.id} className="side-header">
                {c.title}
              </th>
            );
          }
          return (
            <td key={c.id} className="l">
              {c.val ? "O" : "X"}
            </td>
          );
        })}
      </tr>
      {hasLink && (
        <tr>
          {rows.slug.map((c, i) => {
            if (i === 0) {
              return (
                <th key={c.id} className="side-header">
                  {c.title}
                </th>
              );
            }
            return (
              <td key={c.id} className="l">
                <Link to={`/class-prices/${c.val}`}>Details</Link>
              </td>
            );
          })}
        </tr>
      )}
    </table>
  );
}
*/
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
/*
"price_plan": {
  "id": 18,
  "slug": "private-online-class",
  "title": "Private Online Class",
  "display_title": "オンラインプライベート",
  "length": 50,
  "length_unit": "Minutes,分",
  "quantity": 4,
  "quantity_unit": "Month,月",
  "max_num": 1,
  "is_native": true,
  "is_online": true,
  "is_inperson": false,
  "has_onlinenotes": true,
  "bookable_online": true,
  "price_info": {
      "name": "2019 Base Price",
      "display_name": "Please change this",
      "pretax_price": "3500",
      "posttax_price": "3850",
      "is_sale": false,
      "start_date": "2018-12-01T00:00:00Z",
      "is_limited_sale": false,
      "before_sale_pretax_price": "None",
      "before_sale_posttax_price": null,
      "end_date": null
  }
}
*/
