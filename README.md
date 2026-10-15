# Medical centre cleaning

Static mockup for the proposed Namoli Healthcare medical centre cleaning money page.

- Repository: <https://github.com/Lilmonstersam/namoli-healthcare-nhc-cleaning-service-pages>
- GitHub Pages: <https://lilmonstersam.github.io/namoli-healthcare-nhc-cleaning-service-pages/>
- Production destination: <https://www.namolihealthcare.com.au/healthcare-cleaning/medical-centre-cleaning/>

## Deployment

Pushes to `main` deploy the static mockup through [the GitHub Pages workflow](.github/workflows/deploy-pages.yml). The workflow validates local references, builds a clean `_site` artifact and publishes only `index.html`, `frequency-section.css`, `robots.txt` and the saved asset directory.

The public mockup is `noindex, nofollow`, has a blocking `robots.txt`, retains the production canonical URL and does not load the saved production tracking scripts.

### Repository setup

Ensure GitHub Pages deployment source is set to **GitHub Actions**:
`Settings` -> `Pages` -> `Build and deployment` -> `Source: GitHub Actions`.

### Local validation and preview

Run the deployment validation locally:

```bash
npm test
# or
node scripts/validate-site.mjs
```

Preview the page locally:

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765/>.

## Mockup scope

[index.html](index.html) is the optimised page using the **original layout and styling**. Fonts, colours, button shapes, image treatment, existing sections, cards and four FAQ slots are retained. Existing CSS files and inline styles are unchanged. The added frequency-section.css is scoped to the new section only. One approved frequency section is added before the FAQs. Its three interval cards sit side by side on desktop and stack below 900px; the page’s existing font styles and CTA styling are retained. Text length naturally affects section heights.

The original saved HTML, Ahrefs evidence, competitor captures, QA output, screenshots and production redirect files remain in the local working folder. They are deliberately excluded from this public deployment repository.

The new frequency section covers daytime, daily and periodic tasks in 129 words. The existing FAQ answer is shortened and links to it. Cost factors, medical-group needs and the practice-manager video remain within existing content slots. The original rounded CTA component now says Request Your Cleaning Quote.

Production content and redirects have **not** been changed. Deploy the copy at the existing canonical URL, replace the existing `/medical-centres/` redirect, redirect `/video/medical-centres/` directly to the destination, update internal links and remove the retired video page from the sitemap. The destination retains a direct link to the existing practice-manager video.
