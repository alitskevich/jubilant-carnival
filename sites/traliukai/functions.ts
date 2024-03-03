import { Hash, StringHash } from "ultimus";

const getDueDate = (e: StringHash) => {
  if (e.endDate) return new Date(e.endDate).getTime();

  const date = new Date(String(e.startDate));
  date.setDate(date.getDate() + Number(e.datePeriod ?? 1000) + 1);
  return date.getTime();
};

export const functions = {
  activeContent(data: StringHash[], tabId = "ask", userId = "") {
    const now = Date.now();
    return data?.filter((e: StringHash) => {
      if (tabId === "my") return e.userId == userId;
      if (e.status !== "open") return false;
      if (e.kind !== tabId) return false;

      if (getDueDate(e) < now) return false;

      return true;
    });
  },

  matchedItems(data: StringHash[], item: Hash) {
    if (!item) return [];
    const { kind, origCountry, destCountry } = item;
    const now = Date.now();
    const origKey = String(origCountry ?? "").toLowerCase();
    const destKey = String(destCountry ?? "").toLowerCase();
    return data?.filter((e: StringHash) => {
      if (e.status !== "open") return false;
      if (e.kind === kind) return false;
      if (e.origCountry === "EU" && e.destCountry === "EU") return true;

      if (origCountry && !String(`${e.origCountry},${e.origCity}`).toLowerCase().split(",").includes(origKey))
        return false;
      if (destCountry && !String(`${e.destCountry},${e.destCity}`).toLowerCase().split(",").includes(destKey))
        return false;

      if (getDueDate(e) < now) return false;

      return true;
    });
  },
};
