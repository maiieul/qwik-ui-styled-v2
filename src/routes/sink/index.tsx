import { $, component$, PropsOf, Slot, useSignal } from "@qwik.dev/core";
import {
  Chip,
  Button,
  Callout,
  Card,
  Modal,
  Separator,
  Input,
  Field,
} from "~/components/ui";
import { Lucide } from "@qds.dev/ui";

export default component$(() => {
  const twoWayDataBindingSignal = useSignal("");
  const oneWayDataBindingSignal = useSignal("");
  return (
    <>
      <h2 class="text-2xl font-bold">Chips</h2>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="outline">Outline</Chip>
        <Chip variant="alt-outline">Alt Outline</Chip>
        <Chip variant="danger">Danger</Chip>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="secondary">Secondary</Chip>
        <Chip variant="alt-secondary">Alt Secondary</Chip>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="primary">Primary</Chip>
        <Chip variant="alt-primary">Alt Primary</Chip>
      </div>
      <div class="m-10 flex justify-start gap-6"></div>

      <h2 class="text-2xl font-bold">Inputs</h2>
      <div class="m-10 flex justify-start gap-6">
        <Input placeholder="Enter your name" />
      </div>
      <div class="m-10 flex flex-col justify-start gap-6">
        <Input
          placeholder="I'm a two-way bound input"
          bind:value={twoWayDataBindingSignal}
        />
        <p>Two-way bound value: {twoWayDataBindingSignal.value}</p>
      </div>
      <div class="m-10 flex flex-col justify-start gap-6">
        <Input
          placeholder="I'm a one-way bound input"
          value={oneWayDataBindingSignal.value}
          onInput$={$((_, element) => {
            console.log("onInput$", element.value);
            oneWayDataBindingSignal.value = element.value;
          })}
        />
        <p>One-way bound value: {oneWayDataBindingSignal.value}</p>
      </div>

      <h2 class="text-2xl font-bold">Buttons</h2>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-link">home</Button>
        <Button variant="alt-ghost">Discard</Button>
        <Button variant="alt-outline">Cancel</Button>
        <Button variant="alt-secondary">Learn more</Button>
        <Button variant="alt-primary">Confirm</Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="danger-ghost">Disable</Button>
        <Button variant="danger-outline">Delete</Button>
        <Button variant="danger">Delete</Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-primary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Confirm
        </Button>
        <Button variant="alt-secondary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Add to cart
        </Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-outline" size="sm">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-outline" size="md">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-outline" size="lg">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>

      <h2 class="text-2xl font-bold">Callout</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <CalloutExample variant="outline"></CalloutExample>
        <CalloutExample variant="alt-outline"></CalloutExample>
        <CalloutExample
          variant="danger"
          title="Attention!"
          description='Using this variant will automatically apply `role="alert"` to the component. This will interrupt the screen reader user flow when introduced to the DOM and should therefore be used with caution.'
        ></CalloutExample>
      </div>

      <h2 class="text-2xl font-bold">Cards</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <CardExample variant="outline"></CardExample>
        <CardExample variant="altOutline"></CardExample>
        <CardExample variant="secondary"></CardExample>
        <CardExample variant="altSecondary"></CardExample>
        <CardExample variant="primary"></CardExample>
        <CardExample variant="altPrimary"></CardExample>
      </div>
      <h2 class="text-2xl font-bold">Fields</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <FieldExample />
      </div>
      <h2 class="text-2xl font-bold">Separator</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <div>
          <div class="space-y-1">
            <h4 class="text-sm leading-none font-medium">Qwik UI</h4>
            <p class="text-sm text-muted-foreground">
              An open-source UI component library.
            </p>
          </div>
          <Separator class="my-4" />
          <div class="flex h-5 items-center space-x-4 text-sm">
            <div>Customizable</div>
            <Separator orientation="vertical" />
            <div>Accessible</div>
            <Separator orientation="vertical" />
            <div>Optimized for you</div>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold">Modals</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <ModalExample></ModalExample>
      </div>
    </>
  );
});

