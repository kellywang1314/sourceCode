https://bytedance.larkoffice.com/docx/YJkFdkcAKoDBoRxnhXdcTUwpncg

1. 会员 B 端中后台系统的核心特点是表单多、逻辑复杂、变化快。为了应对这一挑战，我们引入了一套基于 Formily V2 的 DSL 驱动方案，旨在将前端 UI 表现、表单校验逻辑与业务数据流彻底解耦，实现高效的页面配置与迭代。

2. 整个体系由 BFF 层、前端应用层 和 前端基建层 协同工作。数据流清晰地展示了各层的职责边界：
- BFF ：作为数据聚合与下发的“指挥中心”。它从 TCC 配置中心拉取静态的 DSL 模板，并调用下游服务（如商品、营销）获取动态的业务规则（例如，不同等级商家的会员卡价格区间、可选周期等），将这些动态数据，通过aop的方式注入DSL的scope字段，通过统一接口下发给前端。
- 前端应用 ：作为 DSL 的最终“消费者”。页面中的 BrickRender 核心渲染器接收来自 BFF 的 DSL Schema，并借助 Formily 引擎强大的状态管理与渲染能力，将这份纯 JSON 配置动态渲染成用户可见、可交互的表单界面。用户的输入、点击等行为均由 Formily 捕获并驱动后续的联动与校验。
- 前端基建：提供可复用的“弹药库”。它包含了构成表单的原子组件（Bricks）、可被 DSL 声明式引用的自定义校验器（Validator），以及 DSL 的类型定义（Bricks DSL），为上层应用提供稳定、统一的底层能力。

3. DSL本质上是一份遵循Formily Schema 协议的 JSON。通过精心设计的关键字，产品和研发可以“声明式”地描述一个表单的几乎全部细节。
通过这套 DSL，我们可以轻松配置出一个字段的 UI 部件、装饰器、联动逻辑和校验规则，而无需编写一行命令式的 JavaScript 代码。

4. 表单联动
直接看formily的表单联动是怎么做的就可以


5. 表单校验
 - 提供一个基础bricks-validator，提供一些基础的校验的函数
 - 业务仓库通过@formily/validator提供的ValidatorFunction自定义业务校验器，比如：ValidatorFunction<number> = (value: number, rule: IValidatorRules) => {}, 其中的rule是配置中通过x-validator传递的一些动态/静态参数
 - 业务自定义多个业务校验器（如上：ValidatorFunction），通过validatorsMap提供给BricksRender， BricksRender内部通过调用@formily/core提供的registerValidateRules，完成注册自定义的校验器，比如下边例子里面的priceRule。
 - 提交阶段调用表单实例：formRef.current.validate()来判断各个表单项是否通过校验。
{
  "price": {
    "type": "number",
    "x-decorator": "FormContainer",
    "x-component": "InputNumber",
    "x-validator": [
      { "required": true, "message": "请输入售价" },
      { 
        "priceRule": true,
        "range": ["{{scope.priceRange[0]}}", "{{scope.priceRange[1]}}"],
        "rangePriceMessage": "价格需在 {{scope.priceRange[0] / 100}} - {{scope.priceRange[1] / 100}} 元之间"
      }
    ]
  }
}