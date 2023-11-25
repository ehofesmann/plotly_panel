import { registerComponent, PluginComponentType } from "@fiftyone/plugins";
import * as fos from "@fiftyone/state";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import {  useTheme } from "@fiftyone/components";
import Plot from "react-plotly.js";
import {
  useOperatorExecutor,
} from "@fiftyone/operators";

export function PythonPlotlyPlugin() {
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

  if (plotlyPlots){
    if (plotlyPlots.length == 0){
      return <h3> No plots found. </h3>;
    }
    let retval = []
    for (let i = 0; i < plotlyPlots.length; i++) {
      retval.push(      
        <Plot
          data={JSON.parse(plotlyPlots[i]).data}
          layout={JSON.parse(plotlyPlots[i]).layout}
        />   
      )
    }
    return retval;
  } else {
    return <h3>Loading...</h3>;
  }
}
registerComponent({
  name: "PythonPlotlyPlugin",
  label: "Dataset dashboard",
  component: PythonPlotlyPlugin,
  type: PluginComponentType.Panel,
  activator: myActivator,
});

function myActivator({ dataset }) {
  // Example of activating the plugin in a particular context
  // return dataset.name === 'quickstart'

  return true;
}
