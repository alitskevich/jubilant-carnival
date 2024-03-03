import type { Hash, StringHash } from "ultimus/types";
import { ANode } from "./src/nodes/ANode";

export type Px = number;

export type ScaleMapping = Record<Px, string>;
export type NodeBounds = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export type NodeStyling = {
  blendMode?: string;
  strokeAlign?: string;
  strokeWeight?: string;
  strokes?: string;
  fills?: string;
  cornerRadius?: string;
  rectangleCornerRadii?: string;
  textAutoResize?: string;
  textAlignHorizontal?: string;
  textAlignVertical?: string;

  layoutMode?: any;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  itemSpacing?: string;
  layoutWrap?: string;

  classes?: StringHash;
};

export type NodeLayout = {
  if?: boolean;
  isFixed?: boolean;
  bounds?: NodeBounds;
  constraints?: {
    vertical: string;
    horizontal: string;
  };
  layoutPositioning?: string;
  layoutGrow?: 0 | 1;
  layoutAlign?: string;
  minWidth?: number;
  maxWidth?: number;

  classes?: StringHash;
};

export type FNode = {
  [x: string]: any;
  style?: Hash<string | number | null | undefined>;
  classes?: any;
  type?: any;
  tag?: any;
  attrs?: any;
  children?: any;
  name?: any;
};
export type NormalizedNode = {
  nodes: NormalizedNode[];
};

export type Padding = {
  className: string;
  all: number;
  horizontal: number;
  left: number;
  right: number;
  vertical: number;
  top: number;
  bottom: number;
};

export type AttributeSpec = (node: ANode, styling: any, ctx?: EvaluationContext) => void;

export type AttributesSpec = Hash<AttributeSpec>;

export type EvaluationContext = any;
