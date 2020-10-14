console.log('Server started');

/* Project has:
title,
description,
number of people
*/

const projects = {};

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor(){
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.attach()
  }

  private attach (){
    this.hostElement.insertAdjacentElement('afterbegin',this.element);
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

const project = new ProjectInput();
project.renderForm();

// const fence = new Project('Repair Fence', 'Build a new back fence', 2);
// console.log(fence.title);