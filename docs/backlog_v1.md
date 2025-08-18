# TRBC Development Backlog - Micro Tasks

_The Rebel Black Cat - JS13k 2025_  
_Ordered by developer fun and incremental delivery potential_

## Foundation & Visual Proof

### Basic HTML structure (canvas + minimal CSS)

- [x] Create `index.html` with canvas element
- [x] Add basic CSS: center canvas, set fixed size
- [x] Add page title and meta viewport for mobile

### Canvas 2D context setup (get drawing working)

- [x] Get canvas element in JavaScript
- [x] Get 2D context and test with single rectangle
- [x] Add canvas resize handling for different screens

### Simple grid rendering (20x20 for testing, black/white squares)

- [ ] Create nested loop to draw 20x20 grid
- [ ] Alternate black/white squares (checkerboard pattern)
- [ ] Add grid lines for visual clarity

### Player representation (simple colored square for cat)

- [ ] Define player position variable (x, y)
- [ ] Draw colored square at player position
- [ ] Make player visually distinct from grid (different color/size)

## Touch Interaction

### Touch input detection (tap coordinates for debugging)

- [ ] Add touch event listeners to canvas
- [ ] Convert touch coordinates to grid coordinates
- [ ] Log grid position to console for debugging

### Touch-based movement (tap to move to adjacent tiles)

- [ ] Check if tapped tile is adjacent to player
- [ ] Update player position on valid tap
- [ ] Prevent movement to invalid tiles
- [ ] Add visual feedback for valid moves

### Camera zoom (pinch to zoom in/out)

- [ ] Detect pinch gesture (scale change)
- [ ] Apply zoom to canvas transform
- [ ] Limit min/max zoom levels

### Camera pan (two-finger drag when zoomed)

- [ ] Detect two-finger touch move
- [ ] Update canvas translation on drag
- [ ] Prevent panning outside grid bounds

## Maze Generation _(The Fun Part!)_

### Random noise generation (42% wall density)

- [ ] Create 2D array for maze data
- [ ] Fill array with random walls (42% probability)
- [ ] Render maze array to canvas (black=wall, white=floor)

### Cellular Automata algorithm (neighbor counting + iterations)

- [ ] Write function to count 8-directional neighbors
- [ ] Apply CA rule: 5+ neighbors = wall
- [ ] Run multiple iterations (4 generations)

### Visual maze rendering (watch caves generate in real-time!)

- [ ] Add animation delay between CA iterations
- [ ] Show generation progress step-by-step
- [ ] Add visual indicators for generation state

### Regenerate button (create new mazes instantly)

- [ ] Add HTML button for regeneration
- [ ] Wire button to maze generation function
- [ ] Reset player position after regeneration

## Basic Game Logic

### Game state object (current floor, player position, basic data)

- [ ] Define game state structure (player pos, floor, etc)
- [ ] Initialize game state on page load
- [ ] Create functions to update game state

### Turn system foundation (tap to move, turn counter)

- [ ] Add turn counter to game state
- [ ] Increment turn on each move
- [ ] Display turn counter on screen

### Exit placement (opposite corner from start)

- [ ] Define exit position (opposite corner logic)
- [ ] Render exit with distinct visual (different color)
- [ ] Ensure exit is on floor tile, not wall

### Basic win condition (reach exit = next floor)

- [ ] Check if player reached exit position
- [ ] Display win message/alert
- [ ] Generate new floor on win

## Witch AI _(Where It Gets Interesting)_

### Witch entity system (position, state, behavior type)

- [ ] Define witch object structure (pos, state, type)
- [ ] Create array to hold multiple witches
- [ ] Render witches as colored triangles

### Simple movement patterns (lazy/dreamer/aggressive basics)

- [ ] Implement lazy behavior (no movement)
- [ ] Implement dreamer behavior (random movement)
- [ ] Implement aggressive behavior (move toward player)

### Detection zones (visual circles around witches)

- [ ] Draw detection circle around each witch
- [ ] Check if player is within detection radius
- [ ] Change circle color when player detected

### Line of sight rendering (see the detection cones!)

- [ ] Calculate sight direction for each witch
- [ ] Draw sight cone as colored triangle
- [ ] Implement wall blocking for line of sight

## Stealth Mechanics

### Action point system (5 points per turn)

- [ ] Add action points to game state
- [ ] Deduct points for movement
- [ ] Display remaining action points
- [ ] Prevent actions when no points left

### Hide mechanic (toggle invisible state with visual feedback)

- [ ] Add hidden state to player
- [ ] Toggle hidden state on double-tap
- [ ] Change player visual when hidden (transparency)
- [ ] Make hiding cost action points

### Basic lose condition (caught = game over)

- [ ] Check if player adjacent to witch at turn end
- [ ] Display game over message
- [ ] Add restart functionality

### Detection feedback (color changes, alerts)

- [ ] Change screen tint when detected
- [ ] Add visual alert indicators
- [ ] Animate detection state changes

---

## Touch Interaction Standards

- **Tap**: Move to tile / Select action
- **Double-tap**: Quick hide action
- **Pinch**: Zoom in/out
- **Two-finger pan**: Camera movement
- **Long press**: Context menu

---

_Each task is designed to give you a working, testable result that builds incrementally toward the full game._
