OXYGEN NURSERY — PHOTOGRAPHS
============================

Folders
  plants/<slug>/   photographs of individual plants, one folder per plant
  services/        photographs of the work: terrace gardens, green walls, lawns...
  projects/        photographs of completed projects


THREE WAYS TO ADD PHOTOGRAPHS
-----------------------------

1. THE ADMIN SCREEN — the normal way
   Sign in, open Image Management, pick the plant, upload. Nothing here to edit.

   Note: an image uploaded that way lives in that browser only. It is a working
   prototype, not a publish. Photographs everyone should see go in through
   option 2 or 3.

2. BULK IMPORT from a folder of per-species subfolders

       python3 scripts/import_plant_photos.py "/path/to/plant images"

   Each subfolder is named for its plant ("Areca Palm", "Snake Plant"). The
   script writes the resized files here, never upscales past the original, keeps
   each file inside a size budget, and regenerates the manifest.

   Which frame becomes the primary image, and in what order the gallery follows,
   is set in scripts/photo-selection.json.

3. BY HAND, for services and projects
   Name the files like this:
       services/terrace-garden-400.jpg
       services/terrace-garden-800.jpg
       services/terrace-garden-1400.jpg
   Then add the entry in src/data/photos.ts. That is the only file to edit.


WHAT HAPPENS WITHOUT A PHOTOGRAPH
---------------------------------
A plant with no photograph shows a "photograph coming soon" panel carrying its
name — never a drawing. That is deliberate: a customer is judging what will
arrive in their pot, and artwork quietly answers that question with something
that is not the plant.

Services and projects DO still use illustrations, because a drawing of drip
irrigation is obviously a diagram of an idea rather than a photograph of a thing
being sold.


GUIDANCE FOR SHOOTING
---------------------
  - Portrait or square crops best on plant cards (they are 4:5).
  - Keep the plant roughly centred; cards crop the edges on narrow screens.
    If one sits high or low, Image Management can nudge the crop.
  - Aim for at least 1400px on the long edge. Smaller is fine — the import
    script will not stretch it — but bigger gives sharper cards on good screens.
  - Natural daylight, plain or softly blurred background, accurate colour.
  - Only photographs you have the right to publish. Anything with a watermark
    belongs to someone else.
  - Photograph the plant you actually sell: the point of all this is that the
    picture is the thing the customer receives.
