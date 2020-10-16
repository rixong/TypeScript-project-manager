


class Project {
  title: string;
  description: string;
  numPeople: number

  constructor(title: string, description: string, numPeople: number) {
    this.title = title;
    this.description = description;
    this.numPeople = numPeople;
  }
}

class ProjectState {

  private projects: any[] = [];
  private static instance: ProjectState;

  constructor() {

  }
// Makes sure there is one and only one instance (a singleton!)
  static getInstance() {   
    if(this.instance){
      return this.instance;
    } else {
      return this.instance = new ProjectState;
    }
  }

  addProject(title: string, description: string, people: number) {
    const newProject = {
      id: Math.random().toString,
      title,
      description,
      people
    };
    this.projects.push(newProject);
  }
}

const projectState = ProjectState.getInstance();


interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validateableInput: Validatable) {
  let isValid = true;
  if (validateableInput.required) {
    isValid =
      isValid && validateableInput.value.toString().trim().length !== 0;
  }
  if
    (
    validateableInput.minLength != null && typeof validateableInput.value === 'string'
  ) {
    isValid =
      isValid && validateableInput.value.length > validateableInput.minLength;
  }
  if
    (
    validateableInput.maxLength != null && typeof validateableInput.value === 'string'
  ) {
    isValid =
      isValid && validateableInput.value.length <= validateableInput.maxLength;
  }
  if (validateableInput.min != null && typeof validateableInput.value === 'number') {
    isValid =
      isValid && validateableInput.value >= validateableInput.min;
  }
  if (validateableInput.max != null && typeof validateableInput.value === 'number') {
    isValid =
      isValid && validateableInput.value <= validateableInput.max;
  }
  return isValid;
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const modifiedMethod = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn
    }
  };
  return modifiedMethod;
}


//PROJECT LIST

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;  //gets the template
    this.hostElement = document.getElementById('app')! as HTMLDivElement; //gets the app container
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();

  }

  private renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

//PROJECT INPUT

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;  //gets the template
    this.hostElement = document.getElementById('app')! as HTMLDivElement; //gets the app container

    const importedNode = document.importNode(this.templateElement.content, true); //clones the template
    this.element = importedNode.firstElementChild as HTMLFormElement; //strips the form from template clone
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input')
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    // this.element.addEventListener('submit', this.submitHandler.bind(this))
    this.element.addEventListener('submit', this.submitHandler) //use autobind to accomplish binding this.
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);  //add the html to app container
  }
}


const prjInput = new ProjectInput();
const finishedPrjList = new ProjectList('finished');
const activePrjList = new ProjectList('active');