
import { Panel, Text } from "@repcomm/exponent-ts";
import { WorldEntity } from "../entities/worldentity";

export class SceneNode extends Panel {
  label: Text;
  componentsLabel: Text;

  constructor () {
    super();
    this.addClasses("scenegraph-node");
    this.label = new Text().addClasses("scenegraph-node-label").mount(this);
    this.componentsLabel = new Text().addClasses("scenegraph-node-components").mount(this);
  }
  setFromNode (e: WorldEntity, depth: number): this {
    this.label.setTextContent(e.label||"[No Label]");
    this.setStyleItem("text-indent", `${depth}em`);
    
    let cns = "Components: ";
    for (let c of e.components) {
      cns += ` ${c.constructor.name}`;
    }
    this.componentsLabel.setTextContent(cns);
    return this;
  }
}

export class SceneGraph extends Panel {
  private rootNode: WorldEntity;
  nodes: Set<SceneNode>;
  unusedNodes: Set<SceneNode>;

  constructor () {
    super();
    this.addClasses("scenegraph");
    this.nodes = new Set();
    this.unusedNodes = new Set();
  }
  clear () {
    for (let node of this.nodes) {
      this.setNodeActive(node, false);
    }
  }
  setNodeActive (node: SceneNode, active: boolean = true): this {
    if (active) {
      this.nodes.add(node);
      this.unusedNodes.delete(node);
      node.mount(this);
    } else {
      node.unmount();
      this.nodes.delete(node);
      this.unusedNodes.add(node);
    }
    return this;
  }
  getUnusedNode (): SceneNode {
    let result: SceneNode;
    for (let node of this.unusedNodes) {
      result = node;
      break;
    }
    if (!result) result = new SceneNode();
    return result;
  }
  update () {
    this.clear();
    if (!this.rootNode) return;
    this.rootNode.traverse((child, depth)=>{
      let node = this.getUnusedNode();
      node.setFromNode(child, depth);
      this.setNodeActive(node, true);
    });
  }
  setRootNode (e: WorldEntity): this {
    this.rootNode = e;
    this.update();
    return this;
  }
}
