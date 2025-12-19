declare module 'aria-query' {
  export type ARIARoleRelationConcept = unknown;
  export type ARIAPropertyDefinition = unknown;
  export type ARIARoleDefinitionKey = string;

  export const roles: Map<ARIARoleDefinitionKey, ARIAPropertyDefinition>;
  export const elementRoles: Map<string, Set<ARIARoleDefinitionKey>>;
}
