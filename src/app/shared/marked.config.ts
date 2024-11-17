import { marked, Token, Tokens, TokensList } from 'marked';

interface YoutubeLinkToken extends Tokens.Generic {
  type: 'youtubeLink';
  raw: string;
  href: string;
  text: string;
}

interface CarouselListToken extends Tokens.Generic {
  type: 'carouselList';
  raw: string;
  tokens: Tokens.Image[];
}

export function setupMarked() {
  const renderer = new marked.Renderer();
  const originalListRenderer = renderer.list;
  marked.use({
    renderer: {
      // Override for list renderer to create our carousel.
      list(body: string, ordered: boolean, start: number | '') {
        if (/^(<li><img src="[^"]+" alt="[^"]+"><\/li>\n?)+$/gm.test(body)) {
          return `
          <div class="img-carousel">
            <span class="prev">
              <img class="btn" src="/assets/icons/back.svg" alt="Previous image" />
            </span>
            ${originalListRenderer.call(this, body, ordered, start)}
            <span class="next">
              <img class="btn" src="/assets/icons/next.svg" alt="Next image" />
            </span>
          </div>`;
        }
        return originalListRenderer.call(this, body, ordered, start);
      },
    },
    extensions: [
      {
        name: 'youtubeLink',
        level: 'inline',
        // start(src: string) {
        //   return src.match(/(- !\[([^\]]+)\]\(([^)]+)\)\s*){2,}/g)?.index;
        // },
        tokenizer(
          src: string,
          tokens: Token[] | TokensList,
        ): YoutubeLinkToken | undefined {
          // Check for Markdown link format
          const youtubeLinkRegex =
            /\!\!\[([a-zA-Z\s]*)\]\((https:\/\/(?:www\.)?youtube\.[a-z]{2,3}\/watch\?v=[^\s)]+)\)/i;
          const matchMarkdownLink = youtubeLinkRegex.exec(src);
          if (matchMarkdownLink) {
            const token = {
              type: 'youtubeLink',
              raw: matchMarkdownLink[0],
              href: matchMarkdownLink[2],
              text: matchMarkdownLink[1],
            } as YoutubeLinkToken;
            return token;
          }
          return undefined;
        },
        renderer(token: Tokens.Generic) {
          const href = (token as YoutubeLinkToken).href;
          const text = (token as YoutubeLinkToken).text;
          const youtubeID = new URL(href).searchParams.get('v');
          return `
          <div class="youtube-video">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/${youtubeID}"
              frameborder="0"
              allowfullscreen></iframe>
          </div>`;
        },
      },
    ],
  });
}
