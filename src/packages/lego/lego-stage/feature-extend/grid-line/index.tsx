import React from "react";
import { IStageApis } from "@packages/lego/interface";
import GridLine, { defaultGridLine } from "./grid-line";

export const GridLineExtend = ({ stage }: { stage: IStageApis }) => {
  const { gridLine: propsGridLine, size } = stage.store();

  const gridLine = { ...defaultGridLine, ...(propsGridLine || {}) };
  const visible = gridLine && gridLine.enable && gridLine.visible;
  return (
    <>
      {visible && <GridLine {...gridLine} width={size.width} height={size.height} />}
    </>
  );

};
