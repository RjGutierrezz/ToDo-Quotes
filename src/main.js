// TODO: 
//  Add the color theme changer button
//  Date the task was added needs to be displayed
//  DONE: Input is affecting the other grid



// generate a unique ID
function createUID() {
  return crypto.randomUUID();
}


// One task model
class Todo {
  // second param already has a value so an argument is no need
  constructor(text, completed=false, id = createUID()) {
    this.id = id;
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
	constructor(key = "todo-app-items") {
    this.key = key
  }

	// get is used to display information
  load(){
    const storage = localStorage.getItem(this.key);

    if (!storage) return [];

    try {
      return JSON.parse(storage);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

	// set is used to manipulate the information
  save(todos){
    return localStorage.setItem(this.key, JSON.stringify(todos))
  }
}


// UI + events + app state
class TodoApp {
  currentFilter = "all";

  constructor() {
    this.inputEl = document.getElementById("task-input");
    this.listEl = document.getElementById("list-container");
    this.todo = [];

    this.store = new TodoStore();
    
    this.inputCount = document.getElementById("number-task");

    this.allBtn = document.getElementById("allBtn");
    this.activeBtn = document.getElementById("activeBtn");
    this.completedBtn = document.getElementById("completedBtn")
    this.clearBtn = document.getElementById("clearBtn");

    this.dateEl = document.querySelector(".date");
    
    this.quoteContainer = document.querySelector(".quote");
    this.quotesApi = "https://quoteslate.vercel.app/api/quotes/random";
  }

  // method that gets called whenver the instance is called
  init(){
    // load raw data
    const raw = this.store.load();

    // convert raw objects into todo instances
    this.todo = raw.map(item => new Todo(item.text, item.completed, item.id));
    this.bindEvents();

    this.updateDateRender();
    setInterval(() => this.updateDateRender(), 1000);

    this.fetchQuote();
    setInterval(() => this.fetchQuote(), 15 * 16 * 1000);

    this.render();
  }

  // request the quote from the API
  async fetchQuote(){
    try {

      const response = await fetch(this.quotesApi)
      console.log("are you working api")
      const data = await response.json();
      
      this.quoteContainer.innerHTML = `<p>${data.quote} </p> <cite>~ ${data.author}</cite>`
      
      console.log(data);

    } catch (error) {
      console.log("could not connect with the Quote API right now");
    }
  }

  dateFormat(){
    const now = new Date();

    const datePart = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const timePart = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    return `${datePart} : ${timePart}`;
  }

  updateDateRender(){
    this.dateEl.textContent = this.dateFormat();
  }

  filterTask(){
    if (this.currentFilter === "all") {
      return this.todo;
    } else if (this.currentFilter === "active") {
      return this.todo.filter((item) => !item.completed);
    } else if (this.currentFilter === "completed") {
      return this.todo.filter((item) => item.completed);
    } else {
      return [];
    }
  }

  // method to add the is-active css once the button is selected
  activeButton() {
    this.allBtn.classList.remove("is-active");
    this.activeBtn.classList.remove("is-active");
    this.completedBtn.classList.remove("is-active");

    if(this.currentFilter === "all") {
      this.allBtn.classList.add("is-active");
    } else if (this.currentFilter === "active") {
      this.activeBtn.classList.add("is-active");
    } else if (this.currentFilter === "completed") {
      this.completedBtn.classList.add("is-active");
    }

  }


  updateCount(){
    const taskLeft = this.todo.filter((item) => !item.completed).length;

    // now modify the UI element
    let text;

    // want to make sure I dont forget how to use if/else statements
    if (taskLeft === 1 || taskLeft === 0) {
      text = taskLeft + " item left";
    } else {
      text = taskLeft + " items left";
    }

    this.inputCount.textContent = text;
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
      const actionButton = event.target.closest("[data-action]");
      
      if (!actionButton) return;
      const action = actionButton.dataset.action;

      if (action === "toggle") {
        // pulls the id from the li dataset 
        const id = li.dataset.id;
        this.toggleTodo(id);
      } else if (action === "delete") {
        const id = li.dataset.id;
        this.deleteTodo(id);
      } else {
        return
      }
    })

    // for all button to show all the task inside the array
    this.allBtn.addEventListener("click", () => {
      this.currentFilter = "all";
      this.render();
    })

    // for active button to show remaining task that aren't completed
    this.activeBtn.addEventListener("click", () => {
      this.currentFilter = "active";
      this.render();
    })

    // for completed button to show all the task that has been completed and
    // hasnt been deleted yet
    this.completedBtn.addEventListener("click", () => {
      this.currentFilter = "completed";
      this.render(); 
    })

    // for clear button to remove all the marked task from the array and
    // localStorage
    this.clearBtn.addEventListener("click", () => {
      this.todo = this.todo.filter((item) => !item.completed);

      this.store.save(this.todo);
      this.render();
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

    // to update the localStorage
    this.store.save(this.todo);

    // use this on method calls inside a method
    this.render();
  }


  toggleTodo(id){
    // to find the id from the array
    const target = this.todo.find((item) => item.id === id)
    
    if (!target) return;

    // marks it completed and vice versa
    target.toggle();

    // to update the localStorage
    this.store.save(this.todo);
    this.render();
  }


  deleteTodo(id){
    // filter() method returns items where the condition is true
    this.todo = this.todo.filter((item) => item.id !== id)

    // to update the localStorage
    this.store.save(this.todo);
    this.render();
  }

  // Update the DOM about the changes
  render(){
    // makes sure the list is empty for now
    this.listEl.innerHTML = "";
   
    // going to use filter method to allow the render to display which button
    // event was triggered
    const visibleTodos = this.filterTask();
    visibleTodos.forEach((todoTask) => {
      let li = this.createTodoElement(todoTask);
      this.listEl.appendChild(li);
    })

    this.updateCount();
    this.activeButton();
  }

  // render helper, to practice SOLID principle
  // this method will create the li element and the images that needed to come
  // along with it
  createTodoElement(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;

    // Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.dataset.action = "toggle"
    toggleBtn.className = "check-box"

    const imgToggle = document.createElement("img");
    imgToggle.src = todo.completed ? "/images/checked.png" :
      "/images/check_blanked.png";
    // imgToggle.className = "check-box"
    toggleBtn.append(imgToggle);

    const span = document.createElement("span")
    span.textContent = todo.text;

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.dataset.action = "delete";
    deleteBtn.className = "delete-box";

    const imgDelete = document.createElement("img");
    imgDelete.src = "/images/delete.png"
    // imgDelete.className = "delete-box"
    deleteBtn.append(imgDelete)

    li.append(toggleBtn, span, deleteBtn)

    if (todo.completed) {
      li.classList.add("checked")
    }

    return li;
  }
}

const app = new TodoApp();
app.init();

