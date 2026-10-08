Overview:

We need to build a website that we will call THE HUB. the index page golds three mood boards, three design systems, and a link to one final site with one of the design systems applied (I will choose after they are developed). 

See ref-img/the-hub.png for a reference of what THE HUB page layout should be like.

Start with creating the links to the pages on the main page. Then we will build out each page individually. 


TechStack:

Next.js and Tailwind CSS, as a static site: no database, accounts, external APIs, or data storage. 

Design Requirements:
- Visual hierarchy: it's clear what to look at first.
- Type: a few sizes and weights, used the same way throughout, and text that's comfortable to read.
- Color: a small palette where each color has a purpose.
- Accessibility: text contrast is legible.
- Layout: elements are aligned intentionally, related elements are grouped, and it works on desktop and mobile.
- Affordances: interactions are obvious.
- States: controls respond when you hover, focus, or press them.
- Visual style: it looks like the style you picked, not the agent's default.
- Simplicity: nothing extra. If a word or an image doesn't help, remove it.


Mood Boards: For each of the mood boards, go to these sites and take screenshots of the images and save webp versions in the /img directory, then build out the mood board with the images and use the titles for each below:

01: Modern Vintage Top Utility
https://www.pinterest.com/Nunyabiznaass/dbs_01-modern-vintage-top-utility/

02: Red and Teal Retrotech Dystopia
https://www.pinterest.com/Nunyabiznaass/dbs_02-red%2Bteal-retrotech-dystopia/

03: Pressed Paper + Ink Storywriter
https://www.pinterest.com/Nunyabiznaass/dbs_03-pressed-paper-%2B-ink-storywriter/


Design Systems: 

For each of the above mood boards, we need to create a Design System relating to each. 

Each Design System should contain: 

1. Color roles: background, surface, text, muted text, border, and accent, with contrast ratios
2. Type roles: display, heading, body, and label, with sizes and weights, set in your own content
3. Spacing and shape: a spacing scale, corners, borders, and shadow
4. Components: primary and secondary buttons, a link, a text input, a select, checkboxes and radios, a toggle, tabs, filter chips, a card with one of your items, list rows, a badge, a modal or detail panel, and anything else your site needs
5. Control states: rest, hover, focus, pressed, selected, and disabled, where they apply
6. UI states: empty, loading, error, and success

For each design system use your design skills to choose the best representation for each of these requirements.

See an example layout of how each design system should look in the image: /ref-img/design-system-example.png

!IMPORTANT! before developing the final site, stop and ask me to preview the design systems, and make any adjustments needed. Then we will select one and move on to creating the site. 


Site: 

A simple ticket making platform for diy events and shows. The user enters the title of the event, subtitles (up to 5 additional rows) the date, the time, and the price. 
Imagine an indie band putting on a show in a diy space, they would be the title of the event (or it might be the name of the event in some cases), and the opening acts would go in the subtitle rows. 

The site generates a mockup of what the ticket will look like, along with a ticket number, and scannable bar code or qr code. 

Below the ticket mockup is a button that says Sell Tickets - this would generate a link to a stripe checkout page that the band could post on their website or instagram.

We are not integrating stripe or creating a database to hold the records. We are only creating the mockup so we can test out the design systems different ways. 