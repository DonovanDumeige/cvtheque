import { Injectable, NotFoundException } from '@nestjs/common';
import { AddTodoDto } from './dto';
import { Todo } from './entities';

@Injectable()
export class TodoService {
    todos: Todo[] = [];
    getTodos(): Todo[] {
        return this.todos;
    }

    getTodoById(id: number): Todo {
        const todo = this.todos.find((actualTodo) => actualTodo.id === id);
        if (todo) return todo;
        throw new NotFoundException(`Le todo d'id ${id} n'existe pas.`);
    }

    addTodo(newTodo: AddTodoDto): Todo {
        const { name, description } = newTodo;
        let id: number;
        if (this.todos.length) {
            id = this.todos[this.todos.length - 1].id + 1;
        } else {
            id = 1;
        }

        const todo = {
            id,
            name,
            description,
            createdAt: new Date(),
        };
        this.todos.push(todo);
        return todo;
    }

    deleteTodo(id: number) {
        // Chercher l'ojet via son id dans le tableau des todos
        //+ ici transforme id en un entier
        const index = this.todos.findIndex((todo: Todo) => todo.id === id);
        // Utiliser la méthode slice pour supprimer le todo si il existe
        if (index >= 0) {
            this.todos.splice(index, 1);
            // Sinon je vais déclencher une erreur.
        } else {
            throw new NotFoundException(`Le todo d'id ${id} n'existe pas`);
        }
        return {
            message: `Le todo d'id ${id} a été supprimée avec succès`,
            count: 1,
        };
    }

    editTodo(id: number, newTodo: Partial<AddTodoDto>) {
        const todo = this.getTodoById(id);
        todo.description = newTodo.description
            ? newTodo.description
            : todo.description;
        todo.name = newTodo.name ? newTodo.name : todo.name;
        return todo;
    }
}
