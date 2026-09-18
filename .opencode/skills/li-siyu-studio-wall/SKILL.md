---
name: li-siyu-studio-wall
description: Build and refine the left-side wall area of LI SIYU MY LITTLE STUDIO, including 13 independent photography frames, photography gallery interaction, floating single-layer shelf, tall 5-shelf open bookcase, globe, large world map, and naturally sagging skill string with physically attached tags. Preserve the existing room, camera system, and unrelated interactions.
---

# LI SIYU — MY LITTLE STUDIO
# WALL SYSTEM SKILL

## 0. ROLE

You are responsible for the complete LEFT WALL visual and interaction system.

This Skill exists to make the left side of the studio feel like:

> a real creator's collected visual wall

not:

> a generic 3D portfolio scene.

The wall should feel warm, personal, slightly imperfect, curated, tactile, and lived-in.

Primary elements:

1. Photography Wall
2. 13 individual photo frames
3. Photography Gallery
4. Floating single-layer shelf
5. Tall five-shelf open bookcase
6. Globe
7. Large pale-green world map
8. Skill string
9. Hanging skill tags

---

# 1. EXISTING PROJECT RULE

This is an existing project.

Do NOT rebuild the whole Studio.

Before changing anything:

1. inspect the current implementation
2. identify existing components
3. identify existing interaction system
4. identify existing camera system
5. identify existing data structures
6. modify the smallest necessary set of files

Prefer incremental modification.

Never replace working architecture simply because a new visual implementation is easier.

---

# 2. FILE DISCOVERY

Before coding, inspect:

- src/studio/
- src/studio/objects/
- src/studio/scene/
- src/studio/camera/
- src/studio/ui/
- src/studio/data/
- existing PhotoWall
- existing Bookshelf
- existing InteractiveObject
- existing ContentOverlay
- existing camera director

Also inspect:

- package.json
- tsconfig
- current styling system

Do not assume filenames.

Use the actual project structure.

---

# 3. HARD BOUNDARY

This Skill controls:

## LEFT WALL

- photography
- shelf
- bookshelf
- globe
- map
- skill string
- tags

This Skill does NOT control:

- Entry page
- arch door
- mailbox
- desk
- computer
- phone
- camera
- academic posters
- TV
- right windows
- sofas
- global room footprint
- global camera architecture

If another object must be changed to make the left wall work:

> make the smallest possible change.

Do not redesign unrelated areas.

---

# 4. GLOBAL VISUAL LANGUAGE

The wall should follow:

- warm natural materials
- dark wood
- cream paper
- muted colors
- soft shadows
- matte surfaces
- realistic proportions
- slight imperfection
- editorial composition

Avoid:

- neon
- glossy plastic
- futuristic UI
- sterile office furniture
- perfectly symmetrical placement
- giant floating objects
- excessive glow
- game-like HUD elements

---

# 5. PHOTOGRAPHY WALL — CORE REQUIREMENT

The photography wall MUST contain:

> exactly 13 independent frames.

Not 12.

Not 14.

Exactly 13.

Each frame must be a real independent 3D object.

---

# 6. PHOTOGRAPHY LAYOUT

Arrange the 13 frames approximately:

ROW 1 = 5
ROW 2 = 4
ROW 3 = 3

Visual structure:

        1  2  3  4  5

          6  7  8  9

            10 11 12

But the actual composition may have small controlled offsets.

Do NOT create a perfectly rigid CSS-grid feeling.

Do NOT scatter randomly.

The final result must look intentionally composed.

---

# 7. PHOTOGRAPHY SIZE

The previous photography frames were too small.

Make them substantially larger.

The user wants the photography wall to visually occupy the left wall.

The frames must be:

- clearly readable
- visually important
- large enough to notice from the initial camera
- separated enough to maintain individual identity

Do not make them tiny decorative thumbnails.

---

# 8. PHOTOGRAPHY HEIGHT

Move the photography wall upward.

The TOP ROW should have a visual height close to the hanging-point / hook height of the academic posters.

The photography wall should not sit too low.

The top row should establish the same visual horizon as the poster area.

---

# 9. PHOTOGRAPHY WALL WIDTH

Use the major available left-wall area.

The 13 frames should visually fill the wall.

However:

leave breathing room around:

