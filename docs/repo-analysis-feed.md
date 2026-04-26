# Repo Analysis — brightchamps-student-feed (React app)

**Path:** `/repo-cloned/brightchamps-student-feed-b84495106f34`
**Date:** 2026-04-26
**Verdict:** React 18 + Redux Toolkit + Webpack + SCSS modules. Atomic-design folder structure. **Has a SCSS token system that is barely used** — most styling is hardcoded hex inline.

---

## Stack

```
{
  "name": "student-feed",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js"
  },
  "dependencies": {
    "@babel/preset-typescript": "^7.24.7",
    "@babel/runtime": "^7.27.6",
    "@reduxjs/toolkit": "^2.2.7",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "axios": "^1.7.4",
    "imagekitio-react": "^4.2.0",
    "moment": "^2.29.4",
    "moment-timezone": "^0.5.43",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-pdf": "^7.7.3",
    "react-player": "^2.13.0",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.26.1",
    "react-virtuoso": "^4.12.2"
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/plugin-transform-runtime": "^7.25.4",
    "@babel/preset-env": "^7.25.4",
    "@babel/preset-react": "^7.24.7",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^12.0.2",
    "css-loader": "^5.2.7",
    "dotenv": "^16.4.5",
    "dotenv-webpack": "^8.1.0",
    "html-webpack-plugin": "^4.5.0",
    "sass": "^1.77.8",
    "sass-loader": "^16.0.0",
    "style-loader": "^2.0.0",
    "webpack": "^5.93.0",
    "webpack-cli": "^4.1.0",
    "webpack-dev-server": "^3.11.0",
    "webpack-merge": "^5.2.0"
  }
}

```

## File extensions

```
 112 js
  77 scss
  58 webp
  52 svg
   2 png
   2 json
   1 yml
   1 ts
   1 md
   1 ico
   1 html
   1 gitignore
   1 babelrc
```

## Existing SCSS token system

### `src/styles/_colors.scss`
```scss
$primary-color: #4e3bc2;
$primary-color-dark: #3928a0;
$primary-color-darker: #27197e;
$secondary-color: #ff752c;
$shade-color: #f5f6f7;

$disabled-bg: #eff3f5;
$app-background: #f5f4fa;
$menu-hover-color: #edebf8;
$dropdown-hover-color: #eff3f5;
$dropdown-font-color: #424242;

$text-black-primary: #384655;
$text-black-secondary: #3d4d5d;
$text-white: #ffffff;
$text-disabled: #8e8e8e;
$light-gray: #f5f6f7;
$dark-gray: rgba(61, 77, 93, 0.6);
$text-area-bg-color: #fafafa;
$backdrop-color: rgba(0, 0, 0, 0.05);
$slot-border-color: #3d4d5d33;
$card-border-color: #ededed;
```

### `src/styles/_variables.scss`
```scss
@import "breakpoints";
@import "colors";
@import "fonts";

$shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
$border-radius: 16px;
$primary-color: #007bff;
$secondary-color: #f0ad4e;
$font-stack: "Nunito", sans-serif;
$text-property: (
  "text-font-family": "Nunito",
  "text-black": #3d4d5d,
  "text-black-alpha": #3d4d5d99,
  "text-white": #ffffff,
  "text-disabled": #8e8e8e,
  "text-label-color": #303437,
  "text-input-color": #33333340,
  "invalid-text-color": #ff0000,
  "modal_font_family": "Nunito",
);
$cdnEndpoint: "";
```

