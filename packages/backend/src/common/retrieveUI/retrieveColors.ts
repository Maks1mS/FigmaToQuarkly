import { rgbTo6hex } from "../color";
import { htmlColor, htmlGradientFromFills } from "../../quarkly/builderImpl/htmlColor";
import { calculateContrastRatio } from "./commonUI";
import { FrameworkTypes } from "../../code";

export type ExportSolidColor = {
  hex: string;
  colorName: string;
  exportValue: string;
  contrastWhite: number;
  contrastBlack: number;
  meta?: string
};

export const retrieveGenericSolidUIColors = (
  framework: FrameworkTypes
): Array<ExportSolidColor> => {
  const selectionColors = figma.getSelectionColors();
  if (!selectionColors || selectionColors.paints.length === 0) return [];

  const colors: Array<ExportSolidColor> = [];
  selectionColors.paints.forEach((paint) => {
    const fill = convertSolidColor(paint, framework);
    if (fill) {
      const exists = colors.find(col => col.exportValue === fill.exportValue)
      if (!exists) {
        colors.push(fill);
      }
    }
  });

  return colors.sort((a, b) => a.hex.localeCompare(b.hex));
};

const convertSolidColor = (
  fill: Paint,
  framework: FrameworkTypes
): ExportSolidColor | null => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 1, g: 1, b: 1 };

  if (fill.type !== "SOLID") return null;

  const opacity = fill.opacity ?? 1.0;
  const output = {
    hex: rgbTo6hex(fill.color).toUpperCase(),
    colorName: "",
    exportValue: "",
    contrastBlack: calculateContrastRatio(fill.color, black),
    contrastWhite: calculateContrastRatio(fill.color, white),
  };

  output.exportValue = htmlColor(fill.color, opacity);

  return output;
};

type ExportLinearGradient = { cssPreview: string; exportValue: string };

export const retrieveGenericLinearGradients = (
  framework: FrameworkTypes
): Array<ExportLinearGradient> => {
  const selectionColors = figma.getSelectionColors();
  const colorStr: Array<ExportLinearGradient> = [];

  selectionColors?.paints.forEach((paint) => {
    if (paint.type === "GRADIENT_LINEAR") {
      let exportValue = htmlGradientFromFills([paint]);
      colorStr.push({
        cssPreview: htmlGradientFromFills([paint]),
        exportValue,
      });
    }
  });

  return colorStr;
};
