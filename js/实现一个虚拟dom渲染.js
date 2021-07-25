
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


  function render(domNode){
      if(!domNode) return null
      let node = document.createElement(domNode.tagName)
      if(domNode.props){
          for(let i in domNode.props){
              node.setAttribute(i,domNode.props[i])
          }
      }
      if(domNode.children){
         for(let i in domNode.children){
             if(typeof domNode.children[i] === 'object'){
                node.appendChild(render(domNode.children[i]))
             }else{
                node.appendChild(document.createTextNode(domNode.children[i]))
             }
         }
      }
      return node
      
  }