const CalloutExample = component$<
  PropsOf<typeof Callout.Root> & { title?: string; description?: string }
>(
  ({
    variant,
    title = "Did you know?",
    description = "You can completely change the style of your components using our theme builder.",
    ...props
  }) => {
    return (
      <>
        <Callout.Root variant={variant} {...props}>
          {variant === "danger" ? (
            <Lucide.TriangleAlert name="icon" class="h-5 w-5" />
          ) : (
            <Lucide.Info name="icon" class="h-5 w-5" />
          )}
          <Callout.Title>{title}</Callout.Title>
          <Callout.Description>{description}</Callout.Description>
        </Callout.Root>
      </>
    );
  },
);

const CardExample = component$<PropsOf<typeof Card.Root>>(({ ...props }) => {
  return (
    <Card.Root {...props} class="flex items-center justify-center gap-2 py-32">
      <Slot />
    </Card.Root>
  );
});

const ModalExample = component$<PropsOf<typeof Modal.Root>>(() => {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button>Open modal</Button>
      </Modal.Trigger>
      <Modal.Content variant="outline">
        <Modal.Title>Qwik UI</Modal.Title>
        <Modal.Description>
          An open-source UI component library.
        </Modal.Description>
        <p class="mt-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <footer class="mt-9 flex justify-between gap-4">
          <div>
            <Button variant="alt-ghost">Discard</Button>
          </div>
          <div class="flex gap-4">
            <Button variant="alt-secondary">Edit</Button>
            <Button variant="alt-primary">Publish</Button>
          </div>
        </footer>
      </Modal.Content>
    </Modal.Root>
  );
});

export function FieldExample() {
  return (
    <div class="w-full max-w-md border p-4 shadow-sm">
      <form>
        <Field.Root>
          <Field.FieldSet>
            <Field.Legend>Payment Method</Field.Legend>
            <Field.Description>
              All transactions are secure and encrypted
            </Field.Description>
            <Field.Group>
              <Field.Root>
                <Field.Label html-for="checkout-7j9-card-name-43j">
                  Name on Card
                </Field.Label>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field.Root>
              <Field.Root>
                <Field.Label html-for="checkout-7j9-card-number-uw1">
                  Card Number
                </Field.Label>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <Field.Description>
                  Enter your 16-digit card number
                </Field.Description>
              </Field.Root>
              <div class="grid grid-cols-1 gap-4">
                <Field.Root>
                  <Field.Label html-for="checkout-7j9-cvv">CVV</Field.Label>
                  {/* <Input id="checkout-7j9-cvv" placeholder="123" required /> */}
                </Field.Root>
              </div>
            </Field.Group>
          </Field.FieldSet>
          <Field.Separator />
          <Field.FieldSet>
            <Field.Legend>Billing Address</Field.Legend>
            <Field.Description>
              The billing address associated with your payment method
            </Field.Description>
            <Field.Group>
              <Field.Root orientation="horizontal">
                {/* <Checkbox
                  id="checkout-7j9-same-as-shipping-wgm"
                  defaultChecked
                /> */}
                <Field.Label
                  html-for="checkout-7j9-same-as-shipping-wgm"
                  class="font-normal"
                >
                  Same as shipping address
                </Field.Label>
              </Field.Root>
            </Field.Group>
          </Field.FieldSet>
          <Field.FieldSet>
            <Field.Group>
              <Field.Root>
                <Field.Label html-for="checkout-7j9-optional-comments">
                  Comments
                </Field.Label>
                {/* <Textarea
                  id="checkout-7j9-optional-comments"
                  placeholder="Add any additional comments"
                  class="resize-none"
                /> */}
              </Field.Root>
            </Field.Group>
          </Field.FieldSet>
          <Field.Root orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="alt-outline" type="button">
              Cancel
            </Button>
          </Field.Root>
        </Field.Root>
      </form>
    </div>
  );
}
