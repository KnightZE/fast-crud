<template>
  <component
    :is="$fsui.treeSelect.name"
    :[$fsui.treeSelect.options]="computedOptions"
    :placeholder="computedPlaceholder"
  />
</template>
<script>
import { computed } from "vue";
import { useDict } from "../../use/use-dict";
import { useI18n } from "../../locale";

/**
 * 字典树选择组件
 * 支持 a-tree-select 参数
 */
export default {
  name: "FsDictTree",
  props: {
    /**
     * 数据字典
     */
    dict: {},
    /**
     * 可选项，比dict.data优先级高
     */
    options: { type: Array },
    /**
     * placeholder
     */
    placeholder: { type: String }
  },
  emits: ["dict-change"],
  // render () {
  //   return this.renderFunc({ data: this.data, dataMap: this.dataMap, scope: this.scope, attrs: this.$attrs })
  // },
  setup(props, ctx) {
    const { t } = useI18n();
    const computedPlaceholder = computed(() => {
      return props.placeholder || t("fs.component.select.placeholder");
    });

    return {
      computedPlaceholder,
      ...useDict(props, ctx)
    };
  }
};
</script>
