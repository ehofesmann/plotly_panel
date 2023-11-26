import fiftyone.operators.types as types
from fiftyone import ViewField as F
import fiftyone.utils.random as four

import plotly.express as px
import plotly.graph_objects as go


def get_button():
    # Return a FiftyOne operator placement Button oncluding the text and optional SVG to open your panel
    return types.Button(
        label="Open example plots",
        prompt=False,
    )


def get_figures(samples):
    # Return a list of plotly express or plotly graph_objects figures
    figures = []
    figures.append(make_line_chart(samples))
    figures.append(make_pie_chart(samples))
    figures.append(make_bar_chart(samples))
    figures.append(make_line_chart_2(samples))

    return figures


def make_bar_chart(samples):
    bar_vals = samples.count_values("ground_truth.detections.label")
    fig = go.Figure(
        data=[
            go.Bar(
                x=list(bar_vals.keys()),
                y=list(bar_vals.values()),
                textposition="auto",
            )
        ]
    )
    fig.update(layout_title_text="Distribution of `ground_truth` labels")
    return fig


def make_pie_chart(samples):
    pie_vals = samples.count_values("tags")
    if samples.name == "quickstart" and len(pie_vals) < 2:
        samples.untag_samples(pie_vals.keys())
        four.random_split(
            samples, {"test": 0.2, "validation": 0.3, "train": 0.5}
        )
        pie_vals = samples.count_values("tags")

    fig = go.Figure(
        data=[
            go.Pie(
                labels=list(pie_vals.keys()),
                values=list(pie_vals.values()),
                hole=0.3,
            )
        ]
    )
    fig.update(layout_title_text="Splits")
    return fig


def make_line_chart(samples):
    counts, bins, _ = samples.histogram_values(
        "predictions.detections.confidence", bins=50
    )
    fig = px.line(x=bins[:-1], y=counts)
    fig.update_layout(
        title="Predictions confidence",
        xaxis_title="Confidence",
        yaxis_title="Count",
    )

    return fig


def make_line_chart_2(samples):
    bbox_area = (
        F("$metadata.width")
        * F("bounding_box")[2]
        * F("$metadata.height")
        * F("bounding_box")[3]
    )
    area_bounds = samples.set_field(
        "ground_truth.detections.area", bbox_area
    ).bounds("ground_truth.detections.area")
    label_counts = samples.count_values("ground_truth.detections.label")
    label_counts = dict(sorted(label_counts.items(), key=lambda item: item[1]))
    top_3_classes = list(label_counts.keys())[-3:]
    series = []
    bins = []
    fig = go.Figure()

    for c in top_3_classes:
        c_counts, bins, _ = (
            samples.set_field("ground_truth.detections.area", bbox_area)
            .filter_labels("ground_truth", F("label") == c)
            .histogram_values(
                "ground_truth.detections.area", bins=50, range=area_bounds
            )
        )
        fig.add_trace(
            go.Scatter(x=bins, y=c_counts, mode="lines+markers", name=c)
        )

    fig.update_layout(
        title="Detection area distribution (top 3 classes)",
        xaxis_title="Area (pixels^2)",
        yaxis_title="Count",
    )
    return fig


if __name__ == "__main__":
    import fiftyone.zoo as foz

    dataset = foz.load_zoo_dataset("quickstart")
    figs = get_figures(dataset)
    for fig in figs:
        fig.show()
