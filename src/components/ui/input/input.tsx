import {
  component$,
  type PropsOf,
  QRL,
  QRLEventHandlerMulti,
  useStyles$,
} from "@qwik.dev/core";
import styles from "./input.css?inline";

type InputProps = PropsOf<"input"> & {
  onInput$?: QRL<QRLEventHandlerMulti<InputEvent, HTMLInputElement>>;
  "data-testid"?: string;
};

export const Input = component$<InputProps>(
  ({ name, id, value, onInput$, "data-testid": dataTestId, ...props }) => {
    useStyles$(styles);
    const inputId = id || name;

    return (
      <input
        {...props}
        // must be declared for two-way binding to work
        bind:value={props["bind:value"]}
        // must be declared for one-way binding to work
        value={value}
        onInput$={onInput$}
        class={["input", props.class]}
        id={inputId}
        name={name}
        data-testid={dataTestId && `input_${dataTestId}`}
      />
    );
  },
);
