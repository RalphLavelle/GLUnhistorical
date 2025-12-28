# CSS Styles refactor

## Refactor task
Find every instance of a hard-coded CSS colour value (e.g. #667eea) in component-level stylesheets and move them to the base styles class. The component stylesheets should then refer to the values from that base sheet.

## Technical consideration
Do not call the new base rules 'blue' or 'red', which ties them to a articular colour, but rather, 'primary', 'secondary', etc.

## Purpose
I want to be able to change styles and colours easily by simply changing them in one spot.