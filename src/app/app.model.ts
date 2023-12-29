import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * The main configuration model for the app
 */
export interface CMSConfig {
  /** The frontpage sections*/
  home: CMSSection[];
  /** About page */
  about: {};
  /** Blog articles */
  projects: CMSProjects[];
  /** Footer links */
  linkList: CMSLinks[];
}

//---------------------------------------------------------------------
// SECTION TYPES
//---------------------------------------------------------------------
/**
 * Specifies the section types we support
 */
export type CMSSectionType = 'hero' | 'carousel' | 'text' | 'social';

/**
 * Defines the contents of a frontpage section.
 *
 * Now since we have different types of sections, this is only
 * the generic types belonging to all sections. Depending on the
 * `type` property, you will define one of the more
 * specific `CMSSectionType*` interfaces below.
 *
 * The actual rendering implementation for each section type is
 * defined in the `src/app/views/home/sections` folder.
 */
export interface CMSSection {
  /** The type of section */
  type: CMSSectionType;
  /** A display header */
  header?: string;
  /** The header alignment */
  headerPosition?: 'left' | 'right';
  /**
   * A css class to set on the section.
   * Mainly used for the toothrack graphics, but can also be used
   * for other style related things.
   */
  class: string;
}

/**
 * The 'hero' `CMSSection` type
 */
export interface CMSSectionTypeHero extends CMSSection {
  /** `CMSSection.type` must equal 'hero' for this section type to be valid */
  type: 'hero';
  /**
   * The background image to display.
   * The url is specified as a string in the configuration, but translated to a
   * `SafeResourceUrl` in the `CMSConfigService` for sanitization purposes.
   */
  backdropImage: string | SafeResourceUrl;
  /**
   * The logo to display.
   * The url is specified as a string in the configuration, but translated to a
   * `SafeResourceUrl` in the `CMSConfigService` for sanitization purposes.
   */
  logo: string | SafeResourceUrl;
  actions: CMSLinks[];
}

/**
 * The 'carousel' `CMSSection` type
 */
export interface CMSSectionTypeCarousel extends CMSSection {
  /** `CMSSection.type` must equal 'carousel' for this section type to be valid */
  type: 'carousel';
  /**
   * The images to display.
   * The urls are specified as a string in the configuration, but translated to a
   * `SafeResourceUrl` in the `CMSConfigService` for sanitization purposes.
   */
  images: CMSImage[];
}

/**
 * The 'text' `CMSSection` type
 */
export interface CMSSectionTypeText extends CMSSection {
  /** `CMSSection.type` must equal 'text' for this section type to be valid */
  type: 'text';
  text: string;
  actions: CMSLinks[];
  image: CMSImage;
}

/**
 * The 'social' `CMSSection` type
 */
export interface CMSSectionTypeSocial extends CMSSection {
  /** `CMSSection.type` must equal 'social' for this section type to be valid */
  type: 'social';
  links: CMSLinks[];
}

/**
 */
export interface CMSImage {
  position?: 'before' | 'after';
  /**
   * The image url to display.
   *
   * The url is specified as a string in the configuration, but translated to a
   * `SafeResourceUrl` in the `CMSConfigService` for sanitization purposes.
   */
  url: string | SafeResourceUrl;
  header?: string;
  text?: string;
  link: string;
}

/**
 * A link object.
 *
 * A link must have a display name, and also one of the following:
 *  - `url` - A url to navigate to
 *  - `action` - A string representing an action to perform
 *  - `safeAction` - A function to call when the link is clicked
 */
export interface CMSLinks {
  target?: string;
  name: string;
  description?: string;
  isInternal?: boolean;
  /**
   * The url this link points to.
   *
   * The url is specified as a string in the configuration, but translated to a
   * `SafeUrl` in the `CMSConfigService` for sanitization purposes.
   */
  url?: string | SafeUrl;
  action?: string;
  safeAction: () => void;
  /**
   * The image to display for this link.
   *
   * The image is specified as a string in the configuration, but translated to a
   * `SafeResourceUrl` in the `CMSConfigService` for sanitization purposes.
   */
  image?: string | SafeResourceUrl;
}

export interface CMSProjects extends CMSImage {
  timeline: string[];
}