### `src/styles/_space.scss`
```scss
@import "mixins";

$breakpoints: (
  "mobile": 480px,
  "tablet": 768px,
);
$spacings: (
  "s": 0.3rem,
  "sm": 0.5rem,
  "sr": 0.75rem,
  "r": 1rem,
  "rm": 1.5rem,
  "m": 1.6rem,
  "mr": 1.75rem,
  "l": 2rem,
  // 32px
  "ml": 2.5rem,
  "xl": 3rem,
  "mxl": 3.5rem,
  "2xl": 4rem,
  "auto": auto,
);

@mixin generate-spacing-classes {
  @each $key, $value in $spacings {
    .m-#{$key} {
      margin: $value;
    }
    .p-#{$key} {
      padding: $value;
    }

    // Vertical Margin and Padding
    .m-y-#{$key} {
      margin-top: $value;
      margin-bottom: $value;
    }
    .p-y-#{$key} {
      padding-top: $value;
      padding-bottom: $value;
    }
    .m-x-#{$key} {
      margin-left: $value;
      margin-right: $value;
    }
    .p-x-#{$key} {
      padding-left: $value;
      padding-right: $value;
    }

    // Individual Sides Margin and Padding
    .m-t-#{$key} {
      margin-top: $value;
    }
    .m-r-#{$key} {
      margin-right: $value;
    }
    .m-b-#{$key} {
      margin-bottom: $value;
    }
    .m-l-#{$key} {
      margin-left: $value;
    }
    .p-t-#{$key} {
      padding-top: $value;
    }
    .p-r-#{$key} {
      padding-right: $value;
    }
    .p-b-#{$key} {
      padding-bottom: $value;
    }
    .p-l-#{$key} {
      padding-left: $value;
    }

    // Gap classes for Flexbox and Grid
    .gap-#{$key} {
      gap: $value;
      @include sm-max {
        gap: calc(#{$value} * 2);
      }
    }
    .stack-#{$key} {
      & > * + * {
        margin-top: $value;
      }
    }
  }
}
```

## Full analysis output

