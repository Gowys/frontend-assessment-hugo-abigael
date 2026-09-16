# BIA Energi - Junior Frontend Technical Assessment

Submission for the Junior Frontend Developer take-home assessment.

The repository contains two deliverables:

1. `logic-assessment.js` - vanilla JavaScript logic and data-manipulation exercises.
2. A React product dashboard with search/filtering, reusable create/edit form validation, CRUD flows, loading/error feedback, and optimistic updates.

## 1. Setup

Requirements:

- Node.js 18+
- npm

Install and run:

```bash
npm install
cp .env.example .env
npm run dev
```

Then open the local URL printed by Vite.

Before running the app, set `VITE_API_URL` in `.env` to the live my-json-server products endpoint:

```env
VITE_API_URL=https://my-json-server.typicode.com/<github-username>/<repo-name>/products
```

## 2. Live mock API

Repository `db.json` contains the seeded product data required by the assessment.

Live endpoint after this repository is public on GitHub:

```text
https://my-json-server.typicode.com/<github-username>/<repo-name>/products
```

> Before submitting, replace the placeholders above with the real GitHub username and repository name.

## 3. Architecture overview

```text
.
├── db.json
├── logic-assessment.js
├── src
│   ├── components
│   │   ├── Modal.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductTable.jsx
│   │   └── Toast.jsx
│   ├── services
│   │   └── productsApi.js
│   ├── App.jsx
│   ├── constants.js
│   ├── main.jsx
│   └── styles.css
└── README.md
```

`App.jsx` owns the product collection and UI state. API calls are isolated in `src/services/productsApi.js`. The create and edit flows share the same `ProductForm` component, while modal, detail, table, and toast concerns are kept in small UI components.

I intentionally kept state management inside React (`useState`, `useMemo`) instead of adding a global state library because the application is small and the shared state is limited.

## 4. Decisions and trade-offs

### Logic exercise

`countCharacterFrequency` normalizes letters to lowercase and ignores characters that are not A-Z letters.

`processUserData` skips malformed records where `age` is not numeric or `gender` is missing. Gender values are trimmed and normalized to lowercase before grouping. The original input array/objects are not mutated.

### Form validation

The create/edit form is a single reusable controlled component. Validation is calculated from current values, while a small `touched` state controls when field-level messages are shown. Submit stays disabled until the form is valid or while a request is running.

### Optimistic updates

Create, edit, and delete update local React state immediately. A snapshot of the previous product list is kept before the request. If the request fails, the previous state is restored and an error toast is shown.

This makes the interface feel responsive and also matches the assessment note that my-json-server write behavior may be temporary/reset.

### Error and loading states

The initial fetch shows skeleton rows. Network failures are shown as a non-blocking toast. Initial-load errors provide a retry action through the notification/refresh controls.

### Styling

The UI uses plain CSS rather than a component library or Tailwind. This keeps the implementation small and makes the layout/states easy to inspect during review.

## 5. What I would improve with more time

- Add unit tests for the two logic functions and form validation.
- Add React component/integration tests for the CRUD flows.
- Add pagination for larger product catalogs.
- Add stronger accessibility behavior such as focus trapping/restoration in modals.
- Add request cancellation/debouncing for larger or server-side searches.
- Add a production deployment (for example Vercel/Netlify) for easier review.

## 6. Logic exercise quick examples

```js
import { countCharacterFrequency, processUserData } from './logic-assessment.js';

console.log(countCharacterFrequency('Hello, World!'));
// { h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1 }

console.log(processUserData([
  { id: 1, name: 'A', age: 25, gender: 'male' },
  { id: 2, name: 'B', age: 30, gender: 'female' },
  { id: 3, name: 'C', age: 17, gender: 'male' },
]));
```
