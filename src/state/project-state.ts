namespace App {

  //STATE
  type Listener<T> = (items: T[]) => void;
  
  class State<T> {
    protected listeners: Listener<T>[] = [];
  
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn)
    }
  }

  // PROJECT STATE MANAGEMENT
  
  export class ProjectState extends State<Project>{
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
      this.updateListeners();
    }
  
    moveProject(projectId: string, newStatus: ProjectStatus){
      const movedPrj = this.projects.find(prj => prj.id === projectId);
      if (movedPrj && movedPrj.status !== newStatus){
        movedPrj.status = newStatus;
        this.updateListeners();
      }
    }
  
    private updateListeners(){
      for(const listenerFn of this.listeners){
        listenerFn(this.projects.slice());
      }
    }
  
  }
  
  export const projectState = ProjectState.getInstance();


}