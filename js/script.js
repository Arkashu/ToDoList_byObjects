'use strict';

const toDoList = {
    selector: null,
    form: null,
    containerSelector: null,
    container: null,
    id: null,

    init (selector, container) {
    if (typeof selector === 'string' || selector.trim() !== '') {
        this.selector = selector
       }
    if (typeof container === 'string' || container.trim() !== '' ){
        this.containerSelector = container;
    }
    if (localStorage.getItem(this.selector) && JSON.parse(localStorage.getItem(this.selector)).length) {
        const data = JSON.parse(localStorage.getItem(this.selector))
        this.id = data[data.length -1].id;
    }
    this.getForm();
    this.getHtmlElement();
    this.deleteTodoItem();
    },
    getForm() {
        const formElement = document.querySelector(this.selector);
        this.form = formElement;
        formElement.addEventListener('submit', e => {
            e.preventDefault();
            e.stopPropagation();
            const data = {};
            formElement.querySelectorAll('input, textarea')
                .forEach(item => {
                    data[item.name] = item.value;
                });
            data.id = this.id += 1;
            const savedData =  this.saveData(data);
            this.renderItem (savedData);
        })
    },
    getHtmlElement () {
        this.container = document.querySelector(this.containerSelector);
        document.addEventListener('DOMContentLoaded', (event) => {
            event.preventDefault();
            const todo = JSON.parse(localStorage.getItem(this.selector));
            todo.map(todoItem => {
                this.renderItem(todoItem)
            })
        } )
    },
    saveData (data) {
        let dataFromStore = localStorage.getItem(this.selector);
        if (!dataFromStore) {
            const dataToSave = [];
            dataToSave.push(data);
            localStorage.setItem(this.selector, JSON.stringify(dataToSave))
        }
        if (dataFromStore) {
            dataFromStore = JSON.parse(dataFromStore);
            dataFromStore.push(data);
            localStorage.setItem(this.selector, JSON.stringify(dataFromStore));
        }
        return data;
    },
    renderItem (data) {
        const title = data.title;
        const description = data.description;
        const wrapper = document.createElement('div');
        wrapper.classList.add('col-4');
        wrapper.setAttribute('data-id', data.id);
        wrapper.innerHTML = ` <div class="taskWrapper">
                   <div class="taskHeading">${title}</div>
               <div class="taskDescription">${description}</div>
                    </div>`;
        this.container.prepend(wrapper);
    },
    deleteTodoItem () {
        document.querySelector(this.containerSelector).addEventListener('click', e => {
            e.stopPropagation();
            const currentItem = e.target.closest('[data-id]');
            const currentItemId = +currentItem.getAttribute('data-id');
            const allToDos = JSON.parse(localStorage.getItem(this.selector)).filter(item => item.id !== currentItemId);
            localStorage.setItem(this.selector, JSON.stringify(allToDos));
            currentItem.remove();
        })
    }
}
toDoList.init('#todoForm', '#todoItems');