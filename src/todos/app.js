import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderTodos, renderPending } from "./use-cases";


const ElementIDs = {
    ClearCompletedBotton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */


export const App = (elementId) => {

    const displayTodos = () => {
        const todos =  todoStore.getTodos( todoStore.getCurrentFilter() )
        renderTodos( ElementIDs.TodoList, todos )
        updatePendingCount()
    }
    
    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCountLabel)
    }

    // Cuando la función App() se llama
    (() => {
        const app = document.createElement('div')
        app.innerHTML = html
        document.querySelector(elementId).append( app )
        displayTodos()
    })() // esto es una función anónima autoejecutable


    // Refencias HTML
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput)
    const todoListUl = document.querySelector(ElementIDs.TodoList)
    const clearCompletedButton = document.querySelector(ElementIDs.ClearCompletedBotton)
    const filtersLIs = document.querySelectorAll(ElementIDs.TodoFilters)
    // const todoCount = document.querySelector(ElementIDs.TodoQuantity)
    

    // Listeners 
    newDescriptionInput.addEventListener( 'keyup', (e) => {
        if( e.keyCode !== 13 ) return;
        if( e.target.value.trim().length === 0 ) return;

        todoStore.addTodo( e.target.value )
        displayTodos()
        e.target.value = ''
    })

    todoListUl.addEventListener( 'click', (e) => {
        if (e.target.classList.contains('destroy')) return;
        const element = e.target.closest('[data-id]')

        todoStore.toggleTodo( element.getAttribute('data-id') )
        displayTodos()
    })

    todoListUl.addEventListener( 'click', (e) => {
        const isDestroyElement = e.target.className === 'destroy'
        const element = e.target.closest('[data-id]')
        if( !element || !isDestroyElement ) return;

        todoStore.deleteTodo( element.getAttribute('data-id') )
        
        displayTodos()
    })

    clearCompletedButton.addEventListener( 'click', (e) => {
        todoStore.deleteCompleted()
        displayTodos()
    })

    filtersLIs.forEach( filter => {
        
        filter.addEventListener('click', (element) => {
            filtersLIs.forEach( el => el.classList.remove('selected'))
            element.target.classList.add('selected')

            switch( element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                break;
                case 'Pendientes': 
                    todoStore.setFilter(Filters.Pending)
                break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                break;
                default:
                    throw new Error('Invalid filter')
            }
            displayTodos()
        })

    })

}