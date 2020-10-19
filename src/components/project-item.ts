
//PROJECT ITEM

import { Draggable } from "../models/drag-drop-interfaces";
import { Component } from "./base-components";
import { Autobind } from "../decorators/autobind-decorator";
import { Project } from "../models/project-model";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private curProject: Project;

  get persons() {
    if (this.curProject.people > 1) {
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

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.curProject.id);
    event.dataTransfer!.effectAllowed = 'move';
  };

  dragEndHandler(_: DragEvent) {
  };

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.curProject.title;
    this.element.querySelector('h3')!.textContent =
      `${this.curProject.people.toString()} ${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.curProject.description;
  }
}