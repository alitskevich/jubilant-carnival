import launchWeb from "arrmatura-web";
import all from "./index.xml";
import { resources } from "./resources";
import components from "arrmatura-ui";

const types = [...components, all];

launchWeb({ types, resources });
