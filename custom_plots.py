import fiftyone.operators.types as types

import plotly.express as px
import plotly.graph_objects as go


def get_button():
    return types.Button(
        label="Open plot panel test",
        prompt=False,
    )


def get_figures(samples):
    df = px.data.gapminder().query("country=='Canada'")
    fig = px.line(df, x="year", y="lifeExp", title="Life expectancy in US")
    title = "Life expectancy in US"
    df = px.data.gapminder().query("country=='Cana'")
    fig4 = px.line(
        df, x="year", y="lifeExp", title="Life expectancy in Canada"
    )
    title4 = "Life expectancy in Canada"

    df = (
        px.data.gapminder()
        .query("year == 2007")
        .query("continent == 'Europe'")
    )
    df.loc[
        df["pop"] < 2.0e6, "country"
    ] = "Other countries"  # Represent only large countries
    fig3 = px.pie(
        df,
        values="pop",
        names="country",
        title="Population of European continent",
    )
    title3 = "Population of European continent"

    bar_vals = samples.count_values("ground_truth.detections.label")
    fig2 = go.Figure(
        data=[
            go.Bar(
                x=list(bar_vals.keys()),
                y=list(bar_vals.values()),
                textposition="auto",
            )
        ]
    )

    fig5 = go.Figure(
        data=[
            go.Table(
                header=dict(
                    values=["A Scores", "B Scores"],
                    # font_color=color_secondary,
                    # line_color=color_bg,
                    # fill_color=color_divider,
                ),
                cells=dict(
                    values=[[100, 90, 80, 90], [95, 85, 75, 95]],
                    # font_color=color_secondary,
                    # line_color=color_bg,
                    # fill_color=color_divider,
                ),
            )
        ]
    )

    return [fig, fig2, fig3, fig4, fig5]
