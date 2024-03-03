import assets from "./assets";
import quiz from "./quiz.json";

export default {
  name: "Тренажер",
  assets,
  strings: {
    confirm: "Confirm",
    nextQuestion: "Next Question",
    congratTitle: "Thank you\nfor your time!",
    congratButtonTitle: "Submit",
  },
  quiz: quiz.map((quiz) => {
    const { answer1, answer2, answer3, answer4, answer5, ...rest } = quiz;
    const options = [answer1, answer2, answer3, answer4, answer5]
      .filter(Boolean)
      .map((name, id) => ({ id: id + 1, name }));
    return { options, ...rest };
  }),
  enums: {
    fiveNumbers: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
      { id: "3", name: "3" },
      { id: "4", name: "4" },
      { id: "5", name: "5" },
    ],
  },
};