```
=== 3. ALL HARDCODED COLOR VALUES (top 50) ===
  83 #fff
  15 #3d4d5d
  14 #e8e8e8
  14 #222a33
  11 #000
   9 #6651e4
   8 #ffffff
   8 #f7f6fd
   7 #51667b
   7 #424242
   7 #007bff
   6 #e866ff
   6 #409cf2
   6 #24c26e
   6 #1f0374
   6 #0d1d2d
   5 #4d4d4d
   5 #009bd6
   4 #f5b301
   4 #e0e0e0
   4 #762325
   4 #6a33d6
   4 #0f1d4a
   4 #00774c
   3 #ffaa00
   3 #f5f5f5
   3 #ebf5fd
   3 #9685ff
   3 #7546ff
   3 #438cff
   3 #00d95f
   2 #ffce6d
   2 #ffce22
   2 #ffcadb
   2 #ffa722
   2 #ff752c
   2 #fc373a
   2 #f5f6f7
   2 #f5ab00
   2 #f0ad4e
   2 #eff3f5
   2 #efebff
   2 #ededed
   2 #e5e5e5
   2 #dc4245
   2 #a3003d
   2 #962123
   2 #92e4ff
   2 #8e8e8e
   2 #7453d7

=== 4. CSS VARIABLE REFERENCES (top 50) ===

=== CSS variable definitions in feed repo ===

=== 5. Class names from JSX (top 80 utility-style; this app may use CSS modules) ===

=== 6. Component files ===
src/pages/MyFeedPage.js
src/pages/FeedById.js
src/pages/GlobalFeedPage.js
src/components/molecules/index.js
src/components/atoms/index.js
src/components/feed/MyFeed.js
src/components/feed/GlobalFeed.js
src/components/molecules/CardBody/index.js
src/components/molecules/ReactionSection/index.js
src/components/molecules/CommentSummary/index.js
src/components/molecules/CommentSection/index.js
src/components/molecules/CardHeader/CardHeader.js
src/components/molecules/CardDescription/index.js
src/components/molecules/CardBody/GenericVideoTemplateBody/index.js
src/components/molecules/skeletons/feedskeleton/index.js
src/components/molecules/CommentSection/Comment/Comment.js
src/components/molecules/CommentSection/ReplyInput/ReplyInput.js
src/components/molecules/CommentSection/CommentList/CommentList.js
src/components/molecules/CommentSection/CommentAction/CommentAction.js
src/components/molecules/CommentSection/CommentDetails/CommentDetails.js
src/components/molecules/CardHeader/TeacherDefaultProfile/TeacherDefaultProfile.js
src/components/atoms/Caption/index.js
src/components/atoms/Video/index.js
src/components/atoms/Rating/Rating.js
src/components/atoms/VideoWrapper/index.js
src/components/atoms/Image/index.js
src/components/atoms/CarouselIndicator/index.js
src/components/atoms/Button/index.js
src/components/atoms/CustomCarousel/index.js
src/components/atoms/CircularImage/CircularImage.js
src/components/atoms/Text/index.js
src/components/atoms/Icon/index.js
src/components/atoms/CircularRating/index.js
src/components/feed/GlobalFeedTemplate/index.js
src/components/feed/templates/index.js
src/components/molecules/CardBody/Components/BadgesList/index.js
src/components/molecules/CardBody/Components/HackathonLeaderBoard/index.js
src/components/molecules/CardBody/Components/BodyHeader/index.js
src/components/molecules/CardBody/Components/PendingQuestion/index.js
src/components/molecules/CardBody/Components/WallOfFameStudentList/index.js
src/components/molecules/CardBody/Components/WallOfFameStudentInfo/index.js
src/components/molecules/CardBody/BodyComponents/AssignmentCardBody/index.js
src/components/molecules/CardBody/BodyComponents/WallOfFameBody/index.js
src/components/molecules/CardBody/BodyComponents/GenericCardBody/index.js
src/components/molecules/CardBody/BodyComponents/GlobalFeedBody/index.js
src/components/molecules/CardBody/BodyComponents/CertificateCardBody/index.js
src/components/molecules/CardBody/BodyComponents/NanoCourseCardBody/index.js
src/components/molecules/CardBody/BodyComponents/BadgesEarnedCardBody/index.js
src/components/molecules/CardBody/BodyComponents/NanoSkillDiscountTriggerBody/index.js
src/components/molecules/CardBody/BodyComponents/HackathonCardBody/index.js
src/components/molecules/CardBody/BodyComponents/DemoVideoBody/index.js
src/components/molecules/CardBody/BodyComponents/InsideClassCardBody/index.js
src/components/molecules/CardBody/BodyComponents/BadgesBody/index.js
src/components/molecules/CardBody/BodyComponents/BadgesLeaderboardResultCardBody/index.js
src/components/molecules/CardBody/BodyComponents/CompletionCardBody/index.js
src/components/molecules/CardBody/BodyComponents/CompletionCardBody/utils.js
src/components/feed/templates/BadgesLeaderboardResult/index.js
src/components/feed/templates/Certificate/index.js
src/components/feed/templates/GenericTemplate/index.js
src/components/feed/templates/ClassCompletion/index.js

=== Total component files ===
src/components/atoms files:       24
src/components/molecules files:       86
src/components/feed files:       34
src/pages files:        3
all .js/.jsx files in src:      109

=== 7. Token / theme imports ===

=== 8. styled-components / emotion / ThemeProvider usage ===
       0

=== SCSS files (potential token sources) ===
src/App.scss
src/styles/_fonts.scss
src/styles/_colors.scss
src/styles/_variables.scss
src/styles/_breakpoints.scss
src/styles/global.scss
src/styles/_lib.scss
src/styles/_mixins.scss
src/styles/_space.scss
src/components/feed/GlobalFeed.module.scss
src/components/molecules/ReactionSection/reaction.module.scss
src/components/molecules/CommentSummary/comment-summary.module.scss
src/components/molecules/CardHeader/CardHeader.module.scss
src/components/molecules/CardDescription/CardDescription.module.scss
src/components/atoms/Caption/Caption.module.scss
src/components/atoms/Video/Video.scss
src/components/atoms/Rating/StarRating.scss
src/components/atoms/VideoWrapper/VideoWrapper.module.scss
src/components/atoms/CarouselIndicator/CarouselIndicator.module.scss
src/components/atoms/Button/Button.scss

=== Sample SCSS variables $name: ===
```
