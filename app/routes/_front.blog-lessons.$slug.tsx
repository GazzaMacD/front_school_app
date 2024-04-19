import { json, type MetaFunction, type LinksFunction } from "@remix-run/node";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { Link, useLoaderData } from "@remix-run/react";
import { RiEmotionHappyLine, RiEmotionUnhappyLine } from "react-icons/ri";
import React from "react";

import { BASE_API_URL } from "~/common/constants.server";
import { handlePreview } from "~/common/utils.server";
import { Swoosh1 } from "~/components/swooshes";
import { BlogCard } from "~/components/cards";
import { getTitle } from "~/common/utils";
import { getGlobalEnv } from "~/common/utils";
import cardStyles from "~/styles/components/cards.css";

/*types */
import type { LoaderFunctionArgs } from "@remix-run/node";
import type {
  TWagBasicImage,
  TBaseDetailPage,
  TListPageItemAllMeta,
  TBaseListPage,
} from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cardStyles },
];

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

type TArrayQuestions = {
  id: number;
  correct: boolean;
  text: string;
}[];

type TMCQuestion = {
  questionNumber: number;
  question: string;
  answers: TArrayAnswers;
};

type TMCValue = {
  title: string;
  intro: string;
  questions: TMCQuestion[];
};

type TMCQuestionsProps = {
  value: TMCValue;
};
type TTestRecordAnswer = {
  letter: string;
  text: string;
};

type TTestRecordQuestion = {
  questionNumber: number;
  question: string;
  answers: TArrayAnswers;
  answer: TTestRecordQuestion;
  answered: boolean;
  answerCorrect: boolean;
};
type TTestRecordQuestions = TTestRecordQuestion[];

type TTestRecord = {
  title: string;
  intro: string;
  questions: TTestRecordQuestions;
  numQuestions: 3;
};

type TMCQuestionProps = {
  questionNumber: number;
  question: string;
  answers: TArrayAnswers;
  answered: boolean;
  handleClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    correct: boolean,
    answered: boolean,
    questionNumber: number,
    question: string
  ) => void;
};
/*
 * helper functions
 */
