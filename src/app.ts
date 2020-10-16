
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
};

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
};

/// PROJECT TYPE

enum ProjectStatus { 
  Active, 
  Finished 
};

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) { }
}


///STATE
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

/// PROJECT STATE MANAGEMENT

class ProjectState extends State<Project>{
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }
  // Makes sure there is one and only one instance (a singleton!)
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      return this.instance = new ProjectState;
    }
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

//UTILITES
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


// PROJECT COMPONENT class name {

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId) as T;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {

    if (insertAtBeginning) {
      this.hostElement.insertAdjacentElement('afterbegin', this.element);
    } else {
      this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
  }

  abstract configure(): void
  abstract renderContent(): void

}

//PROJECT ITEM

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
  private curProject: Project;

  get persons(){
    if(this.curProject.people > 1){
      return 'people';
    } else {
      return 'person';
    }
  }

  constructor(hostId: string, curProject: Project) {
    super('single-project', hostId, false, curProject.id)
    this.curProject = curProject;

    this.configure();
    this.renderContent();
  }
  
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.curProject.title;
    this.element.querySelector('h3')!.textContent = 
      `${this.curProject.people.toString()} ${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.curProject.description;
  }
  configure() {    
  }
  

}


//PROJECT LIST

class ProjectList extends Component<HTMLDivElement, HTMLElement> {

  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        } else {
          return prj.status === ProjectStatus.Finished;
        }
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
      )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects){
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}

//PROJECT INPUT

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
  }

  configure() {
    // this.element.addEventListener('submit', this.submitHandler.bind(this))
    this.element.addEventListener('submit', this.submitHandler) //use autobind to accomplish binding this.
  };

  renderContent() { };

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
  };
}


const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
const prjInput = new ProjectInput();