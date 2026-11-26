# Filetransfersession

Build a single-page HTML/CSS/JavaScript file showing a realistic file-transfer animation. Layout: centered card on a light grey background. On the left, a "Sender" device (laptop illustration in CSS/SVG) with a folder; on the right, a "Receiver" device with an empty folder. Animate 3–5 file icons (PDF, DOCX, XLSX) moving from left to right along a curved dotted path with a soft blue glow trail, staggered timing. Below, show a progress bar that fills smoothly with a live percentage, transfer speed (e.g. "12.4 MB/s") and a file name that updates as each file arrives. When complete, show a green checkmark with "Transfer complete", pause 2 seconds, then loop. Use the font Trebuchet MS, corporate blue #0563C1 as the accent color, subtle shadows, smooth easing, and support light and dark mode. No external images; everything in SVG/CSS.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://filetransfersession.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bf7ca0c5-f06d-4d90-8384-c14cc86528f5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
