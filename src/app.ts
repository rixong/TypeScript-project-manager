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
  constructor(){
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
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

const fence = new Project('Repair Fence', 'Build a new back fence', 2);

console.log(fence.title);


// const temp = document.getElementById('project-input');
// console.log(temp);
// const clon = temp.content.cloneNode(true);
// document.body.appendChild(clon);