import React from 'react';
import Question from '../../components/customercenter/Question';
import Footer from "../../components/footer/Footer";
import TopNav from "../../components/topnav/TopNav";
import MoveButton from '../../components/buttons/MoveButton';
// 다국어 지원 모드 추가
import { useTranslation } from "react-i18next";

function Announcement() {
  const { t } = useTranslation();

  const questions2 = [
    {
      number: 1,
      question: t("question1"),
      date: "2024/06/05",
      answer: t("answer1")
    },
    {
      number: 2,
      question: t("question2"),
      date: "2024/06/05",
      answer: t("answer2")
    },
    {
      number: 3,
      question: t("question3"),
      date: "2024/06/05",
      answer: t("answer3")
    },
    {
      number: 4,
      question: t("question4"),
      date: "2024/06/05",
      answer: t("answer4")
    },
    {
      number: 5,
      question: t("question5"),
      date: "2024/06/05",
      answer: t("answer5")
    },
    {
      number: 6,
      question: t("question6"),
      date: "2024/06/05",
      answer: t("answer6")
    },
    {
      number: 7,
      question: t("question7"),
      date: "2024/06/05",
      answer: t("answer7")
    },
    {
      number: 8,
      question: t("question8"),
      date: "2024/06/05",
      answer: t("answer8")
    },
  ];

  return (
    <div className='bg-gray-900 min-h-screen flex flex-col'>
      <TopNav />
      <div className="flex-grow w-11/12 max-w-5xl mx-auto pb-5">
        <div className="text-white p-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold my-5">{t("notice")}</div>
          <div className="grid grid-cols-8 gap-2 p-2 mb-4 border bg-[#13538A] font-bold text-xs sm:text-sm md:text-base">
            <div className="col-span-1">{t("number")}</div>
            <div className="col-span-5">{t("question")}</div>
            <div className="col-span-2">{t("date")}</div>
          </div>
          <div className="space-y-2">
            {questions2.map((q, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg text-xs sm:text-sm md:text-base">
                <Question
                  number={q.number}
                  question={q.question}
                  date={q.date}
                  answer={q.answer}
                />
              </div>
            ))}
          </div>
        </div>
        <MoveButton />
      </div>
      <Footer />
    </div>
  );
}

export default Announcement;
