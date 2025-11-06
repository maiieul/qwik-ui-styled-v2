import {
  $,
  component$,
  type PropsOf,
  QRL,
  QRLEventHandlerMulti,
  useStyles$,
  useVisibleTask$,
} from "@qwik.dev/core";
import styles from "./input.css?inline";

type InputProps = PropsOf<"input"> & {
  error?: string;
  onInput$: QRL<QRLEventHandlerMulti<InputEvent, HTMLInputElement>>;
};

export const Input = component$<InputProps>(
  ({
    name,
    error,
    id,
    ["bind:value"]: valueSig,
    value,
    onInput$,
    ...props
  }) => {
    useStyles$(styles);
    const inputId = id || name;

    useVisibleTask$(({ track }) => {
      track(() => onInput$);
      console.log("onInput$", onInput$);
    });

    return (
      <>
        <input
          {...props}
          aria-errormessage={`${inputId}-error`}
          aria-invalid={!!error}
          bind:value={valueSig}
          value={value}
          onInput$={onInput$}
          class={["input", props.class]}
          id={inputId}
          name={name}
        />
        {error && (
          <div id={`${inputId}-error`} class="input-error">
            {error}
          </div>
        )}
      </>
    );
  },
);
