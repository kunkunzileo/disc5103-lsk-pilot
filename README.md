# BIM-Based Campus Evacuation Resilience and Interactive 2D/3D Web Rerouting Prototype

DISC 5103 · Group 4 · HKUST Lee Shau Kee Business Building

[Open the LSK ground-floor map](https://kunkunzileo.github.io/disc5103-lsk-pilot/)

Select a room on the full-floor plan to zoom to its walking route. For **G003** and **Pacific Coffee**, the first line leads to the closest available exit among the walks checked for that room. Tap the coloured line to mark a location, or tap the selected exit to mark it unavailable. The browser immediately compares the remaining checked routes and displays the new exit, walking distance and change. Clearing the mark restores the initial route. The **全图** button returns to the overview. Each phone runs its own simulation.

| Starting point | All reviewed routes available | Initial exit marked unavailable | Extra walk |
| --- | --- | --- | ---: |
| G003 | opposite vestibule · 18.44 m | Door 4 · 28.50 m | +10.06 m |
| Pacific Coffee | Door 4 · 17.28 m | opposite vestibule · 36.76 m | +19.48 m |

Lengths follow walking polylines from the room origin to the outdoor threshold. The new cases passed 702 fixed-element intersection checks in the Revit working model. The group confirmed ordinary visitor access along the café approach to Door 4. For each origin, its initial walk is shorter than the straight-line distance to any of the other four registered exit groups. This confirms which of the five groups is closest at baseline. The comparison covers the reviewed routes for each origin. If a mark also affects every reviewed alternative, the interface reports that another route still needs checking. Independent on-site distance measurements remain pending.

### The other three starting points

**G041** and **G042** are neighbouring discussion rooms with walks to two vestibules. **G005**, a teaching recording venue, demonstrates travelling through different room doors to the same destination.

### Fictional 2D/3D exercise

The separate teaching floor has 18 fictional rooms. Select a room, simulate a closure and switch between 2D and 3D to compare the route and distance. [Open the teaching exercise](https://kunkunzileo.github.io/disc5103-lsk-pilot/personal/index.html).

### Run locally

Download the repository and open `index.html`. Keep the `personal` folder alongside it for the 2D/3D exercise.
