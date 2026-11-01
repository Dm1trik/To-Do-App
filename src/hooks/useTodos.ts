import { useEffect, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage(Errors.None);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.Load));
  }, []);

  function startLoading(todoId: number) {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  }

  function stopLoading(todoId: number) {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  }

  function addTodo(title: string) {
    setErrorMessage(Errors.None);

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    return createTodo({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(err => {
        setErrorMessage(Errors.Add);
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function removeTodo(todoId: number) {
    setErrorMessage(Errors.None);
    startLoading(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(err => {
        setErrorMessage(Errors.Delete);
        throw err;
      })
      .finally(() => {
        stopLoading(todoId);
      });
  }

  function editTodo(todoToUpdate: Todo, changes: Partial<Todo>) {
    setErrorMessage(Errors.None);
    startLoading(todoToUpdate.id);

    return updateTodo({ ...todoToUpdate, ...changes })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(err => {
        setErrorMessage(Errors.Update);
        throw err;
      })
      .finally(() => {
        stopLoading(todoToUpdate.id);
      });
  }

  function toggleTodo(todo: Todo) {
    return editTodo(todo, { completed: !todo.completed });
  }

  function renameTodo(todo: Todo, newTitle: string) {
    return editTodo(todo, { title: newTitle });
  }

  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    return Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)));
  }

  return {
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
  };
}
