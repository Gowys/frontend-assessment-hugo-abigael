# BIA Energi - Junior Frontend Technical Assessment

Submission for the Junior Frontend Developer technical assessment.

This repository contains two main parts:

1. `logic-assessment.js` - vanilla JavaScript exercises for character frequency counting and user data aggregation.
2. A React product dashboard for displaying, searching, filtering, creating, viewing, editing, and deleting products using a mock REST API.

The application also includes form validation, loading states, error notifications, and optimistic UI updates.

---

## 1. Features

The React application includes:

- Product table with name, category, price, status, and created date.
- Indonesian Rupiah price formatting.
- Product name search.
- Category filter.
- Status filter.
- Product detail modal.
- Reusable form for creating and editing products.
- Field-level form validation.
- Create, edit, and delete actions using the mock REST API.
- Delete confirmation.
- Loading skeleton while product data is being fetched.
- Error toast with retry support when a request fails.
- Optimistic updates with rollback when create, edit, or delete requests fail.
- Responsive layout for smaller screens.

---

## 2. Setup

### Requirements

- Node.js 22.x recommended
- npm

The project was tested using:

```text
Node.js v22.22.0
````

### Install dependencies

```bash
npm install
```

### Create the environment file

Create a `.env` file based on `.env.example`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

The environment variable should contain:

```env
VITE_API_URL=https://my-json-server.typicode.com/Gowys/frontend-assessment-hugo-abigael/products
```

### Run the development server

```bash
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173/
```

### Production build

```bash
npm run build
```

---

## 3. Live Mock API

The product data is seeded from the `db.json` file in this repository.

Live mock API endpoint:

```text
https://my-json-server.typicode.com/Gowys/frontend-assessment-hugo-abigael/products
```

The seeded data contains four products used as the initial state of the dashboard.

### Mock API Behavior

`my-json-server` is used as the mock backend for this assessment.

Write operations do not update the `db.json` file in the GitHub repository. Because of this, product changes made through create, edit, or delete can return to the original seeded data after the page is refreshed.

The application handles this behavior using optimistic UI updates:

1. The local product state is updated immediately.
2. The API request is sent.
3. If the request succeeds, the updated local state is kept for the current session.
4. If the request fails, the previous product state is restored and an error notification is shown.

During testing, a newly created mock product could return a successful `POST` response but might not be available for a later `PATCH` or `DELETE` request.

The rollback behavior handles this case without leaving the UI in an incorrect state.

---

## 4. Project Structure

```text
.
├── .env.example
├── db.json
├── index.html
├── logic-assessment.js
├── package.json
├── package-lock.json
├── vite.config.js
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

### Main Responsibilities

`App.jsx`

* Holds the main product and UI state.
* Handles search and filters.
* Handles create, edit, and delete flows.
* Handles optimistic updates and rollback.
* Controls modal and toast states.

`src/services/productsApi.js`

* Contains the API requests for:

  * fetching products
  * creating products
  * updating products
  * deleting products

`ProductForm.jsx`

* Shared form for both create and edit.
* Handles controlled inputs and field-level validation.

`ProductTable.jsx`

* Displays the product list.
* Formats product prices and dates.
* Provides View, Edit, and Delete actions.

`Modal.jsx`

* Reusable modal wrapper used by the product forms, product details, and delete confirmation.

`Toast.jsx`

* Displays success and error notifications.

---

## 5. Decisions and Trade-offs

### React State Management

The application uses React state with `useState` and `useMemo`.

I did not add a global state library because the application is relatively small and most of the state is managed inside the main product dashboard.

This keeps the project easier to follow without adding unnecessary dependencies.

### Reusable Product Form

Create and edit use the same `ProductForm` component because both actions use the same fields and validation rules.

The difference between the two modes is mainly:

* initial field values
* button label
* action performed after submission

### Form Validation

The form validates:

* Name is required and cannot contain only spaces.
* Category must be selected.
* Price must be numeric and greater than `0`.
* Status must contain a supported value.

Field-level error messages are shown while the user interacts with the form.

The submit button remains disabled when the form is invalid or while a request is being processed.

### Optimistic Updates

Create, edit, and delete update the local product state before waiting for the API response.

Before each operation, the current product list is saved.

If the request fails:

* the previous state is restored
* an error notification is shown

This was useful for handling the temporary behavior of the mock API while keeping the interface responsive.

### Loading and Error Handling

The initial product request displays loading skeleton rows.

If a network request fails, the application shows a non-blocking error toast.

For product loading errors, the user can retry the request using the retry or refresh action.

### Styling

The application uses plain CSS without an additional UI framework.

I chose this approach because the interface is relatively small and it keeps the styling dependencies simple.

---

## 6. Logic Assessment

The file `logic-assessment.js` contains two exported functions.

### `countCharacterFrequency(text)`

Counts how many times each letter appears in a string.

The function:

* converts letters to lowercase
* ignores spaces
* ignores punctuation
* ignores numbers

Example:

```js
countCharacterFrequency('Hello, World!');
```

Result:

```js
{
  h: 1,
  e: 1,
  l: 3,
  o: 2,
  w: 1,
  r: 1,
  d: 1
}
```

### `processUserData(users)`

Processes an array of users by:

1. Filtering out users younger than 18.
2. Grouping the remaining users by gender.
3. Calculating the number of users in each group.
4. Calculating the average age for each group.
5. Returning the users that belong to each group.

The function also handles cases where:

* the input array is empty
* age is missing or invalid
* gender is missing

The input data is not mutated.

Example:

```js
processUserData([
  { id: 1, name: 'A', age: 25, gender: 'male' },
  { id: 2, name: 'B', age: 30, gender: 'female' },
  { id: 3, name: 'C', age: 17, gender: 'male' }
]);
```

The user with age `17` is excluded from the result.

---

## 7. Testing Performed

The application was manually tested for the following flows:

* Initial product loading.
* Product search.
* Category filtering.
* Status filtering.
* Combined category and status filtering.
* Product detail view.
* Create form validation.
* Edit form validation.
* Create product request.
* Edit seeded product request.
* Delete seeded product request.
* Loading state using network throttling.
* Network failure handling.
* Retry after a network failure.
* Optimistic update rollback after a failed request.
* Disabled submission state while a request is in progress.

The JavaScript logic functions were also tested manually using Node.js.

---

## 8. What I Would Improve With More Time

With more time, I would improve the project by:

* Adding unit tests for the JavaScript logic functions.
* Adding automated tests for form validation and CRUD flows.
* Adding pagination for a larger product catalog.
* Improving keyboard and focus handling inside modals.
* Adding a deployed version of the application for easier review.

---

## 9. Notes

The application follows the requirements of the assessment while keeping the implementation relatively simple.

The main focus was on:

* readable component structure
* predictable state handling
* reusable form behavior
* validation
* API integration
* user feedback for loading and error states
* handling mock API limitations safely

