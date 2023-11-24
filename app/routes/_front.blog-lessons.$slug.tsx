import { redirect, json } from "@remix-run/node";
import React from "react";
import { BASE_API_URL } from "~/common/constants.server";
import { useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils.server";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { useRouteError, isRouteErrorResponse, Link } from "@remix-run/react";

/*types */
import type { LoaderArgs } from "@remix-run/node";
import type {
  TWagBasicImage,
  TWagListAllBase,
  TBaseDetailPage,
} from "~/common/types";
import { getGlobalEnv } from "~/common/utils";

type TLessonDetailOptions = {
  jp_title: string;
  published_date: string;
  header_image: TWagBasicImage;
};

type TLessonsPreview = TBaseDetailPage & {
  jp_title: string;
};

type TLesson = TListPageItemAllMeta & {
  jp_title: string;
};

type TLessons = TBaseListPage & {
  items: TLesson[];
};
type TArrayAnswers = {
  id: number;
  correct: boolean;
  text: string;
}[];
type TMCQuestion = {
  questionNumber: number;
  question: string;
  answers: TArrayAnswers;
};
type TMCQuestionProps = TMCQuestion & {
  handleClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    correct: boolean,
    questionNumber: number,
    question: string
  ) => void;
};

type TMCValue = {
  title: string;
  intro: string;
  questions: TMCQuestion[];
};
type TMCQuestionsProps = {
  value: TMCValue;
};
/*
 * helper functions
 */
