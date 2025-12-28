# Responsive images

I want a separate image component, solely responsile for showing any image in a parent coimpnent. This image component should be responsive, and pick the right image to show from the relevant folder. For instance, the 'Q1 Tower & SkyPoint Observation Deck' photos will be in /photos/q1-tower-skypoint'.

## Prepare the dummy images
To get some dummy images into the folder photos, iterate over the places data and create a folder for each place, using its id as the folder name. Then copy the three top-level (in /photos) photos called 'large', 'medium', and 'small' into each folder.

# Breakpoints
Use industry standard breakpoints in the srcset attributes, and make any corresponsing CSS/LESS chantges based on those breakpoints. Depending on the screen width, the right one should be shown.

# CSS variables base stylesheet
Keep the breakpiints in the base styles.less and refer to them there. Don't use hard-coded pixel values for the breakpoints in the image component's stylesheet, rather use the base less stylesheet. 