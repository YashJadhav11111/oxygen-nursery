/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by scripts/import_plant_photos.py from the supplied photo
 * folders. It lists, for each plant slug, the responsive JPEG
 * derivatives that actually exist on disk. Widths are capped at each
 * source photograph's native width, so nothing is ever upscaled —
 * which is why the width lists differ from one image to the next.
 *
 * Photographs added later through the admin Image Management screen do
 * not appear here; those live in the image store and are merged on top
 * of this manifest at runtime.
 */

export interface ManifestEntry {
  /** Path prefix; append `-<width>.jpg`. */
  base: string;
  /** Widths exported for this photograph, ascending. */
  widths: number[];
  /** Intrinsic size of the source photograph. */
  width: number;
  height: number;
  alt: string;
}

export const photoManifest: Record<string, ManifestEntry[]> =
{
  "aloe-vera": [
    {
      "base": "/photos/plants/aloe-vera/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1104,
      "alt": "Aloe vera in a glazed green pot, showing its thick toothed leaves"
    },
    {
      "base": "/photos/plants/aloe-vera/2",
      "widths": [
        400,
        800,
        1080
      ],
      "width": 1080,
      "height": 1920,
      "alt": "Aloe vera growing in a terracotta pot"
    },
    {
      "base": "/photos/plants/aloe-vera/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1309,
      "alt": "Mature aloe vera rosette planted out in a garden bed"
    }
  ],
  "alphonso-mango": [
    {
      "base": "/photos/plants/alphonso-mango/1",
      "widths": [
        400,
        719
      ],
      "width": 719,
      "height": 1079,
      "alt": "Young grafted Alphonso mango plant in a nursery pot"
    },
    {
      "base": "/photos/plants/alphonso-mango/2",
      "widths": [
        400,
        800,
        864
      ],
      "width": 864,
      "height": 1184,
      "alt": "Alphonso mango sapling in a white ceramic pot"
    },
    {
      "base": "/photos/plants/alphonso-mango/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1307,
      "alt": "Close-up of new Alphonso mango leaves flushing red-bronze"
    }
  ],
  "areca-palm": [
    {
      "base": "/photos/plants/areca-palm/1",
      "widths": [
        400,
        800,
        1086
      ],
      "width": 1086,
      "height": 1448,
      "alt": "Areca palm in a nursery pot, its feathery fronds arching outward"
    },
    {
      "base": "/photos/plants/areca-palm/2",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1104,
      "alt": "Areca palm in a white pot against a warm plastered wall"
    },
    {
      "base": "/photos/plants/areca-palm/3",
      "widths": [
        400,
        500
      ],
      "width": 500,
      "height": 859,
      "alt": "Areca palm in a black nursery pot"
    },
    {
      "base": "/photos/plants/areca-palm/4",
      "widths": [
        384
      ],
      "width": 384,
      "height": 571,
      "alt": "Areca palms growing in a nursery greenhouse"
    }
  ],
  "bougainvillea": [
    {
      "base": "/photos/plants/bougainvillea/1",
      "widths": [
        400,
        600
      ],
      "width": 600,
      "height": 857,
      "alt": "Bougainvillea trained as a standard, covered in magenta bracts"
    },
    {
      "base": "/photos/plants/bougainvillea/2",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1318,
      "alt": "Bougainvillea climbing around a doorway"
    },
    {
      "base": "/photos/plants/bougainvillea/3",
      "widths": [
        400,
        800,
        1200
      ],
      "width": 1200,
      "height": 2132,
      "alt": "Bougainvillea in a large pot, flowering deep crimson"
    }
  ],
  "duranta-golden": [
    {
      "base": "/photos/plants/duranta-golden/1",
      "widths": [
        400,
        612
      ],
      "width": 612,
      "height": 816,
      "alt": "Golden duranta clipped into a rounded shrub"
    },
    {
      "base": "/photos/plants/duranta-golden/2",
      "widths": [
        400,
        775
      ],
      "width": 775,
      "height": 477,
      "alt": "Golden duranta planted as a low hedge along a path"
    }
  ],
  "echeveria": [
    {
      "base": "/photos/plants/echeveria/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1318,
      "alt": "Echeveria rosette in a terracotta pot, leaves edged in pink"
    },
    {
      "base": "/photos/plants/echeveria/2",
      "widths": [
        400,
        640
      ],
      "width": 640,
      "height": 960,
      "alt": "Potted echeverias and other succulents arranged on a bench"
    },
    {
      "base": "/photos/plants/echeveria/3",
      "widths": [
        400,
        800,
        896
      ],
      "width": 896,
      "height": 1344,
      "alt": "A tiered display of echeverias and mixed succulents"
    },
    {
      "base": "/photos/plants/echeveria/4",
      "widths": [
        400,
        800,
        896
      ],
      "width": 896,
      "height": 1344,
      "alt": "Small succulents including echeverias on a windowsill"
    }
  ],
  "ficus-panda": [
    {
      "base": "/photos/plants/ficus-panda/1",
      "widths": [
        400,
        800,
        1200
      ],
      "width": 1200,
      "height": 1200,
      "alt": "Ficus panda grown as a ball topiary in a white pot"
    },
    {
      "base": "/photos/plants/ficus-panda/2",
      "widths": [
        400,
        735
      ],
      "width": 735,
      "height": 1104,
      "alt": "Ficus panda trained into tiered layers"
    },
    {
      "base": "/photos/plants/ficus-panda/3",
      "widths": [
        400,
        800,
        1000
      ],
      "width": 1000,
      "height": 1334,
      "alt": "Ficus panda styled as a bonsai in a shallow tray"
    }
  ],
  "guava": [
    {
      "base": "/photos/plants/guava/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Potted guava tree carrying ripening fruit"
    },
    {
      "base": "/photos/plants/guava/2",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Guava foliage with young fruit forming"
    },
    {
      "base": "/photos/plants/guava/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Young guava plants growing in the ground"
    }
  ],
  "gulmohar": [
    {
      "base": "/photos/plants/gulmohar/1",
      "widths": [
        400,
        800,
        1080
      ],
      "width": 1080,
      "height": 1350,
      "alt": "Mature gulmohar tree in full scarlet flower over a lawn"
    },
    {
      "base": "/photos/plants/gulmohar/2",
      "widths": [
        400,
        800,
        896
      ],
      "width": 896,
      "height": 1280,
      "alt": "Close-up of gulmohar flowers and buds"
    },
    {
      "base": "/photos/plants/gulmohar/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 981,
      "alt": "Gulmohar canopy in flower against a blue sky"
    },
    {
      "base": "/photos/plants/gulmohar/4",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Gulmohar tree flowering beside a path"
    }
  ],
  "mogra": [
    {
      "base": "/photos/plants/mogra/1",
      "widths": [
        400,
        720
      ],
      "width": 720,
      "height": 840,
      "alt": "Mogra bush in a terracotta pot, covered in double white flowers"
    },
    {
      "base": "/photos/plants/mogra/2",
      "widths": [
        400,
        735
      ],
      "width": 735,
      "height": 1105,
      "alt": "Potted mogra plant in flower"
    },
    {
      "base": "/photos/plants/mogra/3",
      "widths": [
        400,
        582
      ],
      "width": 582,
      "height": 960,
      "alt": "Mogra flowering in a large clay pot"
    }
  ],
  "monstera-deliciosa": [
    {
      "base": "/photos/plants/monstera-deliciosa/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 982,
      "alt": "Monstera deliciosa in a black pot, large leaves deeply split"
    },
    {
      "base": "/photos/plants/monstera-deliciosa/2",
      "widths": [
        400,
        800,
        896
      ],
      "width": 896,
      "height": 1344,
      "alt": "Monstera deliciosa against a dark wall"
    },
    {
      "base": "/photos/plants/monstera-deliciosa/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1097,
      "alt": "Tall monstera deliciosa beside a sunlit window"
    },
    {
      "base": "/photos/plants/monstera-deliciosa/4",
      "widths": [
        400,
        576
      ],
      "width": 576,
      "height": 1024,
      "alt": "Monstera deliciosa in a white pot in a bright room"
    }
  ],
  "neem": [
    {
      "base": "/photos/plants/neem/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 983,
      "alt": "Neem branch in flower, with its fine serrated leaflets"
    },
    {
      "base": "/photos/plants/neem/2",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Close-up of neem foliage"
    },
    {
      "base": "/photos/plants/neem/3",
      "widths": [
        400,
        720
      ],
      "width": 720,
      "height": 1520,
      "alt": "Neem tree in flower against the sky"
    }
  ],
  "snake-plant": [
    {
      "base": "/photos/plants/snake-plant/1",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Snake plant in a pale ceramic pot on a sunlit balcony"
    },
    {
      "base": "/photos/plants/snake-plant/2",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1308,
      "alt": "Snake plant in a tall white pot"
    },
    {
      "base": "/photos/plants/snake-plant/3",
      "widths": [
        400,
        736
      ],
      "width": 736,
      "height": 1127,
      "alt": "Snake plant in a woven-texture pot on a wooden floor"
    }
  ]
};
