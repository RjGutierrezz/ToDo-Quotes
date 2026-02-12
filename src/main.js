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


// local storage, read and write only, so the user can continue their work if
// they had to leave the app
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

  // method that gets called whenver the instance is called
  init(){
    this.bindEvents();
    this.render();
  }

  // this allows the user to enter the task via enter key
  bindEvents(){

    // listener for the enter key when inputting task
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.addTodo(this.inputEl.value);
        this.inputEl.value = "";
      }
    })

    // listener for completing a task
    // need to detect which item was clicked and call toggleTodo() with that
    // items id
    this.listEl.addEventListener("click", (event) => {
      const li = event.target.closest("li");
      if (!li) {
        return
      }

      // pulls the id from the li dataset 
      const id = li.dataset.id;
      this.toggleTodo(id);
    })

    // need to detect which item was clicked then call deleteTodo()

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


  toggleTodo(id){
    // to find the id from the array
    const target = this.todo.find((item) => item.id === id)
    
    if (!target) return;

    // marks it completed and vice versa
    target.toggle();
    this.render();
  }


  deleteTodo(id){
    const target = this.todo.find((item) => item.id === id)

    if (!target) return;
  }

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