- wall edges
- bookcase
- ceiling
- corners

Do not let the frames collide with the bookcase.

---

# 10. NO SINGLE PHOTO BOARD

Do NOT create:

- cork board
- felt board
- giant backing board
- large rectangular photo panel

The wall itself is the background.

Each photo frame is individually mounted on the wall.

---

# 11. FRAME CONSTRUCTION

Each photo frame should contain:

1. outer wood frame
2. cream/off-white inner border
3. photo surface
4. subtle backing
5. wall-facing contact
6. subtle shadow
7. hanging point

Suggested wood:

#6B4A33

Suggested paper:

#F2EDE4

Use matte materials.

---

# 12. FRAME DEPTH

Frames should have actual 3D depth.

Do not make them flat planes pasted onto the wall.

They should cast subtle shadows.

They should appear physically mounted.

---

# 13. PHOTO INTERACTION ARCHITECTURE

This is mandatory.

Every frame MUST have its own interaction.

Correct architecture:

PhotoFrame0
PhotoFrame1
PhotoFrame2
PhotoFrame3
PhotoFrame4
PhotoFrame5
PhotoFrame6
PhotoFrame7
PhotoFrame8
PhotoFrame9
PhotoFrame10
PhotoFrame11
PhotoFrame12

Each frame:

> own InteractiveObject

---

# 14. FORBIDDEN PHOTO INTERACTION

Do NOT wrap the entire PhotoWall in one InteractiveObject.

Forbidden:

PhotoWall
└── InteractiveObject
    ├── Photo 1
    ├── Photo 2
    ├── Photo 3
    └── Photo 13

This causes the whole wall to behave as one object.

---

# 15. REQUIRED PHOTO INTERACTION

Correct:

PhotoWall
├── InteractiveObject → Photo 1
├── InteractiveObject → Photo 2
├── InteractiveObject → Photo 3
├── InteractiveObject → Photo 4
├── ...
└── InteractiveObject → Photo 13

Each hit target must belong only to that frame.

---

# 16. PHOTO HOVER

When hovering one frame:

ONLY that frame responds.

Possible response:

- slight scale
- slight lift
- subtle shadow increase
- small movement
- subtle cursor feedback

Do NOT move the entire photography wall.

Do NOT animate all 13 frames.

---

# 17. PHOTO CLICK

Clicking any frame must open:

> Photography Gallery

It must NOT open:

- About
- generic Works
- shelf
- Skills

Photography is its own experience.

---

# 18. PHOTO GALLERY

The gallery must display:

- selected photo
- current position
- previous
- next
- close

Example:

01 / 13

The user should immediately understand:

> I am viewing one of the 13 photographs.

---

# 19. GALLERY NAVIGATION

Desktop:

- left arrow
- right arrow
- keyboard ArrowLeft
- keyboard ArrowRight

Mobile:

- swipe left
- swipe right

All navigation must use the same photography data array.

---

# 20. GALLERY DATA

Use a single structured data source.

Example:

const photography = [
  {
    id: 0,
    src: "...",
    title: "...",
    caption: "..."
  }
]

Do not duplicate photo information across:

- PhotoWall
- Gallery
- overlay
- interaction handlers

The frame and gallery should reference the same item.

---

# 21. GALLERY INDEX

The selected frame must open the correct gallery index.

Example:

click PhotoFrame7

→ gallery index 7

NOT:

→ always open Photo 0.

---

# 22. GALLERY PREVIOUS / NEXT

Previous and next must update:

- image
- title
- caption
- index

without closing the gallery.

---

# 23. GALLERY EDGE CASE

Do not allow:

- undefined photo
- blank image
- index out of bounds
- broken navigation
- stale caption

If using circular navigation:

12 → 0

0 → 12

If not circular:

disable the unavailable direction.

Choose one behavior and implement it consistently.

---

# 24. GALLERY VISUAL STYLE

Gallery should feel editorial.

Use:

- warm dark overlay
- large image
- restrained typography
- subtle border
- minimal controls

Do not turn it into:

> a giant full-screen app interface.

The Studio should remain visually present when possible.

---

# 25. GALLERY CAMERA

When a photo is clicked:

Camera Director may smoothly focus toward the selected photo.

Movement must be cinematic.

Never:

