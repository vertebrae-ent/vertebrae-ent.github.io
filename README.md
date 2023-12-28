# Vertebrae Entertainment

## How to run this

You will need to have NodeJS and git installed before you do this. First clone the repo. Then run:

```
npm install
npm start
```

This will install the dependencies and start the project locally. You may view the result in `http://localhost:4200`.

In order to publish this to github pages, run:

```
npm run build --prod --base-href "https://vertebrae-ent.github.io/"
npx angular-cli-ghpages --dir=dist/vertebrae
```

## Micro Content Management System - Introduction

This is a custom made json based CMS using plain web components to render it's content.
The configuration is located under [`./src/.root/index.json`](./src/.root/index.json), and each blog post is a markdown file
located under [`./src/.root/_posts`](./src/.root/_posts/).

The website is structured by three routes:

- [The landing page](https://vertebrae-ent.github.io/) - most of the configuration from index.json is for the contents and layout of the landing page
- [About us](https://vertebrae-ent.github.io/about) - A small introductory page of Vertebrae Entertainment
- [Projects](https://vertebrae-ent.github.io/projects) - A page showcasing the projects Vertebrae Entertainment is building

For more details and code, please look under [./src/app](./src/app/README.md).

Below is a small documentation of the json structure we support.

```
{
  "home": [],      <-- Contains the content for the main landing page
  "about": {},     <-- The configuration for the about page
  "projects: {},   <-- The configuration for the projects page
  "linkList": []   <-- Footer links
}
```

## [`home`](./src/app/views/landing-page/README.md) Overview

This part of the configuration contains sections of content. Each object in the array covers properties for one section of the landing page. There are also some common properties for all content-types, but also some specific to a particular type. Let's go over the common ones first:

- `header` - **(Optional)** which defines the title for the section
- `headerPosition` - **(Optional)** which allows you to customize the alignment of the header ("left" _default if not provided_ or "right")
- `type` - **(Required)** the content-type, which determines which other properties we can set on this section.

Each section must have a `type`. These are the different types we support:

### [`hero`](<(./src/app/views/landing-page/sections/hero.component.ts)>)

A hero element is usually an image but can also be a text, a slogan, something eye-catchy, which creates a "selling-point" for the product or company. It can also contain an action or two - links to the product or something related to the product. So the additional properties available for sections of `"type": "hero"` are:

- `backdropImage` - a url to an image to set as the background for the hero element
- `logo` - a url to an overlaid image, usually a logo with transparent background laid out on top of the backdrop image
- `actions` - buttons to present on top of the backdrop image, represented as an array of:
  - `name` - the link text
  - `url` - the url for the link

### [`carousel`](<(./src/app/views/landing-page/sections/carousell.component.ts)>)

This type of element works as a show-case. It presents images in a horizontal grid. Each image can have a link attached to it.

- `images` - An array of configuration objects for an image.
  - `link` - if this is present in the object, the image will be clickable and route to either an internal or external url.
  - `header` - used for accessibility reasons.

### [`social`](<(./src/app/views/landing-page/sections/social.component.ts)>)

A list of contact points, usually social media links but if `action` is present, it will link to a custom action. Currently we only support one action: `newsletter`, which will bring up a newsletter subscription dialog.

- `links` - An array of configuration objects:
  - `name` - The name of the contact point. Should be present for accessibility reasons
  - `url` - **(Optional)** either a url is provided or an action
  - `action` - **(Optional)** if not provided, a url must be provided
  - `image` - A url for an image to represent the contact point

### [`text`](./src/app/views/landing-page/sections/text.component.ts)

## [`about`](./src/app/views/about-us/README.md) Overview

## [`projects`](./src/app/views/projects/README.md) Overview

## [`linkList`](./src/app/shared/link-list.component.ts) Overview
