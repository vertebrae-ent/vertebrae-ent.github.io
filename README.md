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

Below is a small documentation of the json structure we support.

```
{
  "home": [],      <-- Contains the content for the main landing page
  "about": {},     <-- The configuration for the about page
  "projects: {},   <-- The configuration for the projects page
  "linkList": []   <-- Footer links
}
```

## `home` Overview

This part of the configuration contains sections of content. Each object in the array covers properties for one section of the landing page. There are also some common properties for all content-types, but also some specific to a particular type. Let's go over the common ones first:

- `header` - **(Optional)** which defines the title for the section
- `headerPosition` - **(Optional)** which allows you to customize the alignment of the header ("left" _default if not provided_ or "right")
- `type` - **(Required)** the content-type, which determines which other properties we can set on this section.

Each section must have a `type`. These are the different types we support:

### `hero`

A hero element is usually an image but can also be a text, a slogan, something eye-catchy, which creates a "selling-point" for the product or company. It can also contain an action or two - links to the product or something related to the product. So the additional properties available for sections of `"type": "hero"` are:

- `image` - a url to an image
- `actions` - an array of `{ "name": "the_link_text", "url": "the_url_for_the_link" }`

The code for this component is located in [Hero component](./src/app/views/landing-page/sections/hero.component.ts)

### `carousel`

This type of element works as a show-case

The code for this component is located in [Carousel component](./src/app/views/landing-page/sections/carousell.component.ts)

### `social`

The code for this component is located in [Social component](./src/app/views/landing-page/sections/social.component.ts)

### `text`

The code for this component is located in [Text component](./src/app/views/landing-page/sections/text.component.ts)

## `linkList` Overview

The code for this component is located in [Linklist component](./src/app/shared/link-list.component.ts)
