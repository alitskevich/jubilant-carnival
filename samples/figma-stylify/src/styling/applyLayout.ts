import { ANode } from "../nodes/ANode";
import { classMap_counterAxisAlignItems, classMap_primaryAxisAlignItems, flexFixedSize_overflow_classMap } from "./classMaps";
import { pxCode } from "../utils";

export function applyLayout(node: ANode) {
  const { addClass, layout = {}, styling, nodes, parent } = node;
  const addLayoutClass = (cl) => addClass(cl, "layout");
  const { bounds = {} } = layout;
  const { x = 0, y = 0, w = 0, h = 0 } = bounds ?? {};

  const isAutoItem = layout?.layoutPositioning?.startsWith("AUTO");
  const { layoutGrow, layoutAlign, minWidth, maxWidth, layoutPositioning } = layout;
  const isHorizontalPositioning = layoutPositioning === "AUTO-HORIZONTAL";

  if (isAutoItem) {
    if (layoutGrow === 1) {
      addLayoutClass(`flex-grow:1`);
    } else {
      if (nodes?.length) {
        // addLayoutClass(`${isHorizontalPositioning ? 'w-fit' : 'h-fit'}`)
      } else {
        addLayoutClass(isHorizontalPositioning ? `min-width:${pxCode(w)}` : `min-height:${pxCode(h)}`);
      }
    }
    // Applicable only on direct children of auto-layout frames. 
    // Determines if the layer should stretch along the parent’s counter axis. Defaults to “INHERIT”.
    // 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT'
    if (layoutAlign === "STRETCH") {
      addLayoutClass(`align-self: stretch`);
    }
    if (minWidth) { addLayoutClass(`min-width:${pxCode(minWidth)}`); }
    if (maxWidth) { addLayoutClass(`max-width:${pxCode(maxWidth)}`); }
    if (!layoutGrow && !minWidth) {
      addLayoutClass(`flex-shrink:0`);
    }
  } else {
    const { isFixed, constraints } = layout;
    const { x: x0 = 0, y: y0 = 0, w: w0 = 0, h: h0 = 0 } = parent?.layout?.bounds ?? {};
    const { vertical = "TOP", horizontal = "LEFT" } = constraints ?? {};
    const hasConstraints = constraints && !(vertical === "TOP" && horizontal === "LEFT");

    const parentClasses = parent?.layout?.classes;
    const isFreeParent = parentClasses?.["position:absolute"] || parentClasses?.["position:fixed"] || parentClasses?.["position:relative"];
    if (parent && !isFreeParent) {
      parent.addClass(`position:relative`);
    }

    addLayoutClass(isFixed ? "position:fixed z-50" : isFreeParent ? `position:absolute` : 'position:relative');

    if (hasConstraints) {
      if (vertical === "TOP") {
        addLayoutClass(`top:${pxCode(y - y0)}`);
      } else if (vertical === "CENTER") {
        if (h) {
          addLayoutClass(`height:${pxCode(h)}`);
        }
        addLayoutClass(`top:calc(50%_-_${h / 2}px)`);
      } else if (vertical === "SCALE") {
        addLayoutClass(`top:${pxCode(y - y0)}`);
        addLayoutClass(`bottom:${pxCode(h - h0 - y + y0)}`);
      }

      if (horizontal === "LEFT") {
        addLayoutClass(`left:${pxCode(x - x0)}`);
      } else if (horizontal === "CENTER") {
        if (w) {
          addLayoutClass(`width:${pxCode(w)}`);
        }
        addLayoutClass(`left:50% transform:translateX(-50%)`);
      } else if (horizontal === "SCALE") {
        addLayoutClass(`left:${pxCode(x - x0)}`);
        addLayoutClass(`right:${pxCode(w - w0 - x + x0)}`);
      }
    } else {
      if (isFreeParent) {
        addLayoutClass(`top:${pxCode(y - y0)}`);
        addLayoutClass(`left:${pxCode(x - x0)}`);
      }
      if (nodes?.length) {
        addLayoutClass(`min-width:fit-content`)
        addLayoutClass(`min-height:fit-content`)
      } else {
        if (w) { addLayoutClass(`min-width:${pxCode(w)}`); }
        if (h) { addLayoutClass(`min-height:${pxCode(h)}`); }
      }
    }
  }


  if (styling?.layoutMode) {
    // apply flexbox
    const { layoutMode, layoutWrap, itemSpacing } = styling;
    const isFlexRowMode = layoutMode === "HORIZONTAL";

    addClass(`display:flex flex-direction:${isFlexRowMode ? "row" : "column"} ${layoutWrap === "NO_WRAP" ? "flex-wrap:nowrap" : ""}`);
    if (itemSpacing) { addClass(`gap:${pxCode(itemSpacing)}`); }

    const { primaryAxisSizingMode, counterAxisSizingMode } = styling;
    if (primaryAxisSizingMode === "FIXED") {

      addClass(`flex-shrink:0`);
      addClass(flexFixedSize_overflow_classMap[layoutMode]);

      if (isAutoItem) {
        const isCoherent = layout?.layoutPositioning === 'AUTO-HORIZONTAL' && isFlexRowMode || layout?.layoutPositioning === 'AUTO-VERTICAL' && !isFlexRowMode;
        if (isCoherent) {
          addClass(isFlexRowMode ? `width:${w ? `${pxCode(w)}` : "100%"}` : `min-height:${h ? `${pxCode(h)}` : "100%"}`);
        } else {
          addClass(`self-stretch`);
        }
      } else {
        addClass(isFlexRowMode ? `width:${w ? `${pxCode(w)}` : "100%"}` : `min-height:${h ? `${pxCode(h)}` : "100%"}`);
      }
    }

    // "FIXED": The counter axis length is determined by the user or plugins, unless the layoutAlign is set to “STRETCH” or layoutGrow is 1.
    // "AUTO": The counter axis length is determined by the size of the children.If set, the auto - layout frame will automatically resize along the counter axis to fit its children.
    if (counterAxisSizingMode === "FIXED" && layoutAlign !== "STRETCH" && layoutGrow !== 1) {
      addClass(isFlexRowMode ? `width:${w ? `${pxCode(w)}` : "100%"}` : `min-height:${h ? `${pxCode(h)}` : "100%"}`);
    }

    const { primaryAxisAlignItems, counterAxisAlignItems } = styling;
    if (primaryAxisAlignItems) { addClass(classMap_primaryAxisAlignItems[primaryAxisAlignItems]); }
    if (counterAxisAlignItems) { addClass(classMap_counterAxisAlignItems[counterAxisAlignItems]); }
  }
}
