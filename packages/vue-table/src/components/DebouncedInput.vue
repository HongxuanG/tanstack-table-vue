<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  debounce: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['update:modelValue'])

const timeout = ref<ReturnType<typeof setTimeout>>()

const localValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    if (timeout.value)
      clearTimeout(timeout.value)

    timeout.value = setTimeout(
      () => emit('update:modelValue', newValue),
      props.debounce,
    )
  },
})
onBeforeUnmount(() => clearTimeout(timeout.value))
</script>

<template>
  <input v-model="localValue" class="input" v-bind="$attrs">
</template>

<style scoped lang="scss">
.input{
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-size: 12px;
  box-sizing: border-box;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &:focus{
    border-color: #409eff;
  }
}
</style>
