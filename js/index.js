//Node for insertind todo`s
const taskList = document.querySelector('.main__task-list')
//All todo`s
let tasks = []
//Set theme from localStorage
SetThemeFromLocalStorage()
//Set todo`s from localStorage
GetFromLocalStorage()
//Couting left todo`s
CountNew(tasks)

//Add event handler to a clearCompleted button
const clearCompleted = document.querySelector('.main__clear-tasks')
clearCompleted.addEventListener('click', event => {
  tasks = tasks.filter(item => item.status == 'new')
  SetFilter(document.querySelector('.active'))
  AddToLocalStorage(tasks)
  RemoveRemainingFromLocalStorage(tasks)
})

//Add event handler to a filter buttons
let filterBtns = document.querySelectorAll('.main__filter-item')
for(let btn of filterBtns) {
  btn.addEventListener('click', event => {
    let elem = event.target
    for(let el of elem.parentNode.children) {
      el.classList.remove('active')
    }
    elem.classList.add('active')
    SetFilter(elem)
  })
}

//Add event handler to a swith theme button
const btn = document.querySelector('.header__swith-icon')
btn.addEventListener('click', event => {
  let elements = document.querySelectorAll('.dark')
  if(elements.length > 0){
    AddThemeClass(elements, 'light', 'dark')
  }
  else{
    elements = document.querySelectorAll('.light')
    AddThemeClass(elements, 'dark', 'light')
  }
})

//Add event handler to an add todo button
const addBtn = document.querySelector('.main__add-btn')
addBtn.addEventListener('click', event => {
  const input = document.querySelector('.main__input')
  if(input.value != ''){
    if(tasks.find(item => item.text == input.value) == undefined)
    {
      tasks.push(new Task(input.value))
      input.value = ''
      CreateTaskNode(tasks[tasks.length-1], taskList)
      SetFilter(document.querySelector('.active'))
      AddToLocalStorage(tasks)
    }
    else {
      input.value = ''
      alert('This todo already exist')
    }
  }
  else {
    alert('You need to input something')
  }
})

//Add event handler to swith todo in completed status
let taskCompleteIcons = document.querySelectorAll('.task__complete-icon')
taskCompleteIcons.forEach(item => {
  AddCompleteHandler(item)
})

//Add event handler to a remove todo buttons
let taskRemoveIcons = document.querySelectorAll('.task__remove-icon')
taskCompleteIcons.forEach(item => {
  AddRemoveHandler(item)
})

//Function for counting todo`s that is left to complete
function CountNew(tasks) {
  let itemsLeft = document.querySelector('.main__items-left')
  itemsLeft.innerText = tasks.filter(item => item.status == 'new').length + ' items left'
}

//Function for adding a remove handler to a node
function AddRemoveHandler(node) {
    node.addEventListener('click', event => {
      const index = tasks.findIndex(item => item.text == node.previousSibling.innerText)
      tasks.splice(index, 1)
      node.parentNode.remove()
      AddToLocalStorage(tasks)
      RemoveRemainingFromLocalStorage(tasks)
      CountNew(tasks)
  })
}

//Function for adding a complete handler to a node
function AddCompleteHandler(node) {
    node.addEventListener('click', event => {
      node.parentNode.classList.toggle('completed')
      let status = tasks.find(item => item.text === node.nextSibling.innerText).status
      tasks.find(item => item.text == node.nextSibling.innerText).status = status == 'new' ? 'completed' : 'new'
      SetFilter(document.querySelector('.active'))
      AddToLocalStorage(tasks)
      CountNew(tasks)
  })
}

//Function for setting a filter
function SetFilter(elem) {
  if(elem.innerText == 'Active')
    Filter(tasks.filter(item => item.status == 'new'), taskList)
  else if(elem.innerText == 'Completed')
    Filter(tasks.filter(item => item.status == 'completed'), taskList)
  else
    Filter(tasks, taskList)
}

//Function for filtering tasks
function Filter(taskList, insertNode) {
  insertNode.innerHTML = ''
  taskList.forEach(item => {
    CreateTaskNode(item, insertNode)
  })
}

//Function for creating a task node
function CreateTaskNode(task, node) {
  let taskNode = document.createElement('li')
  taskNode.className = 'task'
  if(task.status == 'completed')
    taskNode.classList.add('completed')
  let spanCircle = document.createElement('span')
  let spanText = document.createElement('span')
  let spanRemove = document.createElement('span')
  spanCircle.className = 'task__complete-icon circle'
  spanText.className = 'task__text'
  spanText.innerText = task.text
  spanRemove.className = 'task__remove-icon'
  taskNode.append(spanCircle)
  taskNode.append(spanText)
  taskNode.append(spanRemove)
  AddCompleteHandler(spanCircle)
  AddRemoveHandler(spanRemove)
  node.append(taskNode)
}

//Function for adding nodes to localStorage
function AddToLocalStorage(arr) {
  arr.forEach((item,i) => {
    localStorage.setItem(i, JSON.stringify(item))
  })
  localStorage.setItem('count', arr.length)
}

//Function for removing remainings nodes from localStorage
function RemoveRemainingFromLocalStorage(arr) {
  let i = arr.length
  while(localStorage.getItem(i) != undefined) {
    localStorage.removeItem(i)
    i++
  }
}

//Function for getting nodes from localStorage
function GetFromLocalStorage() {
  const count = parseInt(localStorage.getItem('count'))
  if(count>0){
    for(let i = 0; i<count; i++){
      let task = JSON.parse(localStorage.getItem(i))
      tasks.push(task)
      CreateTaskNode(task, taskList)
    }
  }
}

//Function for adding theme to localStorage
function AddThemeToLocalStorage(theme) {
  localStorage.setItem('theme', theme)
}

//Function for setting theme from localStorage
function SetThemeFromLocalStorage() {
  theme = localStorage.getItem('theme')
  if(theme!=undefined)
  {
    let elements = document.querySelectorAll('.dark')>0?document.querySelectorAll('.dark'):document.querySelectorAll('.light')
    if(theme == 'dark')
      AddThemeClass(elements, 'dark', 'light')
    else {
      AddThemeClass(elements, 'light', 'dark')
    }
    return true
  }
  return false
}

//Function for adding a theme class to a nodes
function AddThemeClass(elements, add, remove) {
  for(let el of elements){
    el.classList.remove(remove)
    el.classList.add(add)
    AddThemeToLocalStorage(add)
  }
}

//Class Task, to describe a todo
class Task {
  status = 'new'
  constructor(text) {
    this.text = text
  }
}
