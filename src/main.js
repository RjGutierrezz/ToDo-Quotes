// TODO: 
//  Add the color theme changer button
//  Date the task was added needs to be displayed
//  Input is affecting the other grid



// generate a unique ID
function createUID() {
  return crypto.randomUUID();
}


// One task model
class Todo {
  // second param already has a value so an argument is no need
  constructor(text, completed=false) {
    this.id = createUID();
    this.text = text;
    this.completed = completed;
  }

  // method to flip if the task is completed or not
  toggle() {
    this.completed = !this.completed;
  }
}

// local storage, read and write only
class TodoStore {
	constructor() {}

	// get is used to display information
  load(){}

	// set is used to manipulate the information
  save(){}
}



// UI + events + app state
class TodoApp {
  constructor() {
    this.inputEl = document.getElementById("task-input");
    this.listEl = document.getElementById("list-container");
    this.todo = [];
  }

  // methods
  init(){
    this.bindEvents();
    this.render();
  }

  // this allows the user to enter the task via enter key
  bindEvents(){
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.addTodo(this.inputEl.value);
        this.inputEl.value = "";
      }
    })
  }

  // Adding an item to the array works
  addTodo(text){
    // trim takes off the extra space from the beginning and the end text
    let value = text.trim()
    if(!value) return;

    const input = new Todo(value);
    this.todo.push(input) // pushing input into the todo array
    console.log(this.todo);

    // use this on method calls inside a method
    this.render();
  }


  toggleTodo(id){}
  deleteTodo(id){}

  // Update the DOM about the changes
  render(){
    // makes sure the list is empty for now
    this.listEl.innerHTML = "";
    
    this.todo.forEach((todoTask) => {
      let li = this.createTodoElement(todoTask);
      this.listEl.appendChild(li);
    })
  }

  // render helper, to practice SOLID principle
  createTodoElement(todo) {
    const li = document.createElement("li");
    li.textContent = todo.text;
    li.dataset.id = todo.id;

    if (todo.completed) {
      // add the line-through
      li.classList.add("checked")
    }
    return li;
  }
}

const app = new TodoApp();
app.init();

