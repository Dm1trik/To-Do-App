# ToDo App

A task manager built with React and TypeScript. It lets you add, edit, complete, filter and remove todos, and keeps them in sync with a REST API. The app shows loading states for every request and clear error messages when something goes wrong.

## Live Preview

[View the live demo](https://dm1trik.github.io/To-Do-App/)

## Technologies Used

- React 18
- TypeScript
- Vite
- SCSS (BEM naming, shared variables)
- Bulma (notifications, loader, base styles)
- classnames
- REST API (`fetch`)
- ESLint, Prettier and Stylelint for code quality

## Getting Started

1. Clone the repository:

```
git clone https://github.com/Dm1trik/To-Do-App.git
cd To-Do-App
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Run the project locally:

```
npm start
# or
yarn start
```

The app requests data from the API using the `USER_ID` constant from `src/api/todos.ts`.

## Features

- **Add a todo** with the title validation: an empty title shows an error.
- **Edit a title** by double-clicking it. Press `Enter` or click away to save, `Escape` to cancel. Saving an empty title deletes the todo.
- **Mark as completed** with a checkbox, or toggle all todos at once.
- **Filter** todos by status: All, Active, Completed.
- **Clear completed** todos with a single button.
- **Active items counter** in the footer.
- **Loading indicators** on each todo while a request is in progress, plus a temporary todo while a new one is being created.
- **Error notifications** for loading, adding, updating and deleting, which hide automatically after 3 seconds or can be closed manually.
- **Accessible controls**: icon-only buttons and inputs have `aria-label`s.
