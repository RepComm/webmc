
# exponent-ts

Fancy wrapper that make working with HTML less verbose and more automate-able.

0 dependencies - typescript, javascript

Tested / functional in webpack, and snowpack

## Example
```ts

```

## Exponents (premade components)
 - Grid - internally uses display:grid
 - Button - sets up css to make buttons flex properly
 - DualPanel - mount 2 elements w/ ratio, direction
 - ContextPanel - render single component from set, switch using string IDs
 - ImagePanel - adds functionality for fitting the image
 - Knob - rotation input with configurable turn and value bounds
 - OverlayPanel - render two components on top of each other in a panel
 - Panel - your basic container (think div, but with all the flex stuff)
 - SquarePanel (non-final) - the component mounted will always have ratio 1:1 dimensions
 - Drawing - canvas component w/ built in auto-resize, render loop, render passes, helper methods

## Planned Exponents
 - List
 - Paged List (for large lists)
 - Toggle Button
 - Number
 - Multi-select
 - Slider

## Planned features
 - Track object properties
 - Serialize to JSON
 - Visual drag'n'drop editor

## Visuals
![img](./example.png)

