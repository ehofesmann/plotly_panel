import { Operator, OperatorConfig } from "@fiftyone/operators";
import * as state from "./state";
import { useRecoilState } from "recoil";

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
  }
}