- teleport violently
- cross the wall
- place camera outside room
- clip into geometry

---

# 26. GALLERY CLOSE

Support:

- X button
- Escape

On close:

return to Studio browsing state.

Prefer returning camera to the pre-click camera position rather than resetting the entire Studio.

---

# 27. FLOATING SHELF

Under the photography wall:

create a:

> long, flat, single-layer floating shelf.

It is NOT a floor-standing bookcase.

---

# 28. FLOATING SHELF STRUCTURE

Required structure:

horizontal shelf

+

left side support panel

+

right side support panel

The side panels extend downward.

The actual shelf remains visually elevated above the floor.

---

# 29. FLOATING SHELF SILHOUETTE

From the camera:

the user should immediately understand:

> this is one floating shelf.

Not:

> a miniature cabinet.

Not:

> a second bookshelf.

---

# 30. FLOATING SHELF HEIGHT

The user previously requested:

> make the shelf itself taller.

Increase:

- board thickness
- support-panel height

Do NOT add additional shelf levels.

It must remain:

> one layer.

---

# 31. FLOATING SHELF WIDTH

Target:

approximately half the visual width of the wall.

It should be long.

It should sit naturally below the photography wall.

---

# 32. FLOATING SHELF BOOKS

Only a small number of books.

Books should be concentrated toward the LEFT.

Use mixed orientations:

- vertical
- horizontal
- one or two leaning

Do not fill the entire shelf.

---

# 33. FLOATING SHELF PLANTS

Near the RIGHT side:

place approximately:

> 3 small succulents.

Use different:

- heights
- silhouettes
- pot shapes

Keep them compact.

---

# 34. FLOATING SHELF MATERIAL

Primary:

dark warm wood

#6B4A33

Use matte roughness.

The shelf should feel handcrafted.

---

# 35. FLOATING SHELF INTERACTION

The shelf MUST NOT inherit photography interaction.

Clicking shelf:

must NOT open:

> Photography Gallery.

If no separate shelf interaction is currently required:

> do not add unnecessary interaction.

---

# 36. TALL BOOKCASE

The leftmost area should contain:

> a large open 5-shelf bookcase.

This is separate from the floating shelf.

---

# 37. BOOKCASE HEIGHT

Target:

approximately:

> 5/6 of the wall height.

It should be visibly tall.

The current bookcase was too short.

Make the new proportion unmistakable.

---

# 38. BOOKCASE WIDTH

The bookcase must be:

> substantially wider than the previous version.

But it must remain separated from the photography shelf.

Do not let the two furniture pieces merge visually.

---

# 39. BOOKCASE POSITION

Move the bookcase outward.

Create a visible spatial gap between:

- floating shelf
- bookcase

They should read as:

> two independent pieces of furniture.

---

# 40. BOOKCASE BACK PANEL

CRITICAL:

Do NOT create a wooden back panel.

The wall itself is the background.

The bookcase must be visually open.

---

# 41. BOOKCASE SHELVES

Exactly:

> 5 shelves.

Each level should have different book arrangements.

Avoid duplicated patterns.

---

# 42. BOOK DENSITY

Target:

approximately:

> 60% books
> 40% empty space

Books may be:

- vertical
- horizontal
- leaning
- grouped
- stacked

The empty areas are intentional.

---

# 43. BOOK COLORS

Use muted tones:

- cream
- beige
- dark green
- brown
- dusty orange
- muted blue

Avoid:

- neon
- saturated rainbow
- glossy toy colors

---

# 44. GLOBE

Place:

> one globe

on top of the tall bookcase.

The globe should be:

- medium sized
- clearly readable
- slightly vintage
- muted
- proportional

Do not make it enormous.

---

# 45. WORLD MAP

To the LEFT of the bookcase:

place a:

> large pale-green world map.

The map should occupy substantial lower-wall space.

---

# 46. WORLD MAP ASSET

Use the user's specified source image:

https://i.pinimg.com/1200x/0f/93/b7/0f93b71d7a4866ad0c41de00b75546c9.jpg

If remote loading is unreliable:

download/store a local copy as an asset if project policy permits.

Prefer:

public/assets/world-map.jpg

over a permanently unreliable remote texture.

---

# 47. WORLD MAP QUALITY

The current map was too:

- small
- blurry
- vague