function shuffleQuestions(questionsArray: TArrayQuestions): TArrayQuestions {
  const array = [...questionsArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getAnswers(questionsArray: TMCQuestion[]) {
  return questionsArray.map((question) => {
    const answer = question.answers.filter((answer) => answer.correct);
    return {
      questionNumber: question.questionNumber,
      question: question.question,
      answer: answer.length
        ? answer[0].text
        : "sorry no answer provided, must be an error",
    };
  });
}

function multipleChoiceCreator(data) {
  if (data.lesson_content.some((block) => block.type === "mc_questions")) {
    const lessonContentCpy = [...data.lesson_content].map((block) => {
      if (block.type === "mc_questions") {
        const newQuestions = block.value.questions.map((question, i) => {
          const newQuestion = {
            questionNumber: i + 1,
            question: question.question,
            answers: shuffleQuestions([
              {
                id: 1,
                correct: true,
                text: question.correct_answer,
              },
              {
                id: 2,
                correct: false,
                text: question.incorrect_answer1,
              },
              {
                id: 3,
                correct: false,
                text: question.incorrect_answer2,
              },
            ]),
          };
          return newQuestion;
        });
        const newBlock = {
          type: block.type,
          value: {
            title: block.value.title,
            intro: block.value.intro,
            questions: newQuestions,
          },
          id: block.id,
        };
        return newBlock;
      }
      return block;
    });
    data.lesson_content = lessonContentCpy;
    return data;
  }
  //no change if no multiple choice questions
  return data;
}

/*
 * Serverside functions
 */

export async function loader({ request, params }: LoaderArgs) {
  //handle previews
  const previewResponse = await handlePreview<TLessonsPreview>(request);
  if (previewResponse.isPreview && previewResponse.data) {
    return json({ data: previewResponse.data });
  }
  //NOTE : deal with preview errrors here
  try {
    const { slug } = params;
    if (!slug) {
      throw new Response("Oops that's a 404", { status: 404 });
    }
    const apiUrl = `${BASE_API_URL}/pages/?type=lessons.LessonDetailPage&slug=${slug}&fields=*`;
    console.log(apiUrl);
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (!res.ok || !data.items.length) {
      throw new Response("Oops that's a 404", { status: 404 });
    }
    let page = data.items[0];
    page = multipleChoiceCreator(page);
    return json({ page });
  } catch (error) {
    console.error(error);
    throw new Response("Oops sorry something went wrong", { status: 500 });
  }
} //loader

/*
 * client side code
 */
export default function LessonsDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const pubDate = new Date(page.published_date);
  return (
    <>
      <div className="l-header">
        <header className="container">
          <h1 className="l-header__title">{page.display_title}</h1>
          <p className="l-header__intro">{page.display_tagline}</p>
          <div className="l-header__info">
            <div className="l-header__author">
              <Link to={`/staff/${page.author.slug}`}>
                <img
                  src={`${ENV.BASE_BACK_URL}${page.author.image.thumbnail.src}`}
                  alt={page.author.image.thumbnail.alt}
                />
              </Link>
              <p>
                By{" "}
                <Link to={`/staff/${page.author.slug}`}>
                  {page.author.name}
                </Link>
              </p>
            </div>
            <div className="l-header__date">
              <AiOutlineCalendar />
              <p>
                {" "}
                {`${pubDate.getFullYear()}・${
                  pubDate.getMonth() + 1
                }・${pubDate.getDate()}`}
              </p>
            </div>
            <div className="l-header__learn">
              <AiOutlineClockCircle />
              <p>勉強時間: {page.estimated_time}分</p>
            </div>
            <Link
              to={`/lessons?category=${page.category.ja_name}&id=${page.category.id}`}
              className="l-cat__link"
            >
              {page.category.ja_name}
            </Link>
          </div>
          <img
            className="l-detail-header__img"
            src={`${ENV.BASE_BACK_URL}${page.header_image.medium.src}`}
            alt={page.header_image.title}
          />
        </header>
      </div>
      <section>
        {page.lesson_content.map((block: any) => {
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
          } else if (block.type === "full_width_img") {
            return (
              <div
                key={block.id}
                className="full-width-container l-detail-image"
              >
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
          } else if (block.type === "beyond_text_img") {
            return (
              <div key={block.id} className="container l-detail-image">
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
          } else if (block.type === "block_quote") {
            return (
              <div key={block.id} className="text-container l-detail-image">
                <figure className="bquote">
                  <div className="bquote__inner">
                    <blockquote cite={block.value?.citation_url}>
                      <p>{block.value.quote}</p>
                    </blockquote>
                    <figcaption>
                      — {block.value.author},{" "}
                      <cite>{block.value.citation_source}</cite>
                    </figcaption>
                  </div>
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
          } else if (block.type === "conversation") {
            const p1 = block.value.person_one_name;
            const p2 = block.value.person_two_name;
            return (
              <div key={block.id} className="text-container">
                <div className="l-conv">
                  <h4 className="l-conv__title">{block.value.title}</h4>
                  <p>{block.value.intro}</p>
                  <table className="l-conv__table">
                    {block.value.conversation.map((lines: any) => {
                      return (
                        <React.Fragment key={lines.person_one.slice(0, 6)}>
                          <tr>
                            <td>{p1}</td>
                            <td>:</td> <td>{lines.person_one}</td>
                          </tr>
                          <tr>
                            <td>{p2}</td>
                            <td>:</td> <td>{lines.person_two}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </table>
                </div>
              </div>
            );
          } else if (block.type === "mc_questions") {
            return <MCQuestions key={block.id} value={block.value} />;
          }
        })}
      </section>
      <section className="l-rel">
        <div className="container">
          <h2 className="l-rel__title">Other lessons you might like</h2>
          <div className="l-rel__lessons">
            {page.related_lessons.map((related_lesson) => {
              return (
                <div key={related_lesson.id} className="l-rel__card">
                  <img
                    src={`${ENV.BASE_BACK_URL}${related_lesson.lesson.image.thumbnail.src}`}
                    alt={related_lesson.lesson.image.thumbnail?.alt}
                    className="l-rel__card__img"
                  />
                  <div className="l-rel__card__details">
                    <h4 className="l-rel__card__title">
                      {related_lesson.lesson.display_title}
                    </h4>
                    <p className="l-rel__card__intro">
                      {related_lesson.lesson.display_tagline}
                    </p>
                    <Link
                      to={`/lessons/${related_lesson.lesson.slug}`}
                      className="l-rel__card__button"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

type TTestRecord = {
  questionNumber: number;
  correct: boolean;
  answers: string[];
}[];

function MCQuestions({ value }: TMCQuestionsProps) {
  const [testRecord, setTestRecord] = React.useState<TTestRecord>([]);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const numQuestions = value.questions.length;
  const numAnswered = testRecord.length;
  const answers = getAnswers(value.questions);
  const numCorrect = testRecord.reduce((accumulator, record) => {
    if (record.correct) {
      return accumulator + 1;
    } else {
      return accumulator + 0;
    }
  }, 0);

  function createOrUpdateRecord(
    testRecord: TTestRecord,
    qNumber: number,
    correct: boolean,
    text: string
  ) {
    let testRecordCpy = [...testRecord];
    if (testRecordCpy.some((record) => record.questionNumber === qNumber)) {
      //exists so only update the text
      testRecordCpy.map((record) => {
        if (record.questionNumber === qNumber) {
          record.answers.push(text);
          return record;
        }
        return record;
      });
      return testRecordCpy;
    } else {
      //create new record
      testRecordCpy.push({
        questionNumber: qNumber,
        correct: correct,
        answers: [text],
      });
      return testRecordCpy;
    }
  }

  function handleClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    correct: boolean,
    questionNumber: number,
    text: string
  ) {
    if (correct) {
      e.currentTarget.classList.toggle("l-question__correct");
      setTestRecord(
        createOrUpdateRecord(testRecord, questionNumber, correct, text)
      );
    } else {
      e.currentTarget.classList.toggle("l-question__incorrect");
      setTestRecord(
        createOrUpdateRecord(testRecord, questionNumber, correct, text)
      );
    }
  }

  return (
    <div className="text-container">
      <div className="l-mc-questions">
        <h4 className="l-mc-questions__title">{value.title}</h4>
        <p>{value.intro}</p>
        <p className="l-mc-questions__instructions">
          Click on the answer. Only your first try will be recorded for the
          results. Click on the 'show answers' to see answers.
        </p>
        {value.questions.map((question: any) => {
          return (
            <MCQuestion
              key={question.questionNumber}
              questionNumber={question.questionNumber}
              question={question.question}
              answers={question.answers}
              handleClick={handleClick}
            />
          );
        })}
        <div>
          {numAnswered === numQuestions ? (
            <>
              <h5>Results</h5>
              <p>
                Your result: {numCorrect}/{numAnswered} ={" "}
                {Math.round((numCorrect / numAnswered) * 100)}%{" "}
              </p>
            </>
          ) : null}
        </div>
        <div>
          <button
            className="button"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? "Hide Answers" : "Show answers"}
          </button>
          {showAnswers &&
            answers.map((answer) => {
              return (
                <div key={answer.questionNumber} className="l-question__answer">
                  <p>
                    {answer.questionNumber}: {answer.question}
                  </p>
                  <p> - {answer.answer}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function MCQuestion({
  questionNumber,
  question,
  answers,
  handleClick,
}: TMCQuestionProps) {
  return (
    <div>
      <p className="l-question__question">
        {questionNumber}: {question}
      </p>
      <div className="l-question__choices">
        {answers.map((question, i) => {
          const letters = ["a", "b", "c"];
          return (
            <div
              key={question.id}
              onClick={(e) =>
                handleClick(e, question.correct, questionNumber, question.text)
              }
              className="l-question__choice"
            >
              <span>{letters[i]}: </span>
              {question.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
