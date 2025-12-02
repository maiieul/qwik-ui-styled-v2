import { component$ } from "@qwik.dev/core";
import { expect, describe, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-qwik";
import { Input } from "./input";

const inputEl = (dataTestId: string) => page.getByTestId(`input_${dataTestId}`);
// const errorEl = page.getByTestId(`input_error_${inputId}`);

const Basic = component$(() => {
  return (
    <div>
      <Input data-testid="basic" />
    </div>
  );
});

describe("Input", () => {
  it("should be visible", async () => {
    render(<Basic />);
    await expect.element(inputEl("basic")).toBeVisible();
  });
});

// import { component$, JSXNode, useSignal } from '@builder.io/qwik';
// import { QwikCityMockProvider } from '@builder.io/qwik-city';

// import { inputSelectors } from '../../../cypress/support/po/input.selectors';
// import { Input } from './input';

// const InputInstance = component$<typeof Input>((props) => {
//   return <Input {...props} id="test" />;
// });

// const InputTemplate = ({ ...props }) => {
//   return (
//     <QwikCityMockProvider>
//       <InputInstance {...props} />
//     </QwikCityMockProvider>
//   );
// };

// describe('Input', () => {
//   describe('standalone', () => {
//     beforeEach(() => {
//       cy.viewport('iphone-6');

//       cy.mount((<InputTemplate />) as JSXNode);
//     });

//     it('should render', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors.getInputInputById('test').should('be.visible');
//     });
//     it('should be empty by default', () => {
//       inputSelectors.getInputInputById('test').should('have.value', '');
//     });
//     it('should be filled when typed', () => {
//       inputSelectors.getInputInputById('test').type('test');
//       inputSelectors.getInputInputById('test').should('have.value', 'test');
//     });
//     it('should not be required by default', () => {
//       inputSelectors.getInputInputById('test').should('not.have.attr', 'required');
//       inputSelectors.getInputRequiredStarById('test').should('not.exist');
//     });
//   });

//   describe('with label', () => {
//     beforeEach(() => {
//       cy.mount((<InputTemplate label="test label" />) as JSXNode);
//     });
//     it('should render with label', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors.getInputLabelById('test').should('have.text', 'test label');
//       inputSelectors.getInputRequiredStarById('test').should('not.exist');
//     });
//   });

//   describe('with error', () => {
//     beforeEach(() => {
//       cy.mount((<InputTemplate error="test error" />) as JSXNode);
//     });
//     it('should render with an error message', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors.getInputErrorById('test').should('have.text', 'test error');
//     });
//   });

//   describe('with placeholder', () => {
//     beforeEach(() => {
//       cy.mount((<InputTemplate placeholder="test placeholder" />) as JSXNode);
//     });
//     it('should render with a placeholder', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors
//         .getInputInputById('test')
//         .should('have.attr', 'placeholder', 'test placeholder');
//     });
//   });

//   describe('for a required field', () => {
//     beforeEach(() => {
//       cy.mount((<InputTemplate label="test label" required />) as JSXNode);
//     });
//     it('should render with a required star', () => {
//       inputSelectors.getInputInputById('test').should('have.attr', 'required', 'required');
//       inputSelectors.getInputRequiredStarById('test').should('be.visible');
//     });
//   });

//   describe('with a default value', () => {
//     beforeEach(() => {
//       cy.mount((<InputTemplate value="test value" />) as JSXNode);
//     });
//     it('should render with a default value', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors.getInputInputById('test').should('have.value', 'test value');
//     });
//   });

//   describe('with a bind:value', () => {
//     const BoundInputInstance = component$<typeof Input>((props) => {
//       const valueSig = useSignal('test value');
//       return <Input {...props} id="test" bind:value={valueSig} />;
//     });

//     const BoundInputTemplate = ({ ...props }) => {
//       return (
//         <QwikCityMockProvider>
//           <BoundInputInstance {...props} />
//         </QwikCityMockProvider>
//       );
//     };

//     beforeEach(() => {
//       cy.mount((<BoundInputTemplate />) as JSXNode);
//     });
//     it('should render with a default value', () => {
//       inputSelectors.getInputInputById('test').should('exist');
//       inputSelectors.getInputInputById('test').should('have.value', 'test value');
//     });
//   });
// });