Fix all three.

The final map must be:

> large + readable + clearly visible.

---

# 48. WORLD MAP MATERIAL

The map is printed wall art.

Use:

- matte
- pale green
- low specular
- no emissive glow

Do NOT make it look like:

> a digital monitor.

---

# 49. WORLD MAP PLACEMENT

The map should be visually balanced with the bookcase.

Do not let:

- photo frames
- bookcase
- furniture
- camera

hide the map.

---

# 50. SKILL STRING

Above the world map:

create:

> one long hanging string.

It extends from the left wall toward the bookcase area.

---

# 51. STRING SHAPE

The string must NOT be perfectly straight.

It needs:

> natural sag.

Both ends are higher.

The middle is lower.

Conceptually:

      ●----------------●
       \              /
        \____________/

The actual curve should be smoother.

---

# 52. STRING IMPLEMENTATION

Use a curve system such as:

- QuadraticBezierCurve3
- CatmullRomCurve3

or another controlled curve.

Do not approximate sag by manually placing many disconnected straight segments.

---

# 53. STRING PHYSICAL FEELING

No need for full physics simulation.

But visually it must behave like:

> a real string attached at two points.

The center should visibly drop.

---

# 54. SKILL TAGS

Hang several rectangular tags from the string.

Tags should have:

- warm paper
- subtle shadow
- slight rotation
- small typography
- different widths
- controlled variation

---

# 55. TAG ATTACHMENT — CRITICAL

Tags must ACTUALLY attach to the string.

Do NOT make floating labels.

Bad:

string

    gap

tag

Good:

string
  |
clip
  |
tag

or:

string
  |
tag

---

# 56. TAG POSITION CALCULATION

Each tag should derive its hanging position from:

> the actual string curve.

Do not randomly assign independent world Y coordinates.

The top attachment point must match the rope.

This is important because the tags need to visually follow the sag.

---

# 57. TAG ROTATION

Each tag may have slight rotation.

Keep it subtle.

Examples:

- -4°
- +2°
- -3°
- +4°

Do not rotate tags dramatically.

---

# 58. TAG TEXT

Use concise skill labels based on the existing real Skills content.

Possible categories:

- Content
- Strategy
- Editing
- AIGC
- Data
- Visual
- Research

Do not invent fake achievements.

---

# 59. SKILL STRING INTERACTION

The skill string represents:

> 技能 / SKILLS

It can use one grouped interaction.

Clicking the string or its tag group:

→ Skills section.

Do not make every tag a completely separate section unless the existing IA explicitly requires it.

---

# 60. MAP INTERACTION

The world map does not need to be interactive.

Do not add interaction simply because it is visually clickable.

---

# 61. BOOKCASE INTERACTION

The bookcase does not own the Photography interaction.

If the existing IA assigns the bookshelf to another section:

preserve that mapping unless the user explicitly changes it.

Do not silently change unrelated navigation.

---

# 62. WALL DEPTH

Every wall object needs physical separation.

Photography:

slightly away from wall.

Map:

slightly away from wall.

String:

slightly forward.

Bookcase:

real depth.

Floating shelf:

real thickness.

Avoid flat sticker-like appearance.

---

# 63. CONTACT SHADOWS

Add subtle contact shadows where appropriate.

Especially:

- photo frames
- shelf
- bookcase
- map

Do not make shadows excessively dark.

---

# 64. LIGHTING

Use existing Studio lighting.

Do not create a separate lighting system unless required.

The left wall should receive:

> soft warm ambient illumination.

Do not make:

- photos glow
- map glow
- tags glow

They should be illuminated by the room.

---

# 65. SCALE RELATIONSHIP

Use the existing room footprint.

Do NOT enlarge the room to make these objects fit.

Instead:

adjust:

- scale
- spacing
- position

inside the current room.

---

# 66. NO ROOM RESIZE

Never modify:

- wall dimensions
- floor dimensions
- ceiling dimensions
- room footprint

unless absolutely required by an existing bug.

---

# 67. CAMERA SAFETY

Do not redesign the camera.

Use the existing Camera Director.

When creating photo focus:

keep camera inside the room.

Do not:

- cross walls
- clip through shelves
- enter geometry
- zoom infinitely

---

# 68. RESPONSIVE BEHAVIOR

