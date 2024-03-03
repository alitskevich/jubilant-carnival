import { mapEntries, qname } from "ultimus";

export const generateReactStory = (componentClassName: string, metadata: any = {}) => {
  const { description, title, group = "design", labels, cases } = metadata;

  // const propType = `{\n${props.map((p: any) => `  ${p.id}${p.required ? "" : "?"}: Types.${p.type ?? "TEXT"}; // ${p.description ?? p.id}`).join("\n")}\n}`;
  // const propNames = props.map((p: any) => `${p.id}`).join(", ");
  // const hasProps = !!propNames.length;
  // const propsTypes = hasProps ? propType : "Record<string, never>"

  const casesCode = mapEntries(cases, (key, params) => {
    const args = mapEntries(params, (propName, propValue) => `    ${propName}: "${propValue}",`).join("\n    ");
    const output = ` export const ${componentClassName}_${qname(key)}: Story = {
  args: {
    ${args}
  },
};`;
    return output;
  }).join("\n");

  const output = `// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import { ${componentClassName} } from "./${componentClassName}";

/**
 * Story for ${componentClassName} Component.
 * ${description}
 */
const meta: Meta<typeof ${componentClassName}> = {
  title: "${group}/${title}",
  component: ${componentClassName},
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ${JSON.stringify(labels ?? [])},
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ${componentClassName}>;

export const ${componentClassName}Default: Story = {};

${casesCode}
`;

  return output;
};
