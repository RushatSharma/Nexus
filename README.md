# Nexus Digital Marketing Platform

Nexus is a full-featured digital marketing web application designed to connect users with services, showcase projects, and allow seamless communication through a contact form. Built with React.js, Firebase, and TailwindCSS, this platform is modern, responsive, and optimized for user experience.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### User Features:

- User authentication and profile management using Firebase.
- Contact form with real-time message submission and validation.
- Automatic textarea resizing for long messages with scroll when needed.
- Dark mode toggle for better user experience.
- View message history with status tracking.

### Admin / Project Features:

- Display all projects in a visually appealing masonry grid.
- Filter and categorize projects by service type.
- Aurora-style animated headings for enhanced design aesthetics.
- Responsive navigation with **Contact Us** button for logged-in users.
- Dynamic theme switching (Light / Dark).

---

## Demo

**Live Demo:** [Insert your live demo link here]

**Screenshots:**

- Home Page
- Projects Page
- Contact Page with animated heading
- User Profile & Message History Popover

---

## Tech Stack

- **Frontend:** React.js, TailwindCSS, React Router, Lucide Icons
- **Backend / Database:** Firebase Authentication & Firestore
- **Hosting:** [Your hosting platform if deployed]
- **Utilities:** React Context API for Authentication, Popovers, Avatars

---

## Project Structure

```

src/
├── assets/             # Images, logos
├── components/         # Reusable components like Header, Footer, AuroraTextEffect
├── contexts/           # AuthContext for managing user state
├── pages/              # React pages (Home, Contact, Projects)
├── firebase.ts         # Firebase initialization
├── App.tsx             # App entry point with routing
├── main.tsx            # React DOM rendering
└── styles/             # Tailwind custom styles if any

```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/nexus-digital-marketing.git
cd nexus-digital-marketing
```

2. Install dependencies:

```bash
npm install
```

3. Setup Firebase:

   - Create a Firebase project.
   - Enable Authentication (Email/Password).
   - Create Firestore database.
   - Replace `firebase.ts` configuration with your project keys.

4. Run the app:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Usage

- Register a new user account or log in.
- Navigate through the Home, About, Services, Projects pages.
- Click **Contact Us** to send a message.
- View messages in the profile popover.
- Toggle between Light and Dark mode.

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

**Email:** [hello@nexus.com](mailto:hello@nexus.com)
**Phone:** +1 (234) 567-890
**Address:** 123 Marketing St, Digital City

---

### Notes

- Aurora-style headings are implemented via `AuroraTextEffect` component.
- The Contact Page dynamically resizes the message textarea based on input and scrolls if content exceeds max height.
- Projects are displayed with hover animations and service badges for visual impact.

```

```