Desktop:

show full wall composition.

Tablet:

reduce depth and spacing if necessary.

Mobile:

simplify visual density if required.

But preserve:

> 13-photo Gallery functionality.

---

# 69. PERFORMANCE

Avoid unnecessary expensive geometry.

Prefer:

- shared materials
- reusable frame geometry
- reasonable texture resolution
- simple shelf geometry
- simple curve geometry

13 frames are acceptable.

Do not create unnecessarily high-poly furniture.

---

# 70. DATA ARCHITECTURE

Photography should be data-driven.

Use one source:

photography[]

That data should drive:

- frames
- hover identity
- click identity
- gallery
- navigation
- captions

Avoid duplicated data.

---

# 71. COMPONENT ARCHITECTURE

Prefer a structure similar to:

LeftWall
├── PhotographyWall
│   ├── PhotoFrame × 13
│   └── PhotographyGallery
├── FloatingShelf
├── TallBookshelf
│   └── Globe
├── WorldMap
└── SkillString
    └── SkillTag × N

Names may differ depending on the existing project.

---

# 72. DO NOT CREATE DUPLICATES

Before creating anything:

check whether the project already has:

- PhotoWall
- Bookshelf
- WorldMap
- SkillString
- Gallery

If they exist:

modify them.

Do not create:

PhotoWall2
BookshelfNew
WorldMapFinal2
SkillStringNew

---

# 73. VISUAL QA — INITIAL CAMERA

At the initial Studio view:

the user should be able to understand:

- photo wall
- floating shelf
- bookcase
- map
- skill string

without needing to click anything.

The left wall should feel intentionally composed.

---

# 74. VISUAL QA — PHOTOGRAPHY

Check:

[ ] exactly 13 frames

[ ] 5 / 4 / 3 layout

[ ] frames large enough

[ ] wall filled appropriately

[ ] first row high enough

[ ] each frame visually independent

[ ] no giant backing board

[ ] subtle depth

[ ] subtle shadows

---

# 75. INTERACTION QA — PHOTOGRAPHY

Manually test:

Photo 1

→ opens Photo 1

Photo 2

→ opens Photo 2

Photo 7

→ opens Photo 7

Photo 13

→ opens Photo 13

Then:

Previous

Next

Keyboard

Swipe

Close

All must work.

---

# 76. INTERACTION ISOLATION QA

Test:

Photo Frame

→ Photography Gallery

Skill String

→ Skills

Floating Shelf

→ must NOT open Photography

World Map

→ must NOT open Photography

Bookcase

→ must NOT open Photography unless existing project explicitly defines another interaction

---

# 77. VISUAL QA — FLOATING SHELF

Check:

[ ] exactly one shelf layer

[ ] shelf is floating

[ ] left support reaches downward

[ ] right support reaches downward

[ ] no floor cabinet appearance

[ ] few books on left

[ ] approximately 3 succulents on right

---

# 78. VISUAL QA — BOOKCASE

Check:

[ ] 5 shelf levels

[ ] tall

[ ] wide

[ ] moved outward from photo shelf

[ ] open back

[ ] wall visible behind books

[ ] approximately 60% books

[ ] approximately 40% empty

[ ] globe on top

---

# 79. VISUAL QA — WORLD MAP

Check:

[ ] large

[ ] clear

[ ] pale green

[ ] visible from initial camera

[ ] no broken texture

[ ] no excessive blur

[ ] no emissive glow

---

# 80. VISUAL QA — SKILL STRING

Check:

[ ] both ends anchored

[ ] middle visibly lower

[ ] natural curve

[ ] tags follow the curve

[ ] tags physically touch/hang from string

[ ] no floating tags

[ ] subtle rotation

[ ] readable text

---

# 81. COMMON FAILURE: PHOTO WALL TOO SMALL

If frames look tiny:

DO NOT immediately enlarge the entire room.

Instead:

1. enlarge frames
2. reduce spacing slightly
3. move wall composition upward
4. use more of the left wall width

---

# 82. COMMON FAILURE: PHOTO WALL DISAPPEARS

If photo frames disappear when camera rotates:

check:

- camera clipping
- wall depth
- object placement
- parent transforms
- culling
- interaction wrapper origin

Do not solve by making the wall transparent.

