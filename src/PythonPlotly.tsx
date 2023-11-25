import * as fos from "@fiftyone/state";
import { useRecoilValue } from "recoil";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button, useTheme } from "@fiftyone/components";
import Plot from "react-plotly.js";
import {
  types,
  useOperatorExecutor,
  Operator,
  OperatorConfig,
  registerOperator,
  executeOperator,
} from "@fiftyone/operators";

export function PythonPlotly() {
  const theme = useTheme();

  const dataset = useRecoilValue(fos.dataset);
  const view = useRecoilValue(fos.view);
  const filters = useRecoilValue(fos.filters);

  const getPlotlyPlots = useOperatorExecutor(
    "@ehofesmann/dataset_dashboard/get_plotly_plots"
  );
  useEffect(() => {
    getPlotlyPlots.execute({color_text: theme.text.primary, color_divider: theme.divider, color_bg: theme.background.level2, color_text_secondary: theme.text.secondary});
  }, [view, filters, theme]);

  const plotlyPlots = getPlotlyPlots.result?.plots

  if (getPlotlyPlots.isLoading) return <h3>Loading...</h3>;
  if (plotlyPlots){
    if (plotlyPlots.length == 0){
      return <h3> No plots found. </h3>;
    }
    let retval = []
    for (let i = 0; i < getPlotlyPlots.result?.plots.length; i++) {
      retval.push(      <Plot
        data={JSON.parse(getPlotlyPlots.result?.plots[i]).data}
        layout={JSON.parse(getPlotlyPlots.result?.plots[i]).layout}
      />   )
    }
    return retval;
  } else {
    return <h3>Loading...</h3>;
  }
}