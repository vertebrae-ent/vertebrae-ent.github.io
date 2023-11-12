# Vertebrae Entertainment

## How to run this

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
The configuration is located under `./src/.root/index.json`, and each blog post is a markdown file
located under `./src/.root/_posts`.

Below is a small documentation of the json structure we support.

```
{
  "sections": [],  <-- Contains the content for the main landing page
  "articles": [],  <-- Links to posts/articles, like a blog post or some news
  "linkList": []   <-- Footer links
}
```

## `sections` Overview

The section defines one piece of content. There are also some common properties for all content-types, but also some specific to a particular type. Let's go over the common ones first:

- `header` - **(Optional)** which defines the title for the section
- `headerPosition` - **(Optional)** which allows you to customize the alignment of the header ("left" _default if not provided_ or "right")
- `type` - **(Required)** the content-type, which determines which other properties we can set on this section.

Each section must have a `type`. These are the different types we support:

### `hero`

A hero element is usually an image but can also be a text, a slogan, something eye-catchy, which creates a "selling-point" for the product or company. It can also contain an action or two - links to the product or something related to the product. So the additional properties available for sections of `"type": "hero"` are:

- `image` - a url to an image
- `actions` - an array of `{ "name": "the_link_text", "url": "the_url_for_the_link" }`

### `carousel`

This type of element works as a show-case

### `social`

### `text`

## `articles` Overview

## `linkList` Overview
