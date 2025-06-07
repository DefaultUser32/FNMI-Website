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

## Adding Content

### Main Sections

Edit the content in `index.html` to update the main sections:
- Welcome
- The Power of Art
- Art as Resistance
- Art's Impact
- Challenges
- Social Media

### Feed Items

To add new feed items, edit the `feedItems` array in `js/main.js`. Each item should have:
- `image`: Path to the image
- `title`: Title of the piece
- `description`: Description of the artwork

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 