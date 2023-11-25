import { registerComponent, PluginComponentType } from "@fiftyone/plugins";
import { PythonPlotly } from "./PythonPlotly";

registerComponent({
  name: "PythonPlotlyPlugin",
  label: "Dataset dashboard",
  component: PythonPlotly,
  type: PluginComponentType.Panel,
  activator: myActivator,
});

function myActivator({ dataset }) {
  // Example of activating the plugin in a particular context
  // return dataset.name === 'quickstart'

  return true;
}
