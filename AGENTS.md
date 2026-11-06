<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Grip Force — architecture rules

- The storefront may retain its Phase 1 static catalog while Phase 2 adds
  Lovable Cloud-managed products and admin tools; do not switch customer-facing
  catalog reads until the database catalog is verified and ready to replace it.
- Admin access is granted only to the owner's verified email through the
  database role trigger; admin reads and writes must remain protected by RLS.
- Brand tokens live only in `src/styles.css`; components use semantic classes
  (btn-neon, badge-neon, heading-section, light-* tokens), never raw colors.
- Prices are placeholder USD values; real prices arrive from Shopify in Phase 3.
- No fake reviews, countdowns or invented product claims anywhere in the site.
