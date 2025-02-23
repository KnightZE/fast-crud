# FsForm

> 配置化的表单组件
> 暴露的方法：
> ref.submit() = 提交表单
> ref.reset() = 重置表单

## Props

| Prop name    | Description                                                                                                                                       | Type   | Values | Default   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | --------- |
| initialForm  | 初始表单数据                                                                                                                                      | object | -      | {}        |
| columns      | 字段模版<br/>{<br/> key:{<br/> title: "字段名称",<br/> component:{<br/> name:"组件名称"<br/> ...组件参数<br/> }<br/> }<br/>}                      | object | -      | undefined |
| group        | 字段分组<br/>{<br/> type:'xxx', //分组展示类型<br/> groups:{ //分组数据<br/> groupKey:{ title:'xxx',columns:['fieldKey','fieldKey']}<br/> }<br/>} | object | -      | undefined |
| doReset      | 重置按钮方法                                                                                                                                      | func   | -      |           |
| doSubmit     | 点击保存按钮时执行方法                                                                                                                            | func   | -      | undefined |
| beforeSubmit | 表单提交前处理（async）                                                                                                                           | func   | -      | undefined |
| afterSubmit  | 表单提交后处理（async）                                                                                                                           | func   | -      | undefined |
| slots        | 插槽内容                                                                                                                                          | object | -      | {}        |
| display      | 布局方式【flex\|grid】                                                                                                                            | string | -      | "flex"    |
| index        | 序号，编辑时会传入                                                                                                                                | number | -      | undefined |
| mode         | 模式 [add,edit,view,自定义]                                                                                                                       | string | -      | undefined |
| row          | 行数据                                                                                                                                            | object | -      | undefined |
| col          | el-col\|a-col 配置，可配置跨列                                                                                                                    | object | -      | undefined |
| helper       | helper 位置：{position:'label'}                                                                                                                   | object | -      |           |

## Events

| Event name      | Properties | Description |
| --------------- | ---------- | ----------- |
| reset           |            |
| submit          |            |
| validationError |            |
| value-change    |            |

---
