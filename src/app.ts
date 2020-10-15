console.log('Server started');

/* Project has:
title,
description,
number of people
*/

const projects: Project[] = [];

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor){
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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor(){
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
  
  @Autobind
  private submitHandler(event: Event){
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }
  private configure(){
    // this.element.addEventListener('submit', this.submitHandler.bind(this))
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach (){
    this.hostElement.insertAdjacentElement('afterbegin',this.element);  //add the html to app container
  }
}



class Project {
  title: string; 
  description: string; 
  numPeople: number

  constructor(title: string, description: string, numPeople: number){
    this.title = title;
    this.description = description;
    this.numPeople = numPeople;
  }
}

const prjInput = new ProjectInput();

// const fence = new Project('Repair Fence', 'Build a new back fence', 2);
// console.log(fence.title);