function shuffleQuestions(questionsArray: TArrayQuestions): TArrayQuestions {
  const array: TArrayQuestions = [...questionsArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

export const meta: MetaFunction = ({ data }) => {
  const { page } = data;
  return [
    { title: getTitle({ title: `${page.display_title}`, isHome: false }) },
  ];
};
/*
 * Serverside functions
 */

export async function loader({ request, params }: LoaderFunctionArgs) {
  //handle previews
  const previewResponse = await handlePreview<TLessonsPreview>(request);
  if (previewResponse.isPreview && previewResponse.data) {
    return json({ data: previewResponse.data });
  }
  //NOTE : deal with preview errrors here
  const { slug } = params;
  if (!slug) {
    throw new Response("Oops that's a 404", { status: 404 });
  }
  const apiUrl = `${BASE_API_URL}/pages/?type=lessons.LessonDetailPage&slug=${slug}&fields=*`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  if (!res.ok || !data.items.length) {
    throw new Response(
      "Sorry, that's a 404. Seems there is nothing on this url",
      { status: 404 }
    );
  }
  let page = data.items[0];
  page = multipleChoiceCreator(page);
  return json({ page });
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
      <header className="bl-dp-header">
        <div className="g-basic-container">
          <div className="bl-dp-header__titles">
            <h1>
              {page.display_title}
              <span>{page.title}</span>
            </h1>
            <p>{page.display_tagline}</p>
          </div>
        </div>

        <div className="g-basic-container">
          <div className="bl-dp-header__details">
            <div className="bl-dp-header__details__author">
              <Link to={`/staff/${page.author.slug}`}>
                <img
                  src={`${ENV.BASE_BACK_URL}${page.author.image.thumbnail.src}`}
                  alt={page.author.image.thumbnail.alt}
                />
              </Link>
              <p>
                <span>By </span>
                <Link to={`/staff/${page.author.slug}`}>
                  {page.author.name}
                </Link>
              </p>
            </div>
            <div className="bl-dp-header__details__date">
              <AiOutlineCalendar />
              <p>
                {" "}
                {`${pubDate.getFullYear()}.${
                  pubDate.getMonth() + 1
                }.${pubDate.getDate()}`}
              </p>
            </div>
            <div className="bl-dp-header__details__learn">
              <AiOutlineClockCircle />
              <p>
                <span>この記事は</span>
                {page.estimated_time}分で読めます
              </p>
            </div>
            <Link
              to={`/blog-lessons?category=${page.category.ja_name}`}
              className="bl-dp-header__details__cat"
            >
              {page.category.ja_name}
            </Link>
          </div>
        </div>

        <div className="bl-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.medium.src}`}
            alt={page.header_image.title}
          />
        </div>
      </header>

      <section>
        {page.lesson_content.map((block: any) => {
          if (block.type === "rich_text") {
            return (
              <div
                className="g-narrow-container"
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.value }}
              />
            );
          } else if (block.type === "text_width_img") {
            return (
              <div key={block.id} className="g-narrow-container">
                <figure className="bl-dp__figure text-width">
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
              <div key={block.id}>
                <figure className="bl-dp__figure full-width">
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
              <div key={block.id}>
                <figure className="bl-dp__figure beyond-text">
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
              <div key={block.id} className="g-narrow-container">
                <figure className="bl-dp__bquote">
                  <blockquote cite={block.value?.citation_url}>
                    <p>{block.value.quote}</p>
                  </blockquote>
                  <figcaption>
                    — {block.value.author},{" "}
                    <cite>{block.value.citation_source}</cite>
                  </figcaption>
                </figure>
              </div>
            );
          } else if (block.type === "youtube") {
            return (
              <div key={block.id}>
                <div className="bl-dp__youtube">
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
              </div>
            );
          } else if (block.type === "conversation") {
            const p1 = block.value.person_one_name;
            const p2 = block.value.person_two_name;
            return (
              <div key={block.id} className="g-narrow-container">
                <h3>{block.value.title}</h3>
                <p>{block.value.intro}</p>
                <div className="bl-dp__teach">
                  <div className="bl-dp__teach__header">
                    Learn from this conversation!
                  </div>
                  <table className="bl-dp__conversation">
                    <tbody>
                      {block.value.conversation.map((lines: any) => {
                        return (
                          <React.Fragment key={lines.person_one.slice(0, 10)}>
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
                    </tbody>
                  </table>
                </div>
              </div>
            );
          } else if (block.type === "mc_questions") {
            return <MCQuestions key={block.id} value={block.value} />;
          } else if (block.type === "examples_list") {
            const examples = block.value.sentences_list;
            return (
              <div key={block.id} className="g-narrow-container">
                <div className="bl-dp__teach">
                  <div className="bl-dp__teach__header">
                    Let's read and learn!
                  </div>
                  {examples.map((s, i) => (
                    <div
                      className="bl-dp__example-s"
                      key={i}
                      dangerouslySetInnerHTML={{ __html: s }}
                    />
                  ))}
                </div>
              </div>
            );
          } else if (block.type === "wrong_right_list") {
            const list = block.value.wrong_right_list;
            return (
              <div key={block.id} className="g-narrow-container">
                <div className="bl-dp__teach">
                  <div className="bl-dp__teach__header">
                    Incorrect and Correct!
                  </div>
                  {list.map((s, i) => {
                    return (
                      <div key={i} className="bl-dp__wr">
                        <div className="bl-dp__wr--wrong">
                          <RiEmotionUnhappyLine />
                          <p>{s.wrong}</p>
                        </div>
                        <div className="bl-dp__wr--right">
                          <RiEmotionHappyLine />
                          <p>{s.right}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </section>

      <section className="bl-dp__related">
        <div className="g-grid-container1">
          <h2>あなたへのおすすめ記事</h2>
        </div>
        <div className="g-grid-container1">
          {page.related_lessons.map((l, i) => {
            return (
              <BlogCard
                i={`item${i}`}
                key={l.id}
                slug={l.lesson.slug}
                src={`${ENV.BASE_BACK_URL}/${l.lesson.image.thumbnail.src}`}
                alt={l.lesson.image.thumbnail.alt}
                date={l.lesson.published_date}
                title={l.lesson.display_title}
                category={l.lesson.category}
              />
            );
          })}
        </div>
      </section>
      <Swoosh1 swooshColor="beige" backColor="white" />
    </>
  );
}

function MCQuestions({ value }: TMCQuestionsProps) {
  const [testRecord, setTestRecord] = React.useState<TTestRecord | null>(null);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const numQuestions = value.questions.length;
  const numCorrect = testRecord ? calculateScore(testRecord.questions) : 0;
  const numAnswered = testRecord
    ? calculateNumAnswered(testRecord.questions)
    : 0;

  function calculateNumAnswered(questions: TTestRecordQuestions) {
    let numAnswered = 0;
    questions.forEach((q) => {
      if (q.answered) {
        numAnswered += 1;
      }
    });
    return numAnswered;
  }

  function calculateScore(questions: TTestRecordQuestions) {
    let score = 0;
    questions.forEach((q) => {
      if (q.answerCorrect) {
        score += 1;
      }
    });
    return score;
  }

  function getAnswers(answers: TArrayAnswers): TTestRecordAnswer {
    const answer = {
      letter: "",
      text: "",
    };
    answers.forEach((q, i) => {
      const letters = ["a", "b", "c"];
      if (q.correct) {
        answer.text = q.text;
        answer.letter = letters[i];
      }
    });
    return answer;
  }

  function updateTestRecord(
    testRecord: TTestRecord,
    qNumber: number,
    correct: boolean
  ) {
    const newTestRecord: TTestRecord = JSON.parse(JSON.stringify(testRecord));
    const updatedQuestions: TTestRecordQuestions = newTestRecord.questions.map(
      (q) => {
        if (q.questionNumber === qNumber) {
          const updatedQ = JSON.parse(JSON.stringify(q));
          updatedQ.answered = true;
          updatedQ.answerCorrect = correct;
          return updatedQ;
        } else {
          return q;
        }
      }
    );
    newTestRecord.questions = updatedQuestions;
    return newTestRecord;
  }

  function handleClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    correct: boolean,
    answered: boolean,
    questionNumber: number,
    text: string
  ) {
    if (answered || !testRecord) return;

    if (correct) {
      e.currentTarget.classList.add("correct");
      setTestRecord(updateTestRecord(testRecord, questionNumber, correct));
    } else {
      e.currentTarget.classList.add("incorrect");
      setTestRecord(updateTestRecord(testRecord, questionNumber, correct));
    }
  }

  React.useEffect(() => {
    if (testRecord) return;
    function createTestRecord(value: TMCValue): TTestRecord {
      const testRecord = JSON.parse(JSON.stringify(value));
      const questions = testRecord.questions.map((q) => {
        q.answer = getAnswers(q.answers);
        q.answered = false;
        q.answerCorrect = false;
        return q;
      });
      testRecord.questions = questions;
      testRecord.numQuestions = testRecord.questions.length;
      return testRecord;
    }
    setTestRecord(createTestRecord(value));
  }, [value, testRecord]);

  return (
    <div className="g-narrow-container">
      <h3>{value.title}</h3>
      <p>{value.intro}</p>
      <div className="bl-dp__mctest">
        <div className="bl-dp__mctest__header">A fun multiple choice test!</div>
        <div className="bl-dp__mctest__test">
          <p>
            Please click on the answer. Only your first try will be recorded for
            the results. When you have finished, you can see your results and
            answers by clicking on the button 'results and answers'
          </p>
          <div>
            {testRecord
              ? testRecord.questions.map((q: any) => {
                  return (
                    <MCQuestion
                      key={q.questionNumber}
                      questionNumber={q.questionNumber}
                      question={q.question}
                      answers={q.answers}
                      answered={q.answered}
                      handleClick={handleClick}
                    />
                  );
                })
              : null}
          </div>
        </div>
        <div className="bl-dp__mctest__answers">
          <div>
            <button
              className="bl-dp__mctest__btn"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? "Hide" : "Results & answers"}
            </button>
          </div>
          <div>
            {showAnswers && (
              <>
                <div className="bl-dp__mctest__results">
                  <h5>Results</h5>
                  {numAnswered < numQuestions ? (
                    <p>Please finish the test to see your results.</p>
                  ) : (
                    <p>
                      Your result: {numCorrect}/{numQuestions} ={" "}
                      {Math.round((numCorrect / numQuestions) * 100)}%{" "}
                    </p>
                  )}
                </div>
                <div>
                  <h5>Answers</h5>
                  {testRecord
                    ? testRecord.questions.map((q) => {
                        return (
                          <div
                            key={q.question}
                            className="bl-dp__mctest__answer"
                          >
                            <p>
                              {q.questionNumber}: {q.question}
                            </p>
                            <p>
                              {q.answer.letter}: {q.answer.text}
                            </p>
                          </div>
                        );
                      })
                    : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MCQuestion({
  questionNumber,
  question,
  answers,
  answered,
  handleClick,
}: TMCQuestionProps) {
  return (
    <div className="bl-dp__mctest__qa">
      <p>
        {questionNumber}: {question}
      </p>
      <div>
        {answers.map((question, i) => {
          const letters = ["a", "b", "c"];
          return (
            <div
              key={question.id}
              onClick={(e) => {
                handleClick(
                  e,
                  question.correct,
                  answered,
                  questionNumber,
                  question.text
                );
              }}
              className="bl-dp__mctest__choice"
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
