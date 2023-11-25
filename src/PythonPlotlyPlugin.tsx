import { registerComponent, PluginComponentType } from "@fiftyone/plugins";
import * as fos from "@fiftyone/state";
import * as state from "./state";
import { atom, useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { useTheme } from "@fiftyone/components";
import Plot from "react-plotly.js";
import { TriggerUpdate } from "./TriggerUpdate";
import { UpdatePlots } from "./UpdatePlots";
import { InitialSetup } from "./InitialSetup";
import {
  ExecutionContext,
  Operator,
  OperatorConfig,
  useOperatorExecutor,
  types,
  registerOperator,
  loadOperators,
} from "@fiftyone/operators";
import {
  Layout,
  SpaceNode,
  usePanels,
  useSpaceNodes,
  useSpaces,
  usePanelStatePartial,
  usePanelContext,
} from "@fiftyone/spaces";
import { panelStatePartialSelector } from "@fiftyone/spaces/src/state.ts";
import {
  Box,
  Slider,
  Button,
  TextField,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SliderProps,
  CircularProgress,
  ButtonProps,
  Alert,
  AlertTitle,
} from "@mui/material";

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
  console.log(plots);
  for (let i = 0; i < plots.length; i++) {
    console.log(plots[i]);
    retval.push(
      <Plot
        data={JSON.parse(plots[i]).data}
        layout={JSON.parse(plots[i]).layout}
      />
    );
  }
  return retval;
  // const getPlotOperators = useOperatorExecutor(
  //   "@ehofesmann/dataset_dashboard/get_operators"
  // );
  // useEffect(() => {
  //   getPlotOperators.execute({
  //     color_text: theme.text.primary,
  //     color_divider: theme.divider,
  //     color_bg: theme.background.level2,
  //     color_text_secondary: theme.text.secondary,
  //   });
  // }, [view, filters, theme]);
  // // console.log(getPlotOperators.result);

  // //const plotOperator =     "@ehofesmann/dataset_dashboard/get_plotly_plots";
  // const plotOperators = (getPlotOperators.result?.operators || []);
  // console.log(plotOperators)

  // const [plotOperator, setPlotOperator] = useState("");
  // const handlePlotOperatorChange = (event) => {
  //   setPlotOperator(event.target.value);
  // };

  // var getPlotlyPlots = useOperatorExecutor("@ehofesmann/dataset_dashboard/get_plotly_plots");

  // //console.log(loadOperators(fos.dataset));
  // if (plotOperator == "" && plotOperators !== null){
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "left" }}>
  //     <FormControl>
  //       <InputLabel id="my-select-label">Plots</InputLabel>
  //       <Select
  //         labelId="demo-simple-select-label"
  //         id="demo-simple-select"
  //         value={plotOperator}
  //         label="Plots"
  //         onChange={handlePlotOperatorChange}
  //         size="small"
  //         sx={{ minWidth: 100 }}
  //       >
  //         {plotOperators.map((item) => (
  //           <MenuItem key={item} value={item}>
  //             {item}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </FormControl>
  //   </Box>
  //   )
  // }
  // getPlotlyPlots = useOperatorExecutor(plotOperator);

  // if (plotOperator == ""){
  //   return <h3>Loading...</h3>;
  // }

  // console.log(plotOperator);
  //getPlotlyPlots = useOperatorExecutor("@ehofesmann/dataset_dashboard/get_plotly_plots");
  // useEffect(() => {
  //   getPlotlyPlots.execute({
  //     color_text: theme.text.primary,
  //     color_divider: theme.divider,
  //     color_bg: theme.background.level2,
  //     color_text_secondary: theme.text.secondary,
  //   });
  // }, [view, filters, theme]);
  // const plotlyPlots = getPlotlyPlots.result?.plots;
  // if (plotlyPlots.length == 0) {
  //   return <h3> No plots found. </h3>;
  // }
  // if (plotlyPlots.length != 0) {
  //   let retval = [];
  //   for (let i = 0; i < plotlyPlots.length; i++) {
  //     retval.push(
  //       <Plot
  //         data={JSON.parse(plotlyPlots[i]).data}
  //         layout={JSON.parse(plotlyPlots[i]).layout}
  //       />
  //     );
  // }
  // return retval;
  // }  else {
  //   return <h3>Loading...</h3>;
  // }
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
registerOperator(TriggerUpdate, PLUGIN_NAME);
registerOperator(UpdatePlots, PLUGIN_NAME);
registerOperator(InitialSetup, PLUGIN_NAME);
