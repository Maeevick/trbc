# The Rebel Black Cat - a Stealth Game for js13k 2025 - Complete Design Document

## 🎯 Project Overview

### Core Concept

A turn-based stealth puzzle game where players control a rebellious black cat escaping from a magical tower filled with witches who want to exploit the cat's unlucky powers.

### Technical Constraints

- **Platform**: JS13k 2025 Competition
- **Theme**: "BLACK CAT"
- **Size Limit**: 13KB total
- **Timeline**: 1 month development (August 13 - September 13, 2025)
- **Technology**: HTML5 Canvas 2D, Vanilla JavaScript
- **Target**: 60fps, mobile-first PWA with offline support

### Lore & Setting

_"You, the Rebel Black Cat 🐈‍⬛ will you be able to escape the Magical Maze avoiding the Witches who are exploiting your Power of Unluck? Will your 9 lives be enough to pass by all the floors?"_

The witches use the black cat as a familiar to harvest unluck energy for their magical spells. The cat must escape their tower prison, using its supernatural bad luck as both curse and weapon.

---

## 🎮 Core Gameplay

### Game Structure

- **Grid Size**: 100×100 tiles (constant across all floors)
- **Total Floors**: 100 levels with mathematical difficulty progression
- **Victory Condition**: Reach the exit tile on each floor
- **Game Over**: All 9 lives lost OR captured by witch (adjacent at turn end)

### Lives System - Dual Purpose

- **Health Pool**: 9 lives total, lose 1 when captured
- **Tactical Resource**: Sacrifice 1 life for "Unluck Bomb"
  - **Area Effect**: 9×9 grid centered on cat
  - **Effect**: Disable all witches in area for 3 turns
  - **Recovery**: Witches return with -1 detection level
  - **Activation**: Instant effect, can be used when cornered

---

## ⚡ Action Economy System

### Turn Structure

1. **Player Phase**: 5 action points + 1 ball of wool per turn
2. **Real-time Detection**: Line-of-sight and noise detection during player movement
3. **Witch Phase**: Act based on current detection state, then move
4. **Debuff Resolution**: Effects applied immediately when attacked

### Available Actions

| Action          | Cost        | Description                              |
| --------------- | ----------- | ---------------------------------------- |
| **Move**        | 1 action    | Move to adjacent tile (8-directional)    |
| **Hide**        | 1 action    | Become invisible (turn-ending action)    |
| **Jump**        | 2 actions   | Leap over witches/traps, not walls       |
| **Ball Throw**  | 1-2 actions | Distance <4 (1 action) or <6 (2 actions) |
| **Unluck Bomb** | FREE        | Sacrifice 1 life for area disable        |

### Ball of Wool Mechanics

- **Supply**: 1 new ball per turn
- **Physics**: Straight line trajectory, no bouncing
- **Effect**: Instantly extinguish compatible lights for 3 turns
- **Range**: Maximum 6 tiles in straight line (including diagonals)

---

## 👁️ Detection & Stealth System

### Detection Zones

Each witch has multiple detection areas:

- **Low Detection Circle**: 6-tile radius
- **High Detection Circle**: 3-tile radius
- **Line of Sight Cone**: 6-tile range in facing direction
- **Noise Detection**: Movement creates sound in radius

### Detection States

1. **Unaware**: Normal behavior patterns
2. **Suspicious**: Enhanced movement, local area alert
3. **Alerted**: Optimal pathfinding, aggressive pursuit

### Alert Propagation

When a witch becomes suspicious or alerted:

- **Propagation Radius**: Floor number × 1 tile
  - Floor 1: Only the detecting witch
  - Floor 50: 50-tile radius from detecting witch
  - Floor 100: Entire maze (100-tile radius)

### Hiding Mechanics

- **Hide Action**: Become completely invisible
- **Exception**: High Detection Zone + Aggressive Detection Mode can still see hidden cat
- **Duration**: Until player moves or takes non-hide action
- **Turn Ending**: Hide always ends the player's turn

---

## 🔮 Witch Behavior System

### Witch Personalities (Generated per witch)

- **Lazy**: Static when unaware, becomes dreamer when suspicious
- **Dreamer**: Random movement when unaware, becomes aggressive when suspicious
- **Aggressive**: Always moves toward cat location

