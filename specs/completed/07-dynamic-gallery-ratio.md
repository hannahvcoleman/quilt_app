Spec: Dynamic Gallery Aspect Ratio
1. Problem Statement
Gallery layouts currently allow mixed aspect ratios (portrait and landscape) to sit side-by-side. This creates uneven grids and "empty space" within the row, breaking the visual rhythm of the blog.

2. Objective
Homogenize the aspect ratio of all images within a single gallery instance based on the "Master Ratio" of the first valid image.

3. Technical Requirements
A. Ratio Detection (The "Master" Image)
The component must inspect the ImageMetadata of the first item in the images array.

Calculate the ratio: aspectRatio = width / height.

Fallback: If the first image is missing, undefined, or a placeholder, default the aspectRatio to 1 / 1 (Square).

B. Uniform Enforcement
Every image container in the gallery must be constrained to the Master Ratio using the CSS aspect-ratio property.

All images must use object-fit: cover and object-position: center.

This ensures that "misfit" images (e.g., a landscape photo in a portrait-led gallery) fill the container completely without letterboxing or stretching.

C. Astro Optimization
Pass the calculated width and height to the Astro <Image /> component.

The width should be a standard gallery size (e.g., 800px), and the height should be dynamically calculated based on the Master Ratio to ensure the source asset is pre-cropped efficiently.

4. UI/UX Behavior
Portrait Gallery: If Image #1 is 4:5, all subsequent images (even if 16:9 originals) will be cropped to 4:5.

Landscape Gallery: If Image #1 is 16:9, all subsequent images will be cropped to 16:9.

Responsiveness: The aspect-ratio must persist across all breakpoints (Mobile/Desktop).

5. Success Criteria
[ ] No "empty space" or uneven heights within a single gallery row.

[ ] Images do not appear stretched or squashed.

[ ] The build completes without undefined errors if a gallery is empty.