import data from "./data.json";

const items = data.map((e) => ({
  ...e,
  id: e.cca2,
  populationText: (e.population ?? 0) < 1000000 ? "<1M" : `~${Math.round((e.population ?? 0) / 1000000)}M`,
}));

export default {
  items,
};

