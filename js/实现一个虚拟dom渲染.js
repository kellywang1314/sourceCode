let domNode = {
    tagName: 'ul',
    props: { class: 'list' },
    children: [{
      tagName: 'li',
      children: ['item1']
    }, {
      tagName: 'li',
      children: ['item1']
    }]
  };
  
  // 构建一个 render 函数，将 domNode 对象渲染为 以下 dom
  <ul class="list">
      <li>item1</li>
      <li>item2</li>
  </ul>
  

  function render(domNode) {
      if(!domNode) return document.createDocumentFragment()
      let $el
      if(typeof domNode === 'object'){
          $el = document.createElement(domNode.tagName)
          if(domNode.props){
              for(let i in domNode.props){
                  $el.setAttribute(i,domNode.props[i])
              }
          }
          if(domNode.children.length){
              for(let i in domNode.children){
                  let temp = render(domNode.children[i])
                  $el.appendChild(temp)
              }
          }
      }else{
        $el = document.createTextNode(domNode)
      }
      return $el
  }

  function render(obj){
      let domOut = document.createElement(obj.tagName)
      let {props,children} = obj
      if(props){
          for(let i in props){
              domOut.setAttribute(i,props[i])
          }
      }
      if(children){
          for(let i in children){
             let child 
             child = typeof children[i] === 'object' 
             ? render(children[i]) 
             : document.createTextNode(children[i])
             domOut.appendChild(child)
          }
      }
      return domOut
  }