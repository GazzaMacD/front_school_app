import React from "react";

import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { Fragment } from "react";
import { getDisplay } from "~/common/utils";

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=products.ClassPricesListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=products.ClassPricesDetailPage&fields=title,display_title,class_service`;
    const urls = [lPageUrl, dPageUrl];
    const [lPage, dPage] = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then(async (res) => {
            return {
              data: await res.json(),
              status: res.status,
              ok: res.ok,
              url: url,
            };
          })
          .catch((error) => ({ error, url }))
      )
    );
    if (
      !lPage.ok ||
      !dPage.ok ||
      !lPage.data.items.length ||
      !dPage.data.items.length
    ) {
      throw new Response("Sorry, 404", { status: 404 });
    }
    const privateClasses = [];
    const regularClasses = [];
    dPage.data.items.forEach((page) => {
      if (page.class_service.class_type === "private") {
        privateClasses.push(page);
      }
      if (page.class_service.class_type === "regular") {
        regularClasses.push(page);
      }
    });
    // sort pages into private or regular
    return json({
      listPage: lPage.data.items[0],
      privateClasses,
      regularClasses,
    });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function ClassPricesListPage() {
  const {
    listPage: lp,
    privateClasses: pc,
    regularClasses: rc,
  } = useLoaderData<typeof loader>();
  return (
    <div>
      <header>
        <hgroup>
          <h1>
            <span>{lp.title} </span>
            {lp.display_title}
          </h1>
          <p>{lp.display_tagline}</p>
        </hgroup>
        <div dangerouslySetInnerHTML={{ __html: lp.intro }} />
        <section>
          <hgroup>
            <h2>
              <span>Private Classes </span>
              {lp.private_title}
            </h2>
            <p>{lp.private_tagline}</p>
          </hgroup>
          <div dangerouslySetInnerHTML={{ __html: lp.private_intro }} />
          <div>
            <PriceTable classes={pc} />
          </div>
        </section>
        <section>
          <hgroup>
            <h2>
              <span>Regular Classes </span>
              {lp.regular_title}
            </h2>
            <p>{lp.regular_tagline}</p>
          </hgroup>
          <div dangerouslySetInnerHTML={{ __html: lp.regular_intro }} />
          <div>
            <PriceTable classes={rc} />
          </div>
        </section>
      </header>
    </div>
  );
}

/*
 * Components and functions
 */

function PriceTable({ classes }) {
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
    </table>
  );
}

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
