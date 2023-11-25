import fiftyone.operators as foo
import fiftyone.operators.types as types

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
        ctx.trigger(
            f"{self.plugin_name}/update_plots",
            params=dict(plots=[plot.to_json() for plot in plots]),
        )


class TestOpenPanel(foo.Operator):
    @property
    def config(self):
        return foo.OperatorConfig(
            name="test_open_panel",
            label="Get operators that return plots",
        )

    def resolve_placement(self, ctx):
        return types.Placement(
            types.Places.SAMPLES_GRID_SECONDARY_ACTIONS,
            types.Button(
                label="Test plotly panel",
                prompt=False,
            ),
        )

    def execute(self, ctx):
        ctx.trigger(
            "@ehofesmann/dataset_dashboard/initial_setup",
            params=dict(
                plot_operator="@ehofesmann/dataset_dashboard/get_plotly_plots"
            ),
        )
        ctx.trigger(
            "open_panel",
            params=dict(
                name="PythonPlotlyPlugin", isActive=True, layout="horizontal"
            ),
        )


def register(p):
    p.register(GetPlotlyPlots)
    p.register(TestOpenPanel)
