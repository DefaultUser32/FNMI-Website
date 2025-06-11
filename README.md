# FNMI Art Showcase Website

A modern, interactive website showcasing First Nations, Métis, and Inuit art as a tool for cultural resilience and reclamation.

## Features

- Single-page design with smooth scrolling and animations
- Interactive navigation
- Responsive layout for all devices
- Feed view for detailed content
- Modern animations using GSAP
- Accessible design

## Setup

1. Clone the repository
2. Open `index.html` in your web browser

## Development

The project uses vanilla JavaScript, HTML, and CSS. No build process is required.

### Dependencies

- GSAP (GreenSock Animation Platform) for animations
- Font Awesome for icons

### File Structure

```
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Main stylesheet
├── js/
│   └── main.js        # Main JavaScript file
└── README.md          # This file
```

## Image Hosting & Paths

All artist images, backgrounds, and works are served from a Cloudflare bucket at:
`https://fnmi-bucket.matthewmacdonald.xyz/`

- Headshots: `/Artist_Headshots/ArtistName.webp`
- Backgrounds: `/Artist_Backgrounds/Region.webp`
- Works: `/Works/WorkName.webp` or `/Works/Videos/WorkName.mp4`

Ensure you use the correct directory and file names when adding or updating images.

## Feed Logic

The feed view displays works from all artists. To improve loading and user experience, the code ensures that the first item in the feed is never a video. If the first item would be a video, it is swapped with the first available image-based item.

## Adding Content

### Main Sections

Edit the content in `index.html` to update the main sections:
- Welcome
- The Power of Art
- Art as Resistance
- Art's Impact
- Challenges
- Social Media

### Feed Items & Artist Data

To add new feed items or update artist information, edit the `artists` array in `js/artists.js`. Each artist and work references images and videos by their full URL (see above for path conventions). Example fields:
- `image`: Full URL to the artist headshot
- `background`: Full URL to the background image
- `works[].media[]`: Array of media objects with `type` (`image` or `video`) and `url`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 