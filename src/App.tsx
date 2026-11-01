import React, { useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { NewTodo } from './Components/NewTodo';
import { TodoList } from './Components/TodoList';
import { ErrorNotification } from './Components/ErrorNotification';
import { Footer } from './Components/Footer/Footer';
import { useTodos } from './hooks/useTodos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

function getFilteredTodos(todos: Todo[], selectedStatus: Filters) {
  return todos.filter(todo => {
    switch (selectedStatus) {
      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;

      case Filters.All:
      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const {
    todos,
    tempTodo,
    loadingTodoIds,
    errorMessage,
    setErrorMessage,
    addTodo,
    removeTodo,
    toggleTodo,
    renameTodo,
    clearCompleted,
  } = useTodos();

  const [selectedStatus, setSelectedStatus] = useState(Filters.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, selectedStatus);
  }, [todos, selectedStatus]);

  function handleDelete(todoId: number) {
    return removeTodo(todoId).finally(() => inputRef.current?.focus());
  }

  function handleClearCompleted() {
    clearCompleted().finally(() => inputRef.current?.focus());
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todos={todos}
          onAdd={addTodo}
          onErrorMessage={setErrorMessage}
          inputRef={inputRef}
          onToggle={toggleTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDelete}
            onToggle={toggleTodo}
            onRename={renameTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedStatus={selectedStatus}
            onSelectedStatus={setSelectedStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
