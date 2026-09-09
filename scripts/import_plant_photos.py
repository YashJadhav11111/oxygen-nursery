#!/usr/bin/env python3
"""
Bulk-import plant photographs into public/photos/plants/.

This is a SEED script, not part of the running site. It takes a folder of
per-species subfolders, writes responsive JPEG derivatives, and regenerates
src/data/photoManifest.generated.ts.

Day-to-day image changes go through the admin Image Management screen instead;
this exists so a large batch can be brought in at once.

    python3 scripts/import_plant_photos.py "/path/to/plant images"

Never upscales: an image is only exported at widths its source can actually
fill, so nothing is stretched.
"""
import io, json, os, sys
from PIL import Image

WIDTHS = [400, 800, 1400]
BUDGET = {400: 34_000, 800: 105_000}
# Anything wider than the 800 tier is the "full" tier; foliage is high-frequency
# and compresses badly, so it gets its own, looser budget and a lower floor.
FULL_BUDGET = 190_000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'photos', 'plants')


def encode(im, cap, floor=62):
    """Highest quality that fits the byte budget."""
    ladder = [q for q in (86, 82, 78, 74, 70, 66, 62, 58, 54, 50) if q >= floor]
    for q in ladder:
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=2)
        if buf.tell() <= cap or q == ladder[-1]:
            return buf.getvalue(), q
    return buf.getvalue(), ladder[-1]


def derive(src_path, slug, index):
    im = Image.open(src_path).convert('RGB')
    sw, sh = im.size
    full = min(sw, WIDTHS[-1])
    widths = [w for w in WIDTHS if w <= full]
    if full not in widths:
        widths.append(full)
    widths.sort()
    folder = os.path.join(OUT, slug)
    os.makedirs(folder, exist_ok=True)
    for w in widths:
        h = round(sh * w / sw)
        cap, floor = (BUDGET[w], 62) if w in BUDGET else (FULL_BUDGET, 50)
        data, q = encode(im.resize((w, h), Image.LANCZOS), cap, floor)
        with open(os.path.join(folder, f'{index}-{w}.jpg'), 'wb') as fh:
            fh.write(data)
    return {'base': f'/photos/plants/{slug}/{index}', 'widths': widths,
            'width': sw, 'height': sh}


def main():
    src_root = sys.argv[1] if len(sys.argv) > 1 else None
    if not src_root:
        sys.exit('usage: import_plant_photos.py "<folder of per-species subfolders>"')
    extra_root = sys.argv[2] if len(sys.argv) > 2 else src_root
    cfg = json.load(open(os.path.join(ROOT, 'scripts', 'photo-selection.json')))
    manifest, total = {}, 0

    for slug, spec in cfg['plants'].items():
        folder = os.path.join(src_root, spec['folder'])
        files = sorted(os.listdir(folder))
        entries, n = [], 0

        extra = spec.get('extraPrimary')
        if extra:
            path = os.path.join(extra_root, extra)
            if os.path.exists(path):
                n += 1
                e = derive(path, slug, n)
                e['alt'] = spec['extraPrimaryAlt']
                entries.append(e)

        for pos, idx in enumerate(spec['order']):
            n += 1
            e = derive(os.path.join(folder, files[idx - 1]), slug, n)
            e['alt'] = spec['alt'][pos]
            entries.append(e)

        manifest[slug] = entries
        total += len(entries)
        skipped = spec.get('skip', {})
        note = f"  (skipped {', '.join(f'#{k}: {v}' for k, v in skipped.items())})" if skipped else ''
        print(f'{slug:22s} {len(entries)} image(s){note}')

    header = (
        '/**\n'
        ' * GENERATED FILE — do not edit by hand.\n'
        ' *\n'
        ' * Written by scripts/import_plant_photos.py from the supplied photo\n'
        ' * folders. It lists, for each plant slug, the responsive JPEG\n'
        ' * derivatives that actually exist on disk. Widths are capped at each\n'
        ' * source photograph\'s native width, so nothing is ever upscaled —\n'
        ' * which is why the width lists differ from one image to the next.\n'
        ' *\n'
        ' * Photographs added later through the admin Image Management screen do\n'
        ' * not appear here; those live in the image store and are merged on top\n'
        ' * of this manifest at runtime.\n'
        ' */\n\n'
        'export interface ManifestEntry {\n'
        '  /** Path prefix; append `-<width>.jpg`. */\n'
        '  base: string;\n'
        '  /** Widths exported for this photograph, ascending. */\n'
        '  widths: number[];\n'
        '  /** Intrinsic size of the source photograph. */\n'
        '  width: number;\n'
        '  height: number;\n'
        '  alt: string;\n'
        '}\n\n'
        'export const photoManifest: Record<string, ManifestEntry[]> =\n'
    )
    out = os.path.join(ROOT, 'src', 'data', 'photoManifest.generated.ts')
    with open(out, 'w') as fh:
        fh.write(header + json.dumps(manifest, indent=2) + ';\n')
    print(f'\n{total} images across {len(manifest)} plants -> {out}')


if __name__ == '__main__':
    main()