### Behavior Escalation

- **Unaware State**: Follow personality pattern
- **Suspicious State**: Personality upgrades (lazy→dreamer, dreamer→aggressive)
- **Alerted State**: All witches become aggressive with optimal pathfinding

### Witch Actions (5 actions per turn)

- **Movement**: 1 action per tile
- **Spell Casting**: 1 action per distance unit (requires line of sight)
- **Collision**: Witches cannot occupy same tile but don't block each other's paths

---

## 🌟 Magic Spell System

### Debuff Categories

| Spell Type | Effect                                              | Duration | Stacking                |
| ---------- | --------------------------------------------------- | -------- | ----------------------- |
| **Fire**   | Detection upgrade (low→high, high→shadow-piercing)  | 3 turns  | Extends duration        |
| **Water**  | Ball throwing costs double (2 actions instead of 1) | 3 turns  | Increases cost penalty  |
| **Air**    | Next move becomes randomized (lose control)         | 1 turn   | Increases random moves  |
| **Earth**  | Movement costs double (2 actions instead of 1)      | 3 turns  | Increases movement cost |

### Spell Mechanics

- **Range Requirement**: Line of sight from witch to cat
- **Immediate Application**: Debuffs apply instantly when cast
- **Visual Feedback**: Icons around cat showing active effects with stack numbers
- **Multiple Effects**: Different spell types can stack simultaneously

---

## 🎨 Visual Design & Aesthetics

### Art Style

- **Perspective**: Top-down isometric 2.5D view
- **Color Palette**: High contrast black/white with warm accent colors (amber/orange) for magical lights
- **Shape Language**: Geometric silhouettes, low-poly forms, minimal detail
- **Lighting**: Dramatic shadows as primary visual and gameplay element

### Camera System

- **Zoomable Viewport**: Players can zoom from detail view (around cat) to strategic view (entire maze)
- **Fog of War**: Unexplored areas remain hidden
- **Smooth Transitions**: Fluid zoom and pan for tactical planning

### User Interface

- **Real-time Feedback**: Valid moves highlighted during player turn
- **Action Icons**: Available actions shown with availability states (enabled/disabled)
- **Detection Visualization**:
  - Dual circles around witches (6-tile low / 3-tile high detection)
  - Sight cone visualization (6-tile range)
  - Color/opacity gradients for detection intensity
- **Debuff Display**: Status icons around cat with spell symbols and stack numbers

---

## 🗺️ Level Generation System

### Hybrid Generation Approach

1. **Cellular Automata** (Organic base structure)
2. **Recursive Backtracking** (Connectivity guarantee)
3. **Manual Validation** (Stealth viability check)

### Cellular Automata Parameters

- **Initial Density**: 42% walls randomly placed
- **Neighbor Rule**: Cell becomes wall if 5+ of 8 neighbors are walls
- **Iterations**: 4 generation cycles
- **Post-processing**: Ensure minimum 2-cell-wide corridors

### Connectivity Requirements

- **Path Count**: 1-5 distinct valid routes from start to exit
- **Validation**: Pathfinding algorithm confirms multiple route options
- **Stealth Viability**: Sufficient shadow coverage for sneaking

### Environmental Elements

- **Light Sources**: Mix of permanent and extinguishable (ball of wool targets)
- **Hidden Paths**: Proximity reveal via light/shadow interactions
- **Runic Symbols**: Visual hints for secrets and traps
- **Magical Traps**: Debuff zones revealed when near lights

---

## 📊 Progression & Difficulty Scaling

### Mathematical Progression (Floors 1-100)

```
Floor N Parameters:
- Witches: min(30, 2 + floor × 0.25)
- Patrols: min(8, floor × 0.06)
- Traps: min(10, floor × 0.08)
- Hidden Paths: min(6, 1 + floor × 0.03)
- Light Density: min(0.4, 0.1 + floor × 0.003)
```

### Difficulty Escalation Vectors

1. **Witch Density**: More enemies per floor
2. **Patrol Complexity**: From static to coordinated movement
3. **Environmental Hazards**: Magical debuff zones
4. **Light Coverage**: Increased illumination, fewer shadows
5. **Secret Complexity**: Hidden paths become more cryptic

