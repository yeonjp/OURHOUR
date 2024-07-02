import React from 'react';
import Footer from "../../components/footer/Footer";
import TopNav from "../../components/topnav/TopNav";
import Question from '../../components/customercenter/Question';
import MoveButton from '../../components/buttons/MoveButton';
// 다국어 지원 모드 추가
import { useTranslation } from "react-i18next";

function CustomerServiceBoard() {
  const { t } = useTranslation();

  const questions1 = [
    {
      "number": 1,
      "question": t("q1"),
      "date": "2024/06/05",
      "answer": t("a1")
    },
    {
      "number": 2,
      "question": t("q2"),
      "date": "2024/06/05",
      "answer": t("a2")
    },
    {
      "number": 3,
      "question": t("q3"),
      "date": "2024/06/05",
      "answer": t("a3")
    },
    {
      "number": 4,
      "question": t("q4"),
      "date": "2024/06/05",
      "answer": t("a4")
    },
    {
      "number": 5,
      "question": t("q5"),
      "date": "2024/06/05",
      "answer": t("a5")
    },
    {
      "number": 6,
      "question": t("q6"),
      "date": "2024/06/05",
      "answer": t("a6")
    },
    {
      "number": 7,
      "question": t("q7"),
      "date": "2024/06/05",
      "answer": t("a7")
    },
    {
      "number": 8,
      "question": t("q8"),
      "date": "2024/06/05",
      "answer": t("a8")
    }
  ];

  return (
    <div className='bg-gray-900 min-h-screen flex flex-col'>
      <TopNav />
      <div className="flex-grow w-11/12 max-w-5xl mx-auto pb-5">
        <div className="text-slate-50 p-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold my-5">{t("About")}</div>
          <div className="grid grid-cols-8 gap-2 p-2 mb-4 border bg-[#13538A] font-bold text-xs sm:text-sm md:text-base">
            <div className="col-span-1">{t("number")}</div>
            <div className="col-span-5">{t("question")}</div>
            <div className="col-span-2">{t("date")}</div>
          </div>
          <div className="space-y-2">
            {questions1.map((q, index) => (
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

export default CustomerServiceBoard;
