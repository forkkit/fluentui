import { SourceFile, JsxExpression, JsxOpeningElement, JsxSelfClosingElement } from 'ts-morph';

export interface CodeModResult {
  success?: boolean;
}

export interface CodeMod<T = SourceFile> {
  /**
   * Each type of codemod can have multiple versions which work on different versions of its targeted package.
   * Must be valid semver.
   * TODO: Currently version is not being checked. Implement this fully or remove.
   */
  version?: string;
  /**
   * A string to help identify the codemod.
   */
  name: string;
  /**
   * The actual function that should be run on any given file.
   * TODO, is there a possibility of codemods that would need to execute over mutiple files?
   */
  run: (file: T) => CodeModResult;
  /**
   * If not enabled, then this mod will not be conisdered to run. Only enable it once it's ready
   * to be applied in real world scenarios
   */
  enabled?: boolean;
}

/**
 * Generic map used if developers need to convert values dynamically
 * rather than statically -- if prop values have a well-defined domain
 * of values, the developer can provide a mapping of old-to-new values to
 * fine-tune upgradess. */
export type ValueMap<T> = {
  [key: string]: T;
};

/**
 * Generic function provided by the utility caller that executes a
 * transform for a prop's value. This transform takes a node in
 * the AST and replaces it with a new node, giving the most control
 * to the developer.
 * TODO -- Can we limit the damage a dev can potentially do given a malformed transform?
 */
export type PropTransform = (
  node: JsxExpression | JsxOpeningElement | JsxSelfClosingElement,
  toRename: string,
  replacementName: string,
) => void;

/**
 * Enum that defines the cases by which this codemod can
 * handle a prop in a spread operator. Called on a variable
 * statement that contains the identified spread prop.
 * Cases are
 * SpreadPropLeft: if the desired spread prop exists on the left side of the deconstruction with '...' before it.
 * PropLeft: if the desired prop exists on the left side of the deconstruction with no '...'.
 * PropRight: if the desired prop exists on the right side of the variable statement.
 * NotFound: if the variable statement does not match one of these cases, mark it as incompatible with the mod.
 */
export enum SpreadPropInStatement {
  SpreadPropLeft,
  PropLeft,
  PropRight,
  NotFound,
}
