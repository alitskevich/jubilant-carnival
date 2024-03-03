import { capitalize, qname } from "ultimus";

export const toReactComponentClassName = (componentName) => capitalize(qname(componentName));
