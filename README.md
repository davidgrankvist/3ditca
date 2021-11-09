# 3ditca
[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in 3D.

## How does it work?
This 3D generalization uses [Moore neighborhoods](https://en.wikipedia.org/wiki/Moore_neighborhood). The limits for changing cell states are configured by the user.

Cell states are updated in parallel using [gpu.js](https://gpu.rocks/) and visualized using [three.js](https://threejs.org/).
