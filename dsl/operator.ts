const findNode = function (children: any, id:any) {
    let currentNode;
    currentNode = children.find((item:any) => {
      return item.get("id") === id;
    });
    if (!currentNode) {
      children.some((el:any)=>{
        children = el.get('children');
        currentNode = findNode(children, id);
        return currentNode;
      })
    } 
    return currentNode;
  }
  const operator = {
    appendChild(dsl:any, id:any, node:any):void  {
      let children = dsl.get('children'), currentNode:any;
      currentNode = findNode(children, id);
      if (currentNode) {
        currentNode.appendChild(node);
      }
    }
  };
  export default operator;