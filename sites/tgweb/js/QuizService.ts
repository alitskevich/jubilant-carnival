import { Component } from "arrmatura";

export class QuizService extends Component {
  [key: string]: unknown;

  setInitialData(data: unknown) {
    if (this.initialData) return;
    this.initialData = data;

    if (!data) {
      data = {
        step: 1,
        memberId: Date.now(),
        memberName: `FunnyBeaver${Math.ceil(Math.random() * 100)}`,
      };
    }
    this.setData(data);
  }

  get step() {
    return +(this.data?.step || 1);
  }

  set step(step) {
    this.setData({ ...this.data, step });
  }

  setData(data: unknown) {
    this.store?.(data);
    this.data = data;
  }

  setItems(items: any[]) {
    this.$ctx.up({ game: items?.[0] });
  }

  onAnswer({ key, value }, { data }) {
    this.$ctx.log("onAnswer", key, value);
    return {
      data: { ...data, [key]: value },
    };
  }

  onBack(_: any, { step }: any) {
    return {
      step: step - 1,
    };
  }

  onNext(_: any, { step }: any) {
    return {
      step: step + 1,
    };
  }

  onSubmit(_: any, { step }: any) {
    return {
      busy: true,
      "...": this.submit?.(this.data)
        .then(({ error }) => {
          if (error) {
            throw new Error(error.message);
          }
          return {
            busy: false,
            step: step + 1,
          };
        })
        .catch((error: { message: any }) => {
          this.$ctx.emit("toasters.send", { message: `error:${error.message}` });
          return { busy: false };
        }),
    };
  }
}
