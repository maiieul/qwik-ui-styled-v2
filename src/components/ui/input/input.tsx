import {
  component$,
  type PropsOf,
  QRL,
  QRLEventHandlerMulti,
  useStyles$,
} from "@qwik.dev/core";
import styles from "./input.css?inline";

type InputProps = PropsOf<"input"> & {
  error?: string;
  onInput$?: QRL<QRLEventHandlerMulti<InputEvent, HTMLInputElement>>;
  "data-testid"?: string;
};

export const Input = component$<InputProps>(
  ({
    name,
    error,
    id,
    value,
    onInput$,
    "data-testid": dataTestId,
    ...props
  }) => {
    useStyles$(styles);
    const inputId = id || name;

    return (
      <>
        <input
          {...props}
          aria-errormessage={`${inputId}-error`}
          aria-invalid={!!error}
          bind:value={props["bind:value"]}
          value={value}
          onInput$={onInput$}
          class={["input", props.class]}
          id={inputId}
          name={name}
          data-testid={dataTestId && `input_${dataTestId}`}
        />
        {error && (
          <div
            id={`${inputId}-error`}
            class="input-error"
            data-testid={dataTestId && `input_error_${dataTestId}`}
          >
            {error}
          </div>
        )}
      </>
    );
  },
);
