import semantable from "./index.json";
import launchWeb from "arrmatura-web";
import all from "./index.xml";
import components from "arrmatura-ui";

const types = [...components, all];

const items = semantable.map(({ id, key, ns, domain, entries }) => ({
  id,
  name: key,
  ns,
  domain,
  entries: entries.map((id) => ({ id, name: id })),
}));

// https://script.google.com/macros/s/AKfycbyxq4FQP2nYaABdKHWmeJvisIOewsI_h1OlXPNSvztPTnc27xRaz818ABSMOcRXmMpW/exec
const resources = {
  items,
  forms: {
    filter: [
      { id: "domain", name: "Domain" },
      { id: "ns", name: "ns" },
    ],
  },
};

launchWeb({ types, resources });
