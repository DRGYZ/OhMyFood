# V1 baseline — OpenClassrooms

The submitted V1 is preserved at commit d56531f1b22e46acc1a573d7ce2c137832d62341 on main, archive/v1-openclassrooms, and v1.0.0-openclassrooms. GitHub Pages publishes main from the repository root.

- **Architecture and pages:** Static multipage site: index.html plus la-palette-du-gout.html, La-note-enchantee.html, a-la-francaise.html, and Le-delice-des-sens.html. Restaurant pages repeat menu and layout markup.
- **Stack:** HTML, CSS, and Sass for the loader. There is no application JavaScript or shared client-side state. The declared Parcel, Next, and React dependencies have no working scripts or usage in the pages.
- **Styling:** index.css styles the homepage; la-palette-du-gout.css styles all four menus; loader.scss generates loader.css and its source map. CSS handles responsive layout and animation. Roboto, Shrikhand, and Font Awesome load from external services.
- **Assets:** Four JPG restaurant photos are used on the homepage and menu pages. Five small PNG photo crops are present but unreferenced.
- **Known limits:** Repeated page content, placeholder footer links, no build/test commands, no meaningful JS interactions, and an 11 MB restaurant photo. The empty locales/en.json has no current role.

V2 was independently rebuilt in React + TypeScript on ohmyfood-v2. The archived V1 source and history remain unchanged.