---

## 🌱 Seeded Generation System

### Deterministic Reproducibility

- **Master Seed**: Player-chosen or randomly generated string
- **Floor Generation**: `hash(masterSeed + floorNumber)` creates unique floor seed
- **Consistent Output**: Same master seed always produces identical 100-floor tower

### Social Features

- **Seed Sharing**: "Try my seed: BLACKCAT2025"
- **Competition**: Speedruns on specific seeds
- **Daily Challenges**: Community plays same seed
- **Progress Comparison**: "Floor 67/100 on NIGHTMARE_SEED, 6 lives left"

---

## 🏆 Scoring System

### Score Components

- **Lives Remaining**: Bonus multiplier for unused lives
- **Balls Remaining**: Strategy bonus (unused resources)
- **Time Elapsed**: Speed completion bonus
- **Turn Count**: Efficiency rating
- **Detection Events**: Stealth mastery scoring
  - Suspicious detections: Minor penalty
  - Alert detections: Major penalty
- **Floor Completion**: Progressive completion bonuses

### Leaderboards

- **Per Seed**: Best scores on specific seeds
- **Global**: All-time best performances
- **Personal**: Individual progress tracking

---

## 💾 Technical Implementation

### Rendering System

- **Canvas 2D**: Primary rendering technology
- **Coordinate System**: Top-left (0,0) for simple array access and math
- **Grid Efficiency**: Direct array mapping for 100×100 performance
- **Isometric Math**: Simple 2D transformations for perspective

### Save System

- **Local Storage**: Browser-based persistence
- **Save Data**:
  - Current progression (last completed floor)
  - Lives remaining
  - Current score
  - Master seed for current run
- **Reset Per Floor**: Balls and debuffs don't persist between floors
- **Incomplete Floors**: Not saved (must complete to save progress)

### Performance Targets

- **Frame Rate**: Consistent 60fps
- **Responsiveness**: Real-time detection feedback during movement
- **Memory**: Efficient 100×100 grid management
- **Animation**: Smooth CSS-based effects for visual polish

---

## 🚀 Development Roadmap

### Phase 1: Core Foundation (Week 1)

- Basic grid system and Canvas 2D rendering
- Player movement with action point system
- Simple witch placement and basic AI
- Cellular automata maze generation

### Phase 2: Game Systems (Week 2)

- Detection and line-of-sight mechanics
- Spell system and debuff implementation
- Ball of wool physics and light interaction
- Hide and jump actions

### Phase 3: Generation & Polish (Week 3)

- Complete level generation pipeline
- Seeded deterministic system
- Visual effects and UI polish
- Sound effects and juice

### Phase 4: Optimization & Submission (Week 4)

- Code minification and 13KB optimization
- Cross-browser testing and PWA setup
- Final balancing and bug fixes
- JS13k competition submission

---

## 🎯 Success Metrics

### Primary Goals

- **Completable**: Solvable puzzle with clear progression
- **Replayable**: Seed system provides infinite variety
- **13KB Compliant**: All assets and code under size limit
- **Mobile Friendly**: Touch controls and PWA functionality

### Stretch Goals

- **Viral Potential**: Seed sharing creates social engagement
- **Speedrun Community**: Deterministic nature enables competitive play
- **Accessibility**: Clear visual feedback and intuitive controls
- **Polish Level**: Professional game feel despite 13KB constraint

---

## 📝 Post-Jam Expansion Ideas

### Potential Improvements

- **Replay System**: Save and playback turn sequences
- **Advanced Analytics**: Detailed performance statistics
- **More Spell Types**: Extended magical system
- **Boss Floors**: Special witch encounters every 10 floors
- **Unlock System**: New cat abilities or visual customization

### Community Features

- **Level Editor**: Player-created challenges
- **Tournament Mode**: Organized competitive events
- **Streaming Integration**: Twitch-friendly features
- **Mobile App**: Native iOS/Android versions

---

_Design Document Version 1.0 - Ready for Implementation_
_Total estimated development time: 4 weeks (JS13k timeline)_
_Target audience: Puzzle game enthusiasts, speedrunners, mobile gamers_
