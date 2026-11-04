# Medical centre cleaning

Static mockup for the proposed Namoli Healthcare medical centre cleaning money page.

The consolidated mockup also includes [NDIS cleaning](ndis-cleaning/index.html) as a second service page. Both pages link to each other through their navigation; the medical centre page contains three day surgery videos.

- Repository: <https://github.com/Lilmonstersam/namoli-healthcare-nhc-cleaning-service-pages>
- GitHub Pages: <https://lilmonstersam.github.io/namoli-healthcare-nhc-cleaning-service-pages/>
- Production destination: <https://www.namolihealthcare.com.au/healthcare-cleaning/medical-centre-cleaning/>

## Deployment

Pushes to `main` deploy both service pages through [the GitHub Pages workflow](.github/workflows/deploy-pages.yml). The workflow generates the NDIS page from [its content](ndis-cleaning/content.html) and the medical centre page's shared header and footer, validates local references, then publishes a clean `_site` artifact with both pages and their assets.

The public mockup is `noindex, nofollow`, has a blocking `robots.txt`, retains the production canonical URL and does not load the saved production tracking scripts.

### Repository setup

Ensure GitHub Pages deployment source is set to **GitHub Actions**:
`Settings` -> `Pages` -> `Build and deployment` -> `Source: GitHub Actions`.

### Local validation and preview

Run the deployment validation locally:

```bash
npm run build
npm test
```

Preview the page locally:

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765/> or <http://127.0.0.1:8765/ndis-cleaning/>.

## Mockup scope

[index.html](index.html) is the optimised medical centre page using the **original layout and styling**. Its fonts, colours, button shapes, image treatment, existing sections, cards and four FAQ slots are retained. The added frequency-section.css styles the cleaning frequency and day surgery video sections. The NDIS page uses the same header, footer and Montserrat heading scale. Its four-card grids match the medical centre grid width, spacing, padding and shadow on desktop.

The original saved HTML, Ahrefs evidence, competitor captures, QA output, screenshots and production redirect files remain in the local working folder. They are deliberately excluded from this public deployment repository.

The new frequency section covers daytime, daily and periodic tasks in 129 words. The existing FAQ answer is shortened and links to it. Cost factors, medical-group needs and the practice-manager video remain within existing content slots. The original rounded CTA component now says Request Your Cleaning Quote.

Production content and redirects have **not** been changed. Deploy the copy at the existing canonical URL, replace the existing `/medical-centres/` redirect, redirect `/video/medical-centres/` directly to the destination, update internal links and remove the retired video page from the sitemap. The destination retains a direct link to the existing practice-manager video.
