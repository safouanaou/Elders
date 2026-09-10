# Elders — restaurant & wijnbar

A responsive, Dutch-language restaurant website based on the supplied editorial reference PDF, style guide, and Elders identity analysis. Built with HTML, CSS, and JavaScript; no dependencies are required.

## Run

```sh
npm run dev
```

Open http://localhost:5173. Use `npm run dev -- --port 3000` for another port.

## Build

```sh
npm run build
npm run preview
```

Upload the contents of `dist/` to a static web host when ready to publish.

## Editing

- `index.html`: page content, images, contact details, hours, and external links.
- `styles.css`: responsive layouts, local fonts, palette, and reduced-motion support.
- `app.js`: mobile navigation and accessible lunch/dinner dialogs.
- `assets/`: original restaurant photography and locally served fonts.

Restaurant hours, prices, address, and gift-card destination were checked against https://elders.gent/ on 10 September 2026. Menu dialogs explain the dining format and link to the restaurant's current menu; they are not a live menu feed. Reservations open the existing official reservation section. There is no booking backend in this project.

Validation: build and JavaScript syntax checks, browser checks at 390, 768, and 1440 pixels, menu dialog open/close and Escape, mobile navigation, image loading, and horizontal overflow.

## Motion

Display typography uses locally hosted Six Caps with synthesized bold. Scroll position drives reversible text reveals (rise/scale, drift, fade, and tracking), three overlapping menu cards, and a full-viewport wine-bar reveal with side-by-side image panels. The gallery loops at about 17 pixels per second. Desktop wheel scrolling uses a 0.714 distance multiplier with gradual settling; touch, keyboard, dialogs, and horizontal gestures remain native. Reduced-motion mode disables these effects and restores every card to ordinary document flow.
