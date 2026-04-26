# Repo Analysis — brightchamps-learn (landing pages)

**Path:** `/repo-cloned/brightchamps-learn.brightchamps.com-10f337288e53`
**Date:** 2026-04-26
**Verdict:** PHP-based marketing / landing-pages site. Not React. The `package.json` is just for Puppeteer tooling (probably for screenshot or PDF generation), not for the web app itself.

---

## Stack

```
{
  "dependencies": {
    "puppeteer": "^21.5.2"
  }
}

```

## File extensions

```
1832 php
 929 css
 924 png
 565 svg
 290 js
 161 webp
  79 jpg
  52 html
  34 phps
  27 pdf
  19 md
  18 json
  15 txt
  13 scss
  13 jpeg
   9 yaml
   7 py
   7 ico
   5 map
   4 ttf
```

## Top-level structure

```
Dockerfile
README.md
apache_staging.conf
api
config
content
data
deploy
deploy.sh
entrypoint.sh
feature-set.php
images
js
landing-pages
landingPagesConfig.json
minify.py
moments
package-lock.json
package.json
pages-brightchamps
pdf
robots.txt
scripts
serviceWorker.js
services
step_form_51.php
stylesheets
utils
webpushr-sw.js
zalo
```

## Full analysis output

```
=== 3. ALL HARDCODED COLOR VALUES (top 50) ===
3236 #fff
 978 #000
 877 #3d4d5d
 821 #4360fd
 506 #000000
 411 #ffffff
 296 #ddd
 255 #ff752c
 252 #4e3bc2
 214 #3add7f
 169 #ccc
 149 #d6def5
 142 #212529
 134 #f5f5f5
 120 #363636
 113 #f5f8fa
 112 #7453d7
 108 #d8d8d8
 108 #333
  98 #1d3bff
  88 #999
  87 #ebeded
  83 #18aa00
  83 #0a0a0a
  79 #ffefdb
  78 #afafaf
  75 #f4f4f4
  70 #dbdbdb
  69 #fd6a00
  69 #f3f3f3
  67 #3273dc
  66 #4a80ec
  64 #435ffd
  61 #ed675c
  60 #dcd6d6
  56 #ff1493
  56 #435a5f
  53 #ecedef
  48 #fc0
  45 #f5f8f8
  44 #ff6600
  44 #5a4aa6
  44 #3954ff
  43 #eee
  41 #00d1b2
  40 #ffaa3e
  40 #ff3860
  40 #555
  40 #009900
  39 #ffdd57

=== 4. CSS VARIABLE REFERENCES (top 50) ===
1032 --tertiary-color
 715 --f-3
 715 --f-2
 663 --border-radius
 652 --secondary-color
 448 --primary-color
 406 --selected-color
 378 --f-4
 348 --font-family
 344 --cta-color
 292 --selected-background-color
 278 --f-1
 156 --Text-white
 151 --error
  85 --f-5
  40 --blue
  33 --grey
  29 --secondary-400
  27 --white
  26 --line-border-empty
  24 --Typography-700
  23 --orange
  13 --line-border-fill
  13 --f-eight
  12 --ha-tfx-translate-y
  12 --ha-tfx-translate-x
  12 --ha-tfx-skew-y
  12 --ha-tfx-skew-x
  12 --ha-tfx-scale-y
  12 --ha-tfx-scale-x
  12 --ha-tfx-rotate-z
  12 --ha-tfx-rotate-y
  12 --ha-tfx-rotate-x
  12 --color-grey-97
  11 --sky
  11 --f-ten
  10 --poppins
   8 --primary-brand-color-600
   8 --grid-row-gap
   8 --f-six
   8 --color-grey-98
   8 --c
   7 --White
   6 --scaling-factor
   6 --ha-tfx-translate-y-hover
   6 --ha-tfx-translate-x-hover
   6 --ha-tfx-transition-duration
   6 --ha-tfx-skew-y-hover
   6 --ha-tfx-skew-x-hover
   6 --ha-tfx-scale-y-hover

=== CSS variable definitions (--name:) ===
--base-font-size:
--blue:
--border-radius:
--box-shadow-top:
--c:
--color-description:
--cta-color:
--cta-text-color:
--dark-blue:
--error:
--f-1:
--f-2:
--f-3:
--f-4:
--f-5:
--f-eight:
--f-eleven:
--f-five:
--f-four:
--f-nine:
--f-one:
--f-seven:
--f-six:
--f-ten:
--f-three:
--f-twelve:
--f-two:
--font-family:
--green:
--grey:
--highlight-color:
--line-border-empty:
--line-border-fill:
--orange:
--primary-color:
--scaling-factor:
--secondary-color:
--selected-background-color:
--selected-color-light:
--selected-color:

=== Top 30 PHP page filenames ===
  31 step_form_1.php
  18 footer_2.php
  14 index.php
  11 footer_1.php
  10 top_feature_1.php
   9 hero_banner_3.php
   7 cta_1.php
   6 step_form_34.php
   6 faq_1.php
   6 achievements_1.php
   5 top_feature_52.php
   5 step_form_38.php
   5 mysql_connecter.php
   5 modal_9.php
   5 hero_banner_2.php
   5 header_20.php
   5 header_1.php
   5 harvard_1.php
   5 first_fold_1.php
   5 Footer.php
   5 FAQs.php
   5 Courses.php
   4 usp_5.php
   4 usp_4.php
   4 top_feature_5.php
   4 top_feature_4.php
   4 top_feature.php
   4 testimonial_51.php
   4 testimonial_46.php
   4 testimonial_2.php

=== Tailwind class usage (top 80) ===
1288 text-md-right
 910 m-b-2
 363 m-t-2
 127 bg-primary
 122 text-light
  22 py-5
  18 w-5
  18 h-5
  15 text-md-left
  14 text-yellow-400
  12 w-8
  12 h-8
  10 text-center
  10 m-3
   9 w-4
   9 h-4
   8 text-muted
   8 text-brightchamps-blue
   8 bg-white
   6 m-l-1
   5 w-6
   5 text-md-center
   5 text-green-600
   5 h-6
   4 p-testimonial-lamp
   3 w-10
   3 text-white
   3 text-orange-200
   3 text-content
   3 h-10
   2 text-4
   2 text-3
   2 text-2
   2 text-1
   2 my-auto
   2 m-4
   2 bg-vector-top-right
   2 bg-vector-bottom-left
   1 text-wrap
   1 text-gray-800
   1 text-brightchamps-purple
   1 text-brightchamps-orange
   1 text--beginning
   1 bg-success
   1 bg-danger
```
