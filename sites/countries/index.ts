import launchWeb from "arrmatura-web";
import atomary from "arrmatura-ui";
import appTypes from "./index.xml";
import resources from "./resources";
// import { dateFormat, dateOf, dateTimeFormat } from "ultimus";

const types = [...atomary, appTypes];

// const date = dateOf('2023-11-05T13:19:09')

// console.log(date?.toUTCString(), dateTimeFormat(date));

launchWeb({ types, resources });
