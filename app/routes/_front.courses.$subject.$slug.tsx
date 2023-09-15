import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

/*
 * types
 */

/*
 * server functions
 */

export async function loader({ request, params }: LoaderArgs) {
  try {
    const { subject, slug } = params;
    const apiUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayDetailPage&subject_slug=${subject}&slug=${slug}&fields=*`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error", { cause: response.status });
    }
    const pagesData = await response.json();
    if (!pagesData.items.length) {
      // slug query string returned no page == 404
      throw new Response("Oops sorry we can't seem to find that page", {
        status: 404,
      });
    }
    const data = pagesData.items[0];
    return { data };
  } catch (error) {
    throw new Response("Oops sorry something went wrong", {
      status: 500,
    });
  }
}
/*
 * page function
 */

export default function CourseDetailPage() {
  const { data } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const subject = data.course.subject as "english" | "japanese" | "french";
  const subjectDisplay = data.course.subject_display.split(",");
  const categoryDisplay =
    data.course_category.course_category_display.split(",");
  const levelFromDisplay = data.level_from.level_display.split(",");
  const levelToDisplay = data.level_to.level_display.split(",");
  return (
    <>
      <header>
        <h1>{data.display_title}</h1>
        <img
          src={`${ENV.BASE_BACK_URL}${data.header_image.original.src}`}
          alt={data.header_image.original.alt}
        />
        <p>{data.display_intro}</p>
        <p>
          course subject:{" "}
          {subject === "japanese" ? subjectDisplay[1] : subjectDisplay[2]}
        </p>
        <p>
          course type:{" "}
          {subject === "japanese" ? categoryDisplay[0] : categoryDisplay[1]}
        </p>
        <p>
          course level:{" "}
          {subject === "japanese" ? levelFromDisplay[0] : levelFromDisplay[1]}
          {data.level_to.level_number < 2 ||
          data.level_to.level_number <= data.level_from.level_number
            ? ""
            : subject === "japanese"
            ? ` ~ ${levelToDisplay[0]}`
            : ` ~ ${levelToDisplay[1]}`}
        </p>
      </header>
      <section className="text-container">
        <h2>What skills I will learn</h2>
        <ul>
          {data.course_content_points.map((block) => {
            return block.value.liste.map((item) => (
              <li key={item.list_item.slice(0, 4)}>{item.list_item}</li>
            ));
          })}
        </ul>
      </section>
      <section>
        <h2>Course description</h2>
        {data.course_description.map((block: any) => {
          if (block.type === "rich_text") {
            return (
              <div
                className="text-container"
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.value }}
              />
            );
          } else if (block.type === "text_width_img") {
            return (
              <div key={block.id} className="text-container">
                <figure>
                  <img
                    src={`${ENV.BASE_BACK_URL}${block.value.image.original.src}`}
                    alt={block.value.image.original?.alt}
                  />
                  {block.value?.caption ? (
                    <figcaption>{block.value.caption}</figcaption>
                  ) : null}
                </figure>
              </div>
            );
          } else if (block.type === "youtube") {
            return (
              <div key={block.id} className="container">
                <iframe
                  className={`youtube-iframe ${
                    block.value.short ? "youtube-short" : ""
                  }`}
                  src={`${block.value.src}?modestbranding=1&controls=0&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </section>
      <section>
        <h2>Other interesting courses</h2>
        <div>
          {data.related_courses.length ? (
            data.related_courses.map((item) => {
              const course = item.course;
              return (
                <Link
                  to={`/courses/${course.subject_slug}/${course.slug}`}
                  key={course.id}
                >
                  <div>
                    <img
                      src={`${ENV.BASE_BACK_URL}${course.image.thumbnail.src}`}
                      alt={course.display_title}
                    />
                    <div>
                      <p>{course.subject_slug} course</p>
                      <h3>{course.display_title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>Courses coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
