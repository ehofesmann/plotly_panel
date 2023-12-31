import { Operator, OperatorConfig } from "@fiftyone/operators";
import * as state from "./state";
import { useRecoilState } from "recoil";

export class UpdatePlots extends Operator {
  get config() {
    return new OperatorConfig({
      name: "update_plots",
      label: "Update Plots",
      unlisted: true,
    });
  }

  useHooks() {
    const [plots, setPlots] = useRecoilState(state.atoms.plots);
    return {
      updatePlots: (newplots) => {
        setPlots((current) => newplots);
      },
    };
  }

  async execute(ctx) {
    const plots = ctx.params.plots;
    ctx.hooks.updatePlots(plots);
  }
}
