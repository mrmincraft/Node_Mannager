export class Node {
  constructor(name = "", status = "offline", type = "sensor", description = "") {
    this.name = name;
    this.status = status;
    this.type = type;
    this.description = description;
  }
}