import { executeOperator, Operator, OperatorConfig } from "@fiftyone/operators";
import * as state from "./state";
import { useRecoilState } from "recoil";
import { useTheme } from "@fiftyone/components";

export class TriggerUpdate extends Operator {
  get config() {
    return new OperatorConfig({
      name: "trigger_update",
      label: "Trigger Update",
      unlisted: true,
    });
  }
  useHooks(): {} {
    const [plot_operator, setPlotOperator] = useRecoilState(
      state.atoms.plot_operator
    );
    return {
      plot_operator,
      theme: useTheme(),
    };
  }
  async execute(ctx) {
    const theme = ctx.hooks.theme;
    if (ctx.hooks.plot_operator) {
      await executeOperator(ctx.hooks.plot_operator, {});
    }
  }
}
