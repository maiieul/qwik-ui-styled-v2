import {
  $,
  component$,
  PropsOf,
  Slot,
  useStyles$,
  useSignal,
} from "@qwik.dev/core";
import {
  Chip,
  Button,
  Callout,
  Card,
  Modal,
  Separator,
  Input,
  Field,
  IconButton,
} from "~/components/ui";
import { Lucide } from "@qds.dev/ui";

export default component$(() => {
  const twoWayDataBindingSignal = useSignal("");
  const oneWayDataBindingSignal = useSignal("");
  return (
    <>
      <h2 class="text-2xl font-bold">Chips</h2>
      <div class="my-10 flex flex-col items-start justify-start gap-6">
        <Chip variant="outline">Outline</Chip>
        <Chip variant="secondary">Secondary</Chip>
        <Chip variant="primary">Primary</Chip>
      </div>
      <div class="my-10 flex justify-start gap-6">
        <Chip variant="alert">
          <Lucide.TriangleAlert name="icon" class="mr-1 size-4" /> Expired
        </Chip>
      </div>
      <h2 class="text-2xl font-bold">Inputs</h2>
      <div class="my-10 flex justify-start gap-6">
        <Input placeholder="Enter your name" name="simple" />
      </div>
      <div class="my-10 flex flex-col justify-start">
        <p>Two-way bound value: {twoWayDataBindingSignal.value}</p>
        <Input
          placeholder="I'm a two-way bound input"
          bind:value={twoWayDataBindingSignal}
          name="two-way"
        />
      </div>
      <div class="my-10 flex flex-col justify-start">
        <p>One-way bound value: {oneWayDataBindingSignal.value}</p>
        <Input
          placeholder="I'm a one-way bound input"
          value={oneWayDataBindingSignal.value}
          onInput$={$((_, element) => {
            console.log("onInput$", element.value);
            oneWayDataBindingSignal.value = element.value;
          })}
          name="one-way"
        />
      </div>

      <h2 class="text-2xl font-bold">Buttons</h2>
      <h3>3 options CTA (ghost-link + secondary + primary)</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="vanilla">Delete listing</Button>
        <Button variant="secondary">Edit</Button>
        <Button variant="primary">Publish</Button>
      </div>
      <h3>2 options CTA (secondary + primary | outline + primary)</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="secondary">Edit</Button>
        <Button variant="primary">Confirm</Button>
      </div>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="outline">Discard</Button>
        <Button variant="primary">Confirm</Button>
      </div>
      <h3>nav (link | ghost)</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="link">home</Button>
      </div>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="ghost">Learn more</Button>
      </div>
      <h3>disabled</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="primary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Confirm
        </Button>
        <Button variant="secondary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Add to cart
        </Button>
      </div>
      <h3>sizes</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="outline" size="sm">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="outline" size="md">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="outline" size="lg">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <h3>alert (always as a secondary confirmation step)</h3>
      <div class="my-10 flex justify-start gap-6">
        <Button variant="alert">Delete</Button>
      </div>

      <h2 class="text-2xl font-bold">Icon Buttons</h2>
      <h3>variants (vanilla, ghost, outline)</h3>
      <div class="my-10 flex flex-col justify-start gap-6">
        <IconButton variant="vanilla">
          <Lucide.Rocket name="icon" />
        </IconButton>
        <IconButton variant="ghost">
          <Lucide.Rocket name="icon" />
        </IconButton>
        <IconButton variant="outline">
          <Lucide.Rocket name="icon" />
        </IconButton>
      </div>
      <h3>sizes (sm + md + lg)</h3>
      <div class="my-10 flex justify-start gap-6">
        <IconButton variant="outline" size="sm">
          <Lucide.Rocket name="icon" />
        </IconButton>
        <IconButton variant="outline" size="md">
          <Lucide.Rocket name="icon" />
        </IconButton>
        <IconButton variant="outline" size="lg">
          <Lucide.Rocket name="icon" />
        </IconButton>
      </div>
      <h2 class="text-2xl font-bold">Callouts</h2>
      <h3>variants (default, secondary, primary, alert)</h3>
      <div class="my-10 grid grid-cols-1 justify-center gap-6">
        <CalloutExample variant="default" />
        <CalloutExample variant="secondary" />
        <CalloutExample variant="primary" />
        <CalloutExample
          variant="alert"
          title="Attention!"
          description='Using this variant will automatically apply `role="alert"` to the component. This will interrupt the screen reader user flow when introduced to the DOM and should therefore be used with caution.'
        />
      </div>

      <h2 class="text-2xl font-bold">Cards</h2>
      <h3>variants (default, accent, emphasis)</h3>
      <div class="my-10 grid grid-cols-1 justify-center gap-6">
        <CardExample variant="default" />
        <CardExample variant="accent" />
        <CardExample variant="emphasis" />
      </div>
      <h3>Stacked cards</h3>
      <CardExample
        variant="default"
        class="flex items-center justify-center gap-6"
      >
        <CardExample variant="default" class="h-40 w-40" />
        <CardExample variant="accent" class="h-40 w-40" />
        <CardExample variant="emphasis" class="h-40 w-40" />
      </CardExample>
      <h2 class="text-2xl font-bold">Fields</h2>
      <div class="my-10 grid grid-cols-2 justify-center gap-6">
        <FieldExample />
      </div>
      <h2 class="text-2xl font-bold">Separator</h2>
      <div class="my-10 grid grid-cols-2 justify-center gap-6">
        <div>
          <div class="space-y-1">
            <h4 class="text-sm leading-none font-medium">Qwik UI</h4>
            <p class="text-sm">An open-source UI component library.</p>
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
      <div class="my-10 grid grid-cols-2 justify-center gap-6">
        <ModalExample />
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
          {variant === "alert" ? (
            <Lucide.TriangleAlert name="icon" class="size-5" />
          ) : (
            <Lucide.Info name="icon" class="size-5" />
          )}
          <Callout.Title>{title}</Callout.Title>
          <Callout.Description>{description}</Callout.Description>
        </Callout.Root>
      </>
    );
  },
);

const CardExample = component$<PropsOf<typeof Card.Root>>(({ ...props }) => {
  useStyles$(`
    @layer components {
      .card-example {
        height: 20rem;
        width: 100%;
      }
    }
  `);

  return (
    <Card.Root {...props} class={["card-example", props.class]}>
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
        <Modal.Title>The Qwik UI Modal</Modal.Title>
        <Modal.Description>
          Based on the QDS headless modal component.
        </Modal.Description>
        <p class="mt-6">
          It is a great way to display important information to the user while
          keeping the current context available to see.
        </p>
        <p>
          Use cases vary. For example it can be used to display a confirmation
          step, a login form, or a side menu for navigation.
        </p>
        <footer class="mt-9 flex justify-end gap-4">
          <div class="flex gap-4">
            <Button variant="primary">Continue</Button>
          </div>
        </footer>
        <Modal.Close class="absolute top-4 right-6" asChild>
          <IconButton variant="vanilla">
            <Lucide.X name="icon" />
          </IconButton>
        </Modal.Close>
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
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field.Root>
        </Field.Root>
      </form>
    </div>
  );
}
