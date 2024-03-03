import uiCommons from "arrmatura-ui";
import launchWeb from "arrmatura-web";
import types from "./index.xml";
import resources from "./resources";
import { functions } from "./functions";

launchWeb({ types: [...uiCommons, types], resources, functions, });
