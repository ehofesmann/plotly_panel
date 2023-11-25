import fiftyone.operators as foo

from . import custom_plots


def _update_colors(
    fig, color_bg, color_text, color_secondary, color_divider, axis=True
):
    title = fig.layout.title.text
    fig.update_layout(
        plot_bgcolor=color_bg,
        paper_bgcolor=color_bg,
        title={"text": title, "font": {"color": color_text}},
        xaxis={"color": color_secondary, "gridcolor": color_divider},
        yaxis={"color": color_secondary, "gridcolor": color_divider},
        font={"color": color_secondary},
        overwrite=True,
    )


def generate_plots(
    samples,
    color_bg=None,
    color_text=None,
    color_secondary=None,
    color_divider=None,
):
    figs = custom_plots.custom_plots(
        samples,
        color_bg=color_bg,
        color_text=color_text,
        color_secondary=color_secondary,
        color_divider=color_divider,
    )
    for fig in figs:
        _update_colors(
            fig, color_bg, color_text, color_secondary, color_divider
        )

    return figs


class GetPlotlyPlots(foo.Operator):
    @property
    def config(self):
        return foo.OperatorConfig(
            name="get_plotly_plots",
            label="Get serialized plotly plots",
            unlisted=True,
        )

    def execute(self, ctx):
        try:
            if ctx.dataset.view() == ctx.view:
                samples = ctx.dataset
            else:
                samples = ctx.view
            plots = generate_plots(
                samples,
                color_bg=ctx.params.get("color_bg", None),
                color_divider=ctx.params.get("color_divider", None),
                color_text=ctx.params.get("color_text", None),
                color_secondary=ctx.params.get("color_text_secondary", None),
            )
            return {"plots": [[plot.to_json()] for plot in plots]}
        except:
            return {}


def register(p):
    p.register(GetPlotlyPlots)
