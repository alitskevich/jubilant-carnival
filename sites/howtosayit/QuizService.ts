import { Component } from "arrmatura-web";

export class QuizService extends Component {
  #step = 0;
  state = {};
  quiz: any[] = [];

  get count() {
    return Number(this.quiz?.length || 0);
  }

  get current() {
    const current = this.quiz?.[this.step];
    const currentSate = this.state?.[current.id] || {};

    return {
      value: null,
      isCorrect: null,
      confirmed: false,
      symbol: null,
      ...current,
      ...currentSate,
    };
  }
  get progress() {
    return this.quiz?.map((current) => {
      const { confirmed, isCorrect, value } = this.state?.[current.id] || {};
      return {
        id: current.id,
        order: current.order,
        color: !value ? "slate" : !confirmed ? "yellow" : isCorrect ? "green" : "red",
      };
    });
  }

  get step() {
    return Number(this.#step || 0);
  }

  set step(step) {
    this.#step = step > this.count - 1 ? -1 : step;
  }

  onAnswer({ key, value }, { state }) {
    return {
      state: { ...state, [key]: { value, symbol: "🟡" } },
    };
  }

  onConfirmAnswer(_, { state, current }) {
    if (current.confirmed) {
      return {
        step:
          (this.quiz.findIndex((q) => q.order > current.order && !state[q.id]?.confirmed) + 1 ||
            this.quiz.findIndex((q) => q.order < current.order && !state[q.id]?.confirmed) + 1 ||
            0) - 1,
      };
    }
    const isCorrect = current.correct == current.value;
    const symbol = isCorrect ? "🟢" : "🔴";
    return {
      // step: current.order + 1,
      state: {
        ...state,
        [current.id]: {
          ...state[current.id],
          confirmed: true,
          isCorrect,
          symbol,
        },
      },
    };
  }

  onBack(_, { step }) {
    return {
      step: step == 0 ? 0 : step - 1,
    };
  }

  onNext(_, { step }) {
    return {
      step: step + 1,
    };
  }
  onRestart() {
    return {
      step: 0,
      state: {},
    };
  }
  onStop() {
    return {
      step: -1,
    };
  }

  get report() {
    const total = this.quiz?.length || 0;
    const weight = {
      total: 0,
      correct: 0,
    };
    const report: any = {
      total,
      confirmed: 0,
      correct: 0,
    };

    this.quiz?.forEach((current) => {
      const { confirmed, isCorrect } = this.state?.[current.id] || {};
      weight.total += current.weight || 2;
      if (confirmed) {
        report.confirmed++;
        if (isCorrect) {
          report.correct++;
          weight.correct += current.weight || 2;
        }
      }
    });

    report.unanswered = total - report.confirmed;
    report.wrong = report.confirmed - report.correct;
    report.balls = `${Math.round((100 * weight.correct) / weight.total)} / 100`;

    return Object.entries(report)
      .filter(([_, value]) => !!value)
      .map(([id, value]) => ({ id, name: `${value}` }));
  }
  get submitData() {
    const report: any = {
      wrongAnswers: [],
    };

    this.quiz?.forEach((current) => {
      const { confirmed, isCorrect } = this.state?.[current.id] || {};
      if (confirmed) {
        if (!isCorrect) {
          report.wrongAnswers.push({ id: current.id });
        }
      }
    });

    return report;
  }
}
