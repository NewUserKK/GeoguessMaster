<template>
  <div :class="$style['input']">
    <label
      :for="name"
      :class="[
        disabled ? $style['input__label--disabled'] : $style['input__label'],
        errorMsg && $style['input__label--error'],
      ]"
    >
      {{ label }}
    </label>
    <input
      type="text"
      maxlength="20"
      :name="name"
      :class="[
        disabled ? $style['text-input--disabled'] : $style['text-input'],
        errorMsg && $style['text-input--error'],
      ]"
      :placeholder="placeholder"
      v-model="state.inputValue"
      @input="onChangeValue"
      :disabled="disabled"
    />
    <span v-if="errorMsg" :class="$style['input__error']">
      <span class="material-icons">error</span>
      {{ errorMsg }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
      required: false,
    },
    inputValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    errorMsg: {
      type: String,
      required: false,
    },
  },

  setup(props, context) {
    const state = reactive<{
      inputValue: string;
    }>({
      inputValue: props.inputValue,
    });

    const onChangeValue = (): void => {
      context.emit("onChangeValue", state.inputValue);
    };

    return {
      state,
      onChangeValue,
    };
  },
});
</script>

<style module lang="scss">
.input {
  display: flex;
  flex-direction: column;
}

.input__label {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-surface-secondary);

  &--disabled {
    @extend .input__label;
    color: var(--color-surface-light) !important;
  }

  &--error {
    @extend .input__label;
    color: var(--color-red-primary);
  }
}

.text-input {
  border: none;
  border-bottom: 2px solid var(--color-surface-secondary);
  width: 100%;
  line-height: 150%;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);

  &:focus-visible {
    box-shadow: none;
    outline: 0;
  }

  &::placeholder {
    color: var(--color-surface-tertiary);
  }

  &--disabled {
    @extend .text-input;
    border-bottom-color: var(--color-surface-light) !important;
    color: var(--color-surface-light) !important;

    &::placeholder {
      color: var(--color-surface-light) !important;
    }
  }

  &--error {
    @extend .text-input;
    border-bottom-color: var(--color-red-primary);
    color: var(--color-red-primary);

    &::placeholder {
      color: var(--color-red-primary);
    }
  }
}

.input__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-red-primary);

  & > span {
    font-size: 12px;
  }
}
</style>
