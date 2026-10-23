# Aling Music Room

Static music player for Odd Dice. Supports play/pause, seeking, volume, mute, skip 10 seconds and repeat. Mobile browsers may require a tap to play; iOS volume uses hardware keys.

## Cloudflare Workers Builds

- Repository: Kitasan-black/LBK-TEMPORARYWEB
- Production branch: main
- Root: /
- Build command: leave empty
- Deploy command: npx wrangler deploy
- Assets: public/ (configured in wrangler.jsonc)

The original FLAC remains outside the repository. The website uses a 256 kbps MP3 under the 25 MiB static asset limit.

## Custom domain: aling16v.icu

1. Add aling16v.icu to the same Cloudflare account and choose the Free plan.
2. Review existing DNS records and preserve mail and other services.
3. At the domain registrar, replace DNSPod nameservers with the two nameservers assigned by Cloudflare.
4. After the zone becomes Active, open Workers & Pages > lbk-temporaryweb > Settings > Domains & Routes > Add > Custom Domain, and enter aling16v.icu.
5. Wait for domain and HTTPS activation, then verify the page and audio.

Do not point the domain to a private LAN IP. Cloudflare manages the DNS record for a Worker custom domain.
