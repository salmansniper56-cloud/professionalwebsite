# Lusion reference snapshot

Source: https://lusion.co/ (retrieved 2026-10-15).

The previous original React/CSS approximation has been replaced by the reference
homepage markup (`home.html`), stylesheet (`public/lusion/reference.css`), and
browser runtime (`public/lusion/runtime.js`). The runtime includes Three.js and
retains its upstream license notices.

The React component mounts the markup before loading the runtime. The reference
runtime then owns its animated DOM, smooth scrolling, menus, WebGL scenes, sound,
reel playback, and client-side navigation. It is deliberately loaded once.

Adaptations:
- Asset URLs use the reference's public CORS-enabled https://lusion.dev CDN.
- Client-side page requests use https://lusion.co rather than the Vite fallback.
- Original analytics scripts are not included.
- Newsletter submission is intercepted before any personal data is submitted;
  it states that subscriptions are available on the original website.

This is a reference snapshot, not an independently authored React recreation or
a self-contained offline export. Fonts, models, textures, project images, audio,
videos, secondary pages, and Vimeo playback depend on the upstream hosts and may
change or become unavailable. Branding, copy, and media remain the property of
their respective owners; obtain appropriate permission before publishing.
