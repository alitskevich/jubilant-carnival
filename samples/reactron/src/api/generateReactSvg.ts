export const generateReactSvg = (componentClassName: string) => {
  const output = `/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { FC } from "react";

export const ${componentClassName}: FC = () => {
  return <>{null}</>;
}`;

  return output;
};
