declare module "FormTypes" {
  import { ComponentType } from "react";
  export interface FormStepType {
    title: string;
    path: string;
    showProgress: boolean;
    component: ComponentType<any>;
    finalStep: boolean;
  }
  export interface FormValuesType {
    [key: string]: any;
  }
}