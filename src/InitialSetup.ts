import {
  registerOperator,
  executeOperator,
  Operator,
  OperatorConfig,
  useOperatorExecutor,
} from "@fiftyone/operators";
import * as state from "./state";
import { useRecoilState } from "recoil";
import { Button, useTheme } from "@fiftyone/components";

export class InitialSetup extends Operator {
  get config() {
    return new OperatorConfig({
      name: "initial_setup",
      label: "Initial setup",
      unlisted: true,
    });
  }
  useHooks(): {} {
    const [plot_operator, setPlotOperator] = useRecoilState(
      state.atoms.plot_operator
    );
    return {
      plot_operator,
      setPlotOperator,
    };
  }
  async execute(ctx) {
    ctx.hooks.setPlotOperator(ctx.params.plot_operator);
    console.log("initial setup");
    console.log(ctx.hooks.plot_operator);
  }
}
