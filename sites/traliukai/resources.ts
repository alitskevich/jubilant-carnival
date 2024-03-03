import * as lib from "ultimus";
import { data as cities } from "./assets/cities.json";
import countries from "./assets/countries.json";
import logo from "./assets/logo.png";

// https://script.google.com/macros/s/AKfycbxDogq1M4coHGjfXi4HUaw3mfXxy3lP9EMdq8Uh8w0Y4nw8SBGh6_pWBbhPnHC1bc3Wkg/exec
const { params } = lib.urlParse(window.location.href);
const {
  key = "AKfycbxDogq1M4coHGjfXi4HUaw3mfXxy3lP9EMdq8Uh8w0Y4nw8SBGh6_pWBbhPnHC1bc3Wkg",
  meta,
  api,
  mode = "exec",
} = params;
const metaUrl = meta ?? `https://script.google.com/macros/s/${key}/${mode}?action=metadata`;
const apiUrl = api ?? `https://script.google.com/macros/s/${key}/${mode}`;

export default {
  name: "Traliukai",
  app: {
    logo,
  },
  metaUrl,
  apiUrl,
  params,
  assets: {},
  symbols: {
    colomn: ":",
  },
  listTabs: [
    { id: "ask", name: "Reikia" },
    { id: "bid", name: "Vežame" },
    { id: "my", name: "Mano" },
  ],
  listFilter: [
    { id: "type", type: "enum", typeSpec: "trailType", name: "Type" },
    { id: "origCountry", typeSpec: "country", name: "Iz" },
    { id: "origCity", typeSpec: "city", name: "Iz miesto" },
    { id: "destCountry", typeSpec: "country", name: "I" },
    { id: "destCity", typeSpec: "city", name: "I miesto" },
  ],
  enums: {
    city: cities,
    country: countries,
    sortBy: [
      { id: "startDate", name: "By Date" },
      { id: "type", name: "By Type" },
    ],
    daysPeriod: [
      { id: "1", name: "1 d." },
      { id: "2", name: "2 d." },
      { id: "3", name: "3 d." },
      { id: "5", name: "5 d." },
      { id: "7", name: "7 d." },
    ],
    kind: [
      {
        symbol: "🚙",
        id: "ask",
        name: "Reikia",
      },
      {
        symbol: "🚚",
        id: "bid",
        name: "Vežame",
      },
    ],
    status: [
      {
        symbol: "✅",
        id: "open",
        name: "open",
      },
      {
        symbol: "❌",
        id: "closed",
        name: "closed",
      },
    ],
    trailType: [
      {
        symbol: "",
        id: "trailer",
        name: "Trailer",
      },
      {
        symbol: "",
        id: "platform",
        name: "Platform",
      },
      {
        symbol: "",
        id: "other",
        name: "Other",
      },
    ],
  },
  forms: {
    listFilter: [
      { id: "type", placeholder: "Type", type: "enum", typeSpec: "trailType" },
      {
        placeholder: "From..",
        type: "city",
        typeSpec: "origCountry",
        id: "origCity",
      },
      {
        placeholder: "To..",
        type: "city",
        typeSpec: "destCountry",
        id: "destCity",
      },
    ],
    signIn: [
      {
        id: "username",
        name: "User",
        required: true,
      },
      {
        id: "password",
        name: "Password",
        type: "password",
        required: true,
      },
    ],
    signUp: [
      {
        id: "username",
        name: "User",
        required: true,
      },
      {
        id: "password",
        name: "Password",
        type: "password",
        required: true,
      },
      {
        id: "password2",
        name: "Password again",
        type: "password",
        required: true,
      },
      {
        id: "name",
        name: "Name",
        type: "text",
      },
      {
        id: "email",
        name: "E-mail",
        type: "email",
      },
    ],
    userProfile: [
      {
        tab: "",
        group: "",
        name: "User name",
        placeholder: "",
        hint: "",
        type: "",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: true,
        id: "name",
      },
      {
        tab: "",
        group: "",
        name: "E-mail",
        placeholder: "",
        hint: "",
        type: "email",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "email",
      },
      {
        tab: "",
        group: "",
        name: "Phone",
        placeholder: "",
        hint: "",
        type: "",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "phone",
      },
    ],
    item: [
      {
        tab: "",
        group: "",
        name: "Demand/Supply",
        placeholder: "",
        hint: "",
        type: "enum",
        typeSpec: "kind",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "kind",
      },
      {
        tab: "",
        group: "",
        name: "Type",
        placeholder: "",
        hint: "",
        type: "enum",
        typeSpec: "trailType",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "type",
      },
      {
        tab: "",
        group: "",
        name: "Dates",
        placeholder: "",
        hint: "",
        type: "StartDateAndLength",
        typeSpec: "datePeriod",
        visible: "",
        disabled: "",
        access: "",
        required: true,
        id: "startDate",
      },
      {
        tab: "",
        group: "",
        name: "Is",
        placeholder: "",
        hint: "",
        type: "city",
        typeSpec: "origCountry",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "origCity",
      },
      {
        tab: "",
        group: "",
        name: "In",
        placeholder: "",
        hint: "",
        type: "city",
        typeSpec: "destCountry",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "destCity",
      },
      {
        tab: "",
        group: "",
        name: "phone",
        placeholder: "",
        hint: "",
        type: "text",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "phone",
      },
      {
        tab: "",
        group: "",
        name: "Link",
        placeholder: "",
        hint: "",
        type: "url",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "link",
      },
      {
        tab: "",
        group: "",
        name: "Notes",
        placeholder: "",
        hint: "",
        type: "textarea",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "subject",
      },
    ],
    newItem: [
      {
        tab: "",
        group: "",
        name: "Nuo date",
        placeholder: "",
        hint: "",
        type: "StartDateAndLength",
        typeSpec: "datePeriod",
        visible: "",
        disabled: "",
        access: "",
        required: true,
        id: "startDate",
      },
      {
        tab: "",
        group: "",
        name: "Iz",
        placeholder: "",
        hint: "",
        type: "city",
        typeSpec: "origCountry",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "origCity",
      },
      {
        tab: "",
        group: "",
        name: "In",
        placeholder: "",
        hint: "",
        type: "city",
        typeSpec: "destCountry",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "destCity",
      },
      {
        tab: "",
        group: "",
        name: "phone",
        placeholder: "",
        hint: "",
        type: "text",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "phone",
      },
      {
        tab: "",
        group: "",
        name: "Link",
        placeholder: "",
        hint: "",
        type: "url",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "link",
      },
      {
        tab: "",
        group: "",
        name: "Notes",
        placeholder: "",
        hint: "",
        type: "textarea",
        typeSpec: "",
        visible: "",
        disabled: "",
        access: "",
        required: "",
        id: "subject",
      },
    ],
  },
};