import { Component } from "arrmatura-web";
import launchWeb from "arrmatura-web";
import { capitalize, Hash } from "ultimus";
import templates from "./index.xml";

type Action = Hash<string>;
type Item = Hash<any>;
type State = {
  filterId?: string;
  nextId: number;
  items: Item[];
};

// filters metadata
const FILTERS = [
  { id: "all", name: "All", values: [true, false] },
  { id: "active", name: "Active", values: [false] },
  { id: "completed", name: "Completed", values: [true] },
];

// reducers:

const addNewReducer = ({ items, nextId }: State, { value }: Action) => ({
  nextId: nextId + 1,
  items: [{ id: nextId, name: value, completed: false } as Item].concat(items),
});

const REDUCERS: Record<string, (state: State, action: Action) => Partial<State> | null> = {
  inverse: ({ items }, { id }) => ({
    items: items.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)),
  }),
  save: ({ items }, { id, value }) => ({
    items: !value ? items.filter((e) => e.id !== id) : items.map((e) => (e.id === id ? { ...e, name: value } : e)),
  }),
  rm: ({ items }, { id }) => ({ items: items.filter((e) => e.id !== id) }),
  filter: (st, { filterId }) => ({
    filterId: FILTERS.find((e) => e.id === filterId) ? filterId : "all",
  }),
  purge: ({ items }) => ({ items: items.filter((e) => !e.completed) }),
  toggle: ({ items }, { value }) => ({
    items: items.map((e) => ({ ...e, completed: !!value })),
  }),
  add: (state, { value }) => (!value ? null : addNewReducer(state, { value })),
};

// local persistence service
class Storage {
  private _state: any;
  get state(): State {
    //initially, load data from storage
    return this._state ?? (this._state = JSON.parse(localStorage.getItem("TODO") ?? "null"));
  }
  set state(state) {
    this._state = state;
    localStorage.setItem("TODO", JSON.stringify(state));
  }
}

// service component
class TodoStore extends Component {
  storage: Storage = new Storage();

  constructor(_initials: Hash, ctx: any) {
    super(_initials, ctx);
    // generate action handlers
    Object.entries(REDUCERS).forEach(([key, fn]) => {
      this[key] = (data: Action, { state }: this) => ({
        state: Object.assign({}, state, fn(state, data)),
      });
    });
  }

  get state(): State {
    //initially, load data from storage
    return (
      this.storage.state || {
        items: [],
        nextId: 1,
      }
    );
  }

  set state(state) {
    this.storage.state = state;
  }

  // hook on init
  init(ctx: any) {
    const onhash = () =>
      ctx.emit("this.filter()", {
        filterId: window.location.hash.slice(1) ?? FILTERS[0].id,
      });
    // use hash as a filter key. invoke immediately.
    window.onhashchange = onhash;
    onhash();
  }

  getShownItems() {
    const { filterId, items } = this.state;
    const values = !filterId ? [] : FILTERS.find((e) => e.id === filterId)?.values;
    return items.filter((e) => values?.includes(!!e.completed));
  }

  getNotEmpty() {
    return this.state.items.length > 0;
  }

  getFilterId() {
    return this.state.filterId;
  }

  getItemsLeft() {
    return this.state.items.filter((e) => !e.completed).length;
  }

  getHasCompleted() {
    return this.state.items.length - this.getItemsLeft();
  }

  getShownItemsCount() {
    return this.getShownItems().length;
  }
}

// resource bundle: strings and metadata
const resources = {
  title: "todos",
  items_left: " item(s) left",
  clear_completed: "Clear completed",
  hint: "Double-click to edit a todo",
  new_todo_hint: "What needs to be done?",
  mark_all_complete: "Mark all as complete",
  author: "alitskevich",
  authorUrl: "https://github.com/alitskevich",
  todoMvc: "TodoMVC",
  todoMvcUrl: "http://todomvc.com",
  filters: FILTERS,
};

// pipes functions
const functions = {
  capitalize,
  upper: (s: string) => `${s}`.toUpperCase(),
};

// launch App with types, resources and functions
launchWeb({
  types: [TodoStore, templates],
  resources,
  functions,
});

