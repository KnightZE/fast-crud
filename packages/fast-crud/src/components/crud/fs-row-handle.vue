<template>
  <div class="fs-row-handle">
    <slot name="cell-rowHandle-left" v-bind="scope"></slot>
    <template v-for="(item, index) in computedHandleBtns" :key="index">
      <fs-button
        v-if="item.show !== false && !isDropdownBtn(item, index)"
        class="row-handle-btn"
        v-bind="item"
        @click.stop="doClick(item)"
      />
    </template>
    <slot name="cell-rowHandle-middle" v-bind="scope"></slot>
    <!-- 下拉按钮菜单 -->
    <span v-if="hasDropdownBtn" class="row-handle-btn fs-handle-row-dropdown">
      <component :is="$fsui.dropdown.name" v-bind="computedDropdownBinding">
        <fs-button v-bind="dropdown.more" />
        <template #[$fsui.dropdown.slotName]>
          <component
            :is="$fsui.dropdownMenu.name"
            v-if="$fsui.dropdown.renderMode === 'slot'"
            v-bind="$fsui.dropdownMenu.command(doDropdownItemClick)"
          >
            <template v-for="(item, index) in computedHandleBtns" :key="index">
              <component
                :is="$fsui.dropdownItem.name"
                v-if="item.show !== false && isDropdownBtn(item, index)"
                :[$fsui.dropdownItem.command]="item.key"
              >
                <div class="fs-row-handle-dropdown-item" v-bind="item">
                  <fs-icon v-if="item.icon" :icon="item.icon" /> {{ item.text || item.title }}
                </div>
              </component>
            </template>
          </component>
        </template>
      </component>
    </span>
    <slot name="cell-rowHandle-right" v-bind="scope"></slot>
  </div>
</template>
<script>
import { computed, defineComponent } from "vue";
import _ from "lodash-es";
import traceUtil from "../../utils/util.trace";
import { useI18n } from "../../locale";
import { useUi } from "../../use/use-ui";
import { useCompute } from "../../use/use-compute";
import { Constants } from "../../utils/util.constants";

/**
 * 操作列配置
 */
export default defineComponent({
  name: "FsRowHandle",
  props: {
    /**
     * 按钮折叠配置
     */
    dropdown: {
      type: Object
    },
    /**
     * 按钮配置
     * {
     *   view:{...FsButton,click:Function,order:1},
     *   edit:{...FsButton,click:Function,order:2},
     *   remove:{...FsButton,click:Function,order:3},
     *   ...自定义
     * }
     */
    buttons: {
      type: Object
    },
    /**
     * 按钮分组,上面的buttons为默认分组
     *  {
     *    groupKey:{buttonKey:{},buttonKey2:{}}
     *  }
     */
    group: {
      type: Object
    },
    /**
     * 当前激活分组
     */
    active: {
      type: String,
      default: "default"
    },
    /**
     * scope
     */
    scope: {}
  },
  emits: ["handle"],
  setup(props, ctx) {
    const { ui } = useUi();

    traceUtil.trace("fs-row-handler");
    const { t } = useI18n();
    const doClick = (item) => {
      const index = props.scope[ui.tableColumn.index];
      const row = props.scope[ui.tableColumn.row];
      const e = { key: item.key, row, btn: item, index, ...props.scope };
      if (item.click) {
        return item.click(e);
      }
      ctx.emit("handle", e);
    };
    const { doComputed } = useCompute();
    const pickedProps = computed(() => {
      return {
        dropdown: props.dropdown,
        buttons: props.buttons,
        active: props.active,
        group: props.group
      };
    });
    const computeProps = doComputed(pickedProps, () => {
      const index = props.scope[ui.tableColumn.index];
      const row = props.scope[ui.tableColumn.row];
      return { ...props.scope, index, row };
    });

    //const computeProps = { value: props };
    const computedHandleBtns = computed(() => {
      let mergedBtns = null;
      if (computeProps.value.active == null || computeProps.value.active === "default") {
        const defBtns = {
          view: {
            key: "view",
            text: t("fs.rowHandle.view.text"),
            title: t("fs.rowHandle.view.text")
          },
          edit: {
            key: "edit",
            type: "primary",
            text: t("fs.rowHandle.edit.text"),
            title: t("fs.rowHandle.edit.text")
          },
          remove: {
            key: "remove",
            ...ui.button.colors("danger"),
            text: t("fs.rowHandle.remove.text"),
            title: t("fs.rowHandle.remove.text")
          }
        };
        mergedBtns = _.merge(defBtns, computeProps.value.buttons);
      } else {
        mergedBtns = computeProps.value.group[computeProps.value.active];
      }

      const btns = [];
      _.forEach(mergedBtns, (item, key) => {
        item.key = key;
        if (item.show === false) {
          return;
        }
        btns.push(item);
      });

      return _.sortBy(btns, (item) => {
        return item.order ?? Constants.orderDefault;
      });
    });

    const computedDropdownAtLeast = computed(() => {
      if (
        computeProps.value.dropdown == null ||
        computeProps.value.dropdown.atLeast == null ||
        computeProps.value.dropdown.atLeast <= 0 ||
        computedHandleBtns.value.length <= computeProps.value.dropdown.atLeast
      ) {
        return 0;
      }
      return computeProps.value.dropdown.atLeast || 0;
    });
    function isDropdownBtn(item, index) {
      if (item.dropdown === true) {
        return true;
      }
      if (computedDropdownAtLeast.value > 0 && computedDropdownAtLeast.value < index) {
        return true;
      }
      return false;
    }
    const hasDropdownBtn = computed(() => {
      let index = 0;
      for (const item of computedHandleBtns.value) {
        const is = isDropdownBtn(item, index);
        if (is) {
          return true;
        }
        index++;
      }
      return false;
    });

    function doDropdownItemClick($event) {
      for (let btn of computedHandleBtns.value) {
        if ($event === btn.key) {
          doClick(btn);
          return;
        }
      }
    }

    const computedDropdownBinding = computed(() => {
      const options = {};
      if (ui.dropdown.renderMode !== "slot") {
        // naive 通过options配置来显示子项
        const btns = computedHandleBtns.value;
        const opts = [];
        _.forEach(btns, (value, index) => {
          if (value.show !== false && isDropdownBtn(value, index)) {
            opts.push({
              [ui.dropdown.value]: value.key,
              [ui.dropdown.label]: value.text,
              title: value.title
            });
          }
        });
        options.options = opts;
      }
      return {
        ..._.omit(props.dropdown, "more", "atLeast"),
        ...ui.dropdown.command(doDropdownItemClick),
        ...options
      };
    });

    return {
      hasDropdownBtn,
      computedHandleBtns,
      doDropdownItemClick,
      computedDropdownAtLeast,
      doClick,
      isDropdownBtn,
      computedDropdownBinding
    };
  }
});
</script>

<style lang="less">
.fs-row-handle {
  // display: flex ; // 这里不能用flex，否则会破坏align:center配置
  flex-wrap: wrap;
  .row-handle-btn {
    margin: 2px;
    display: inline-flex;
    &.el-button {
      margin: 2px;
    }
  }
  .fs-row-handle-dropdown-item {
    display: flex;
  }
}
</style>
