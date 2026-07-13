# Stock media used (replacing the original brief's assets)

All three original CloudFront videos and the original image have been replaced
with free, royalty-free stock footage from Pexels (Pexels License — free for
commercial use, no attribution required). Direct CDN URLs are hotlinked in the
components; swap them freely.

| Placement                        | Component            | Source (Pexels)                                              |
|----------------------------------|----------------------|-------------------------------------------------------------|
| Hero background video            | HeroSection.tsx      | pexels.com/video/gradient-background-7898649 (warm gradient)|
| "Savings that bloom" card image  | InfoSection.tsx      | pexels.com/video/abstract-colorful-background-8333185 (still)|
| Use-cases "Commerce" panel video | UseCasesSection.tsx  | pexels.com/video/abstract-gradient-animation-...-29397254   |

Each video also has a matching `poster` still for fast first paint.

To change any asset: edit the URL constant at the top of the relevant component.
