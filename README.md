# Namra Shah - Portfolio (React Version)

This is a React version of my personal portfolio website, converted from the original HTML/CSS/JavaScript implementation while maintaining all the original functionality and behavior.

## Features

- **Theme Switching**: Dark/Light mode toggle with persistent storage
- **Dynamic Background Words**: Animated background words that appear and fade out randomly
- **Hero Animation**: Animated name entrance with scroll-based movement
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Interactive Timeline**: Experience section with alternating layout and hover effects
- **Project Cards**: Interactive project cards with external links
- **Contact Form**: EmailJS integration for contact form functionality
- **Info Tooltip**: Interactive info icon with tooltip
- **Profile Photo**: Theme-based profile photo switching

## Technologies Used

- React 18
- CSS3 with CSS Variables for theming
- EmailJS for contact form
- Google Fonts (JetBrains Mono)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Configuration

### EmailJS Setup

To enable the contact form functionality, you need to:

1. Sign up for EmailJS at [emailjs.com](https://www.emailjs.com/)
2. Create an email service and template
3. Update the EmailJS configuration in `src/components/ContactSection.js`:
   - Replace `YOUR_USER_ID` with your EmailJS user ID
   - Replace `YOUR_SERVICE_ID` with your EmailJS service ID
   - Replace `YOUR_TEMPLATE_ID` with your EmailJS template ID

## Project Structure

```
src/
├── components/
│   ├── Navbar.js              # Navigation component with theme toggle
│   ├── HeroSection.js         # Hero section with animated names
│   ├── BackgroundWords.js     # Dynamic background words component
│   ├── AboutSection.js        # About section with profile photo
│   ├── ExperienceSection.js   # Experience timeline
│   ├── ProjectsSection.js     # Projects grid
│   └── ContactSection.js      # Contact form
├── App.js                     # Main app component
├── App.css                    # All styles (converted from original)
└── index.js                   # React entry point
```

## Assets

The following assets are included in the `public/` folder:
- `profile-dark.JPG` - Dark theme profile photo
- `profile-light.JPG` - Light theme profile photo
- `favicon.png` - Website favicon
- `background-words.txt` - List of background words

## Original vs React Version

This React version maintains 100% of the original functionality:

- ✅ Theme switching with localStorage persistence
- ✅ Dynamic background words animation
- ✅ Hero section animations
- ✅ Responsive navigation with active section highlighting
- ✅ Timeline hover effects and alternating layout
- ✅ Project card interactions
- ✅ Contact form with EmailJS
- ✅ Info tooltip functionality
- ✅ Profile photo theme switching
- ✅ All CSS animations and transitions
- ✅ Mobile responsiveness

## Customization

To customize the portfolio:

1. **Content**: Update the content in each component file
2. **Styling**: Modify `src/App.css` to change colors, fonts, and layout
3. **Background Words**: Edit `public/background-words.txt` to change the background words
4. **Profile Photos**: Replace the profile photos in the `public/` folder
5. **Projects**: Update the projects array in `ProjectsSection.js`

## Deployment

The React app can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository to Vercel for automatic deployments
- **Netlify**: Drag and drop the `build` folder or connect your repository
- **GitHub Pages**: Use `npm run deploy` (requires `gh-pages` package)

## License

This project is open source and available under the [MIT License](LICENSE).
