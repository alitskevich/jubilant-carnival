import launchWeb from "arrmatura-web";
import { urlParse } from "ultimus";
import uiCommons from "arrmatura-ui";
import templates from "./index.xml";
import resources from "./resources";
import { QuizService } from "../../apps/focusator/src/CTestService";

const { params } = urlParse(window.location.href);
const key = "AKfycbw4xNoL9WKm9z5rMw0qoCFdo1KhbDU1bmdZI12uKFmul1S-4AgvGZMmsXPPJ2H4eA1f";
const submitQueryUrl = `https://script.google.com/macros/s/${key}/exec`;

launchWeb({
  types: [...uiCommons, QuizService, templates],
  resources: { ...resources, submitQueryUrl, params },
});
