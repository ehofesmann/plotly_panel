import { registerComponent, PluginComponentType } from "@fiftyone/plugins";
import * as fos from "@fiftyone/state";
import * as state from "./state";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { useTheme } from "@fiftyone/components";
import Plot from "react-plotly.js";
import { TriggerUpdate } from "./TriggerUpdate";
import { UpdatePlots } from "./UpdatePlots";
import { InitialSetup } from "./InitialSetup";
import { useOperatorExecutor, registerOperator } from "@fiftyone/operators";

const PLUGIN_NAME = "@ehofesmann/dataset_dashboard";

export function PythonPlotlyPlugin() {
  const theme = useTheme();

  const view = useRecoilValue(fos.view);
  const filters = useRecoilValue(fos.filters);
  const plots = useRecoilValue(state.atoms.plots);

  const updater = useOperatorExecutor(`${PLUGIN_NAME}/trigger_update`);

  useEffect(() => {
    updater.execute({});
  }, [view, filters, theme]);

  let retval = [];
  if (plots.length == 0) {
    return <h3> No plots found. </h3>;
  }
  for (let i = 0; i < plots.length; i++) {
    const parsed_plot = JSON.parse(plots[i]);
    retval.push(
      <Plot
        data={parsed_plot.data}
        style={{ zIndex: 1 }}
        config={{
          displaylogo: false,
        }}
        layout={{
          title: { font: { color: theme.text.primary } },
          xaxis: {
            color: theme.text.secondary,
            gridcolor: theme.background.level1,
          },
          yaxis: {
            color: theme.text.secondary,
            gridcolor: theme.background.level1,
          },
          font: {
            color: theme.text.secondary,
            family: "var(--fo-fontFamily-body)",
            size: 14,
          },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          ...parsed_plot.layout,
        }}
      />
    );
  }
  return retval;
}

registerComponent({
  name: "PythonPlotlyPlugin",
  label: "Dataset dashboard",
  component: PythonPlotlyPlugin,
  type: PluginComponentType.Panel,
  activator: () => true,
});

registerOperator(TriggerUpdate, PLUGIN_NAME);
registerOperator(UpdatePlots, PLUGIN_NAME);
registerOperator(InitialSetup, PLUGIN_NAME);
