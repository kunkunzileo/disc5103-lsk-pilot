# BIM-Based Campus Evacuation Resilience and Interactive 2D/3D Web Rerouting Prototype

DISC 5103 · Group 4 · HKUST Lee Shau Kee Business Building

[Open the full ground-floor map](https://kunkunzileo.github.io/disc5103-lsk-pilot/)

The map opens on the full LSK ground floor with five selectable starting points. Select a room on the plan to zoom to its modelled walking route and read the distance to the reviewed destination. Pinch on a phone or use the mouse wheel on a computer. The **全图** button returns to the overview and preserves the current selection.

| Starting point | Use | What the case demonstrates |
| --- | --- | --- |
| G041 | Discussion room | Compare walks to two vestibules from the first discussion room |
| G042 | Discussion room | An adjacent start has a different shorter vestibule walk |
| G005 | Teaching recording venue | Change room doors while keeping the same destination |
| G003 | SBM classroom | 18.44 m to the reviewed vestibule via a glazed internal door and the public hall |
| Pacific Coffee | Café | 36.76 m to the reviewed vestibule via an open café frontage and the public hall |

The two new walks reach the same vestibule. The café opens directly onto the public hall, while the classroom walk passes through an internal door. Across their 21 segments, 189 intersection tests found no contact with the fixed model elements checked. Each distance follows one reviewed walk. Independent on-site measurements and confirmation of current conditions are pending.

### Fictional 2D/3D exercise

The separate teaching floor has 18 fictional rooms. Select a room, simulate a closure and switch between 2D and 3D to compare the route and distance. Each browser keeps its own simulation state. [Open the teaching exercise](https://kunkunzileo.github.io/disc5103-lsk-pilot/personal/index.html).

### Run locally

Download this repository and open `index.html` to use the LSK map. Keep the `personal` folder alongside it to use the teaching exercise. Both run in the browser.
