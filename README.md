## Plotly Panel

This plugin provides a mechanism to add custom Plotly plots into a panel in your FiftyOne App requiring only Plotly figures implemented in Python.

<!---  ![image](https://github.com/ehofesmann/dataset_dashboard/assets/21222883/7780f99c-9021-48f3-bf37-5c1dd1abb5a0) --->



https://github.com/ehofesmann/plotly_panel/assets/21222883/38b648a2-0041-4e6f-bd09-45cda8ef6f57




## Installation

```shell
fiftyone plugins download https://github.com/ehofesmann/plotly_panel
```

Refer to the [main README](https://github.com/voxel51/fiftyone-plugins) for
more information about managing downloaded plugins and developing plugins
locally.

## Run Example

After installing this plugin, you can try the example panel yourself on the `quickstart` dataset.
```python
import fiftyone.zoo as foz

dataset = foz.load_zoo_dataset("quickstart")
session = fo.launch_app(dataset)
```

## Adding your own plots

### Step 1: Create your own plugin

Copy the `__init__.py`, `custom_plots.py`, and `fiftyone.yml` files from this repository into your own [FiftyOne Plugin directory](https://docs.voxel51.com/plugins/developing_plugins.html).

### Step 2: Update plugin name

Update the name of the plugin in `fiftyone.yml` from `name: "@ehofesmann/plotly_panel"` to your new plugin name.

### Step 3: Add your own ploty figures

In the `custom_plots.py` file of your new plugin, optionally implement the `get_button()` function to customize the button to open your panel in the FiftyOne grid. Then update the `get_figures(samples)` function to generate your custom Plotly figures using your favorite Python Plotly package, returning a list of figures.
