import { atom } from "recoil";

export const atoms = {
  plots: atom({
    key: "plots",
    default: [],
  }),
  plot_operator: atom({
    key: "plot_operator",
    default: "",
  }),
};
