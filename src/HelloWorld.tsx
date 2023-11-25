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

export function HelloWorld() {
  const executor = useOperatorExecutor("@ehofesmann/dataset_dashboard/count_samples");
  const theme = useTheme();

  const onClickAlert = useCallback(() =>
    executeOperator("@ehofesmann/dataset_dashboard/show_alert")
  );
  const dataset = useRecoilValue(fos.dataset);
  const view = useRecoilValue(fos.view);
  const filters = useRecoilValue(fos.filters);


  if (executor.isLoading) return <h3>Loading...</h3>;
  if (executor.result) return <h3>Dataset size: {executor.result.count}</h3>;
  
  const [plot, setPlot] = useState(0);

  const getPlotlyPlots = useOperatorExecutor(
    "@ehofesmann/dataset_dashboard/get_plotly_plots"
  );
  useEffect(() => {
    getPlotlyPlots.execute({color_text: theme.text.primary, color_divider: theme.divider, color_bg: theme.background.level2, color_text_secondary: theme.text.secondary});
  }, [view, filters, theme]);

  if (getPlotlyPlots.isLoading) return <h3>Loading...</h3>;
  if (getPlotlyPlots.result?.plots){

    return (
      <>
      <Plot
        data={JSON.parse(getPlotlyPlots.result?.plots[0]).data}
        layout={JSON.parse(getPlotlyPlots.result?.plots[0]).layout}
      />      
      <Plot
        data={JSON.parse(getPlotlyPlots.result?.plots[1]).data}
        layout={JSON.parse(getPlotlyPlots.result?.plots[1]).layout}
      />      
      <Plot
        data={JSON.parse(getPlotlyPlots.result?.plots[2]).data}
        layout={JSON.parse(getPlotlyPlots.result?.plots[2]).layout}
      />   
      <Plot
        data={JSON.parse(getPlotlyPlots.result?.plots[3]).data}
        layout={JSON.parse(getPlotlyPlots.result?.plots[3]).layout}
      />                         
    </>
    );
  } else {
    return <h3>Loading...</h3>;
  }


  // const plotlyPlots = useMemo(() => {
  //   return getPlotlyPlots?.result?.plots;
  // }, [getPlotlyPlots]);
  // const loadingPlotlyPlots = useMemo(() => {
  //   return getPlotlyPlots?.isExecuting;
  // }, [getPlotlyPlots]);

  //console.log(plotlyPlots)
  return (
    <>
      <Button onClick={() => getPlotlyPlots.execute()}>Get plots</Button>
      <Plot
        data={[]}
        layout={[]}
      />      
    </>
  );
}

//   return (
//     <>
//       <h1>Hello, dataset dashboard!</h1>
//       <h2>
//         You are viewing the <strong>{dataset.name}</strong> dataset <strong>{view?.length}</strong> <strong>{theme.text.secondary}</strong>
//       </h2>
//       <Button onClick={() => executor.execute()}>Count samples</Button>
//       <Button onClick={onClickAlert}>Show alert</Button>
//       <Plot
//         data={[
//           {
//             x: [1, 2, 3],
//             y: [2, 6, 3],
//             type: 'scatter',
//             mode: 'lines+markers',
//             marker: {color: 'red'},
//           },
//           {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
//         ]}
//         layout={{
//           width: 320,
//           height: 240,
//           xaxis: {color: theme.text.secondary},
//           yaxis: {color: theme.text.secondary},
//           title: {
//             text: 'A Fancy Plot',
//             font: {color: theme.text.primary}
//           },
//           paper_bgcolor: theme.background.level2,
//           plot_bgcolor: theme.background.level2,
//           legend: {
//             x: 1,
//             y: 1,
//             bgcolor: theme.background.level2,
//             font: {
//               color: theme.text.secondary,
//             },
//           },
//         }}
//       />
//       <Plot
//         data={[
//           {
//             values: [19, 26, 55],
//             labels: ['Residential', 'Non-Residential', 'Utility'],
//             type: 'pie'
//           }
//         ]}
//         layout={{
//           height: 400,
//           width: 500,
//           xaxis: {color: theme.text.secondary},
//           yaxis: {color: theme.text.secondary},
//           title: {
//             text: 'A Fancy Plot',
//             font: {color: theme.text.primary}
//           },
//           paper_bgcolor: theme.background.level2,
//           plot_bgcolor: theme.background.level2,
//           legend: {
//             bgcolor: theme.background.level2,
//             font: {
//               color: theme.text.secondary,
//             },
//           },
//         }}
//       />      
//     </>
//   );
// }

class AlertOperator extends Operator {
  get config() {
    return new OperatorConfig({
      name: "show_alert",
      label: "Show alert",
      unlisted: true,
    });
  }
  async execute() {
    alert(`Hello from plugin ${this.pluginName}`);
  }
}

registerOperator(AlertOperator, "@ehofesmann/dataset_dashboard");
