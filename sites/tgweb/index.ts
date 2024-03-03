import * as lib from "ultimus";
import uiCommons from "arrmatura-ui/makeIndex";
import uiForms from "arrmatura-ui/form";
import launchWeb from "arrmatura-web";
import { TgWebAppService } from "arrmatura-ui/integration/TgWebAppService";
import appTypes from "./index.xml";

const { params } = lib.urlParse(window.location.href);

const {
  dev,
  key = "AKfycbxDogq1M4coHGjfXi4HUaw3mfXxy3lP9EMdq8Uh8w0Y4nw8SBGh6_pWBbhPnHC1bc3Wkg",
  apiUrl = `https://script.google.com/macros/s/${key}/exec`,
  submitQueryUrl = `${apiUrl}`,
  metaUrl = `${apiUrl}?action=metadata${dev ? `&ts=${Date.now()}` : ""}`,
  buttonText = "Submit",
} = params;

const resources = {
  ...params,
  params,
  submitQueryUrl,
  metaUrl,
  buttonText,
  data: lib.parseJson(params.data),
};

const types = [TgWebAppService, appTypes, ...uiCommons, ...uiForms];

if (dev) {
  Object.assign(resources, {
    debugInfo: JSON.stringify(resources, null, 2),
  });
}

launchWeb({ template: `<App/>`, types, resources });