---

# 83. COMMON FAILURE: ALL PHOTOS CLICK TOGETHER

Check InteractiveObject hierarchy.

The parent PhotoWall must NOT own the shared interaction.

Each frame needs its own interaction boundary.

---

# 84. COMMON FAILURE: SHELF OPENS PHOTO GALLERY

Check parent-child interaction.

Do not place shelf inside:

> Photo interaction container.

Separate the scene graph.

---

# 85. COMMON FAILURE: TAGS FLOAT

Check:

1. rope curve point
2. tag attachment point
3. tag parent transform
4. local/world coordinate conversion

The tag top should physically meet the rope.

Do not merely move the tag visually until it looks close.

---

# 86. COMMON FAILURE: STRING LOOKS RIGID

If the string looks like a ruler:

increase center sag.

The two endpoints should remain higher.

Use a smooth curve.

---

# 87. COMMON FAILURE: BOOKCASE LOOKS LIKE A BOX

Remove:

> back panel.

Show the wall behind it.

Reduce unnecessary solid geometry.

---

# 88. COMMON FAILURE: TWO SHELVES MERGE

Increase:

> spatial separation between FloatingShelf and TallBookshelf.

They must be read as two different furniture pieces.

---

# 89. COMMON FAILURE: WORLD MAP BLURRY

Check:

- texture resolution
- source image
- UV
- material
- camera distance

If remote image is unreliable:

use a local asset.

---

# 90. IMPLEMENTATION ORDER

Always execute in this order:

### STEP 1
Inspect existing code.

### STEP 2
Fix Photography Wall geometry.

### STEP 3
Make 13 frames independent.

### STEP 4
Fix photography data.

### STEP 5
Implement Gallery navigation.

### STEP 6
Fix Floating Shelf.

### STEP 7
Fix Tall Bookshelf.

### STEP 8
Fix Globe.

### STEP 9
Fix World Map.

### STEP 10
Fix Skill String.

### STEP 11
Fix tag attachment.

### STEP 12
Run visual QA.

### STEP 13
Run interaction QA.

### STEP 14
Run typecheck.

### STEP 15
Run lint.

### STEP 16
Run build.

---

# 91. VALIDATION

Use the project's actual package scripts.

Inspect package.json first.

If available, run:

npm run typecheck

npm run lint

npm run build

Do not invent commands if the project uses different names.

---

# 92. DO NOT STOP AT "CODE COMPILES"

Successful TypeScript compilation does NOT mean this Skill is complete.

The Agent must also reason about:

- scene composition
- interaction hierarchy
- camera behavior
- physical attachment
- visual proportions

---

# 93. FINAL REPORT FORMAT

After implementation, report:

## Files Changed

List changed files.

## Photography

- 13 frames
- 5 / 4 / 3
- independent interaction
- gallery

## Shelf

- floating
- single layer
- books
- 3 succulents

## Bookcase

- 5 shelves
- tall
- wide
- open back
- globe

## World Map

- asset
- size
- placement

## Skill String

- curved
- sagging
- tags attached

## Interaction

Photo 1–13 → Photography

Skill String → Skills

Other interactions → unchanged

## Validation

typecheck

lint

build

## Known Issues

Only list real remaining issues.

Never claim something is fixed if it was not verified.

---

# 94. FINAL DESIGN PRINCIPLE

The left wall should communicate:

> "This is where this person keeps the things they have seen, made, learned, and collected."

The photography should feel personal.

The books should feel used.

The map should feel like a reference object.

The skill tags should feel handwritten / pinned / suspended.

The shelf should feel lived-in.

The entire wall should feel:

> collected over time.

NOT:

> generated from a template.

---

# 95. MOST IMPORTANT RULES

If you remember only ten things:

1. EXACTLY 13 photo frames.
2. 5 / 4 / 3 arrangement.
3. Every photo frame has its OWN interaction.
4. Photo click opens Photography Gallery.
5. Gallery supports previous / next / swipe.
6. Floating shelf is ONE layer and FLOATS.
7. Tall bookcase has FIVE shelves and NO back panel.
8. World map is LARGE and CLEAR.
9. Skill string must SAG naturally.
10. Tags must ACTUALLY ATTACH to the string.

Do not violate these rules even if a simpler implementation is tempting.