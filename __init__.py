import fiftyone.operators as foo
import fiftyone.operators.types as types
from fiftyone import ViewField as F

import plotly.express as px
import plotly.graph_objects as go

import random

def _update_colors(fig, color_bg, color_text, color_secondary, color_divider, title, axis=True):
    fig=fig.update_layout(
        plot_bgcolor=color_bg, 
        paper_bgcolor=color_bg, 
        title= {
            "text": title,
            "font": {"color": color_text}
        },
        overwrite=True,
    )
    if axis:
        fig=fig.update_layout(
            xaxis={"color": color_secondary, "gridcolor": color_divider}, 
            yaxis={"color": color_secondary, "gridcolor": color_divider}, 
            overwrite=True,
        )
    else:
        fig=fig.update_layout(
            font={"color": color_secondary}, 
            overwrite=True,
        )
def generate_plots(samples, color_bg=None, color_text=None, color_secondary=None, color_divider=None):
    df = px.data.gapminder().query("country=='Canada'")
    fig = px.line(df, x="year", y="lifeExp", title='Life expectancy in US')
    title = "Life expectancy in US"
    df = px.data.gapminder().query("country=='Cana'")
    fig4 = px.line(df, x="year", y="lifeExp", title='Life expectancy in Canada')
    title4 = "Life expectancy in Canada"

    df = px.data.gapminder().query("year == 2007").query("continent == 'Europe'")
    df.loc[df['pop'] < 2.e6, 'country'] = 'Other countries' # Represent only large countries
    fig3 = px.pie(df, values='pop', names='country', title='Population of European continent')
    title3='Population of European continent'

    bar_vals = samples.count_values("ground_truth.detections.label")
    fig2 = go.Figure(data=[go.Bar(
            x=list(bar_vals.keys()), y=list(bar_vals.values()),
            textposition='auto',
        )])
    title2 = "Ground truth labels"


    _update_colors(fig, color_bg, color_text, color_secondary, color_divider, title)
    _update_colors(fig2, color_bg, color_text, color_secondary, color_divider, title2)
    _update_colors(fig3, color_bg, color_text, color_secondary, color_divider, title3, axis=False)
    _update_colors(fig4, color_bg, color_text, color_secondary, color_divider, title4)

    fig5 = go.Figure(data=[go.Table(header=dict(values=['A Scores', 'B Scores'], font_color=color_secondary, line_color=color_bg, fill_color=color_divider),
                 cells=dict(values=[[100, 90, 80, 90], [95, 85, 75, 95]], font_color=color_secondary, line_color=color_bg, fill_color=color_divider))
                     ])
    fig5.update_layout(
        plot_bgcolor=color_bg, 
        paper_bgcolor=color_bg, 
        title= {
            "text": "my table",
            "font": {"color": color_text}
        },
        overwrite=True,
    )


    return [fig, fig2, fig3, fig4, fig5]


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
            plots = generate_plots(samples, color_bg=ctx.params.get("color_bg", None), color_divider=ctx.params.get("color_divider", None), color_text=ctx.params.get("color_text", None), color_secondary=ctx.params.get("color_text_secondary", None))
            retval =  {"plots": [[plot.to_json()] for plot in plots]}
            ctx.log(retval)

            return retval
        except:
            return {}


def register(p):
    p.register(GetPlotlyPlots)