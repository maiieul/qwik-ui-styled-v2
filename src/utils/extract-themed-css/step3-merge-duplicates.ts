import * as csstree from "css-tree";

export function mergeDuplicates(
  atRuleBlockChildren: csstree.List<csstree.CssNode>,
): csstree.List<csstree.CssNode> {
  type BlockMergeState = {
    declarationOrder: string[];
    lastDeclarationByProperty: Map<string, csstree.Declaration>;
    nestedRuleOrder: string[];
    nestedRuleByPrelude: Map<string, RuleMergeState>;
    nestedAtRuleOrder: string[];
    nestedAtRuleByKey: Map<string, AtRuleMergeState>;
    otherChildren: csstree.CssNode[];
  };

  type RuleMergeState = BlockMergeState & { rule: csstree.Rule };
  type AtRuleMergeState = BlockMergeState & { atRule: csstree.Atrule };

  const createBlockState = (): BlockMergeState => ({
    declarationOrder: [],
    lastDeclarationByProperty: new Map(),
    nestedRuleOrder: [],
    nestedRuleByPrelude: new Map(),
    nestedAtRuleOrder: [],
    nestedAtRuleByKey: new Map(),
    otherChildren: [],
  });

  const createRuleState = (rule: csstree.Rule): RuleMergeState => ({
    rule,
    ...createBlockState(),
  });

  const createAtRuleState = (atRule: csstree.Atrule): AtRuleMergeState => ({
    atRule,
    ...createBlockState(),
  });

  const atRuleKey = (atRule: csstree.Atrule): string => {
    const prelude =
      atRule.prelude && atRule.prelude.type !== "Raw"
        ? csstree.generate(atRule.prelude).trim()
        : atRule.prelude
          ? csstree.generate(atRule.prelude).trim()
          : "";
    return `${atRule.name} ${prelude}`.trim();
  };

  const mergeChildrenIntoState = (
    state: BlockMergeState,
    children?: csstree.List<csstree.CssNode>,
  ) => {
    if (!children) return;

    for (const n of children) {
      if (n.type === "Declaration") {
        const property = n.property;
        if (!state.lastDeclarationByProperty.has(property)) {
          state.declarationOrder.push(property);
        }
        state.lastDeclarationByProperty.set(property, n);
        continue;
      }

      // Nested rules like "&:hover { ... }"
      if (n.type === "Rule" && n.prelude.type === "SelectorList") {
        const nestedPrelude = csstree.generate(n.prelude).trim();
        let nestedState = state.nestedRuleByPrelude.get(nestedPrelude);
        if (!nestedState) {
          nestedState = createRuleState(n);
          state.nestedRuleByPrelude.set(nestedPrelude, nestedState);
          state.nestedRuleOrder.push(nestedPrelude);
        }

        mergeChildrenIntoState(nestedState, n.block.children);
        continue;
      }

      // Nested at-rules like "@media (...) { ... }" inside a selector rule.
      if (n.type === "Atrule" && n.block) {
        const key = atRuleKey(n);
        let nestedAtRuleState = state.nestedAtRuleByKey.get(key);
        if (!nestedAtRuleState) {
          nestedAtRuleState = createAtRuleState(n);
          state.nestedAtRuleByKey.set(key, nestedAtRuleState);
          state.nestedAtRuleOrder.push(key);
        }

        mergeChildrenIntoState(nestedAtRuleState, n.block.children);
        continue;
      }

      state.otherChildren.push(n);
    }
  };

  const finalizeStateIntoChildren = (state: BlockMergeState) => {
    const newChildren = new csstree.List<csstree.CssNode>();

    // Declarations first (deduped by property, last one wins)
    for (const property of state.declarationOrder) {
      const decl = state.lastDeclarationByProperty.get(property);
      if (decl) newChildren.push(decl);
    }

    // Then nested rules (deduped by selector prelude, recursively finalized)
    for (const nestedPrelude of state.nestedRuleOrder) {
      const nestedState = state.nestedRuleByPrelude.get(nestedPrelude);
      if (!nestedState) continue;
      nestedState.rule.block.children = finalizeStateIntoChildren(nestedState);
      newChildren.push(nestedState.rule);
    }

    // Then nested at-rules (deduped by name+prelude, recursively finalized)
    for (const key of state.nestedAtRuleOrder) {
      const nestedAtRuleState = state.nestedAtRuleByKey.get(key);
      if (!nestedAtRuleState) continue;
      if (nestedAtRuleState.atRule.block) {
        nestedAtRuleState.atRule.block.children =
          finalizeStateIntoChildren(nestedAtRuleState);
      }
      newChildren.push(nestedAtRuleState.atRule);
    }

    // Then any other children
    for (const other of state.otherChildren) {
      newChildren.push(other);
    }

    return newChildren;
  };

  const merged: csstree.List<csstree.CssNode> = new csstree.List();
  const stateByPrelude = new Map<string, RuleMergeState>();

  if (!atRuleBlockChildren) return merged;

  for (const child of atRuleBlockChildren) {
    if (child.type !== "Rule" || child.prelude.type !== "SelectorList") {
      continue;
    }

    const prelude = csstree.generate(child.prelude).trim();
    let state = stateByPrelude.get(prelude);

    if (!state) {
      state = createRuleState(child);
      stateByPrelude.set(prelude, state);
      merged.push(child);
    }

    mergeChildrenIntoState(state, child.block.children);
  }

  for (const state of stateByPrelude.values()) {
    state.rule.block.children = finalizeStateIntoChildren(state);
  }

  return merged;
}
