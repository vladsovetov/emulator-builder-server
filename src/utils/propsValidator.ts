import { Prop } from '../models/Prop';

interface validationResult {
  isValid: true | false;
  errorMsg?: string;
}

export const validatePropsRefs = (props: Prop[]): validationResult => {
  if (
    process.env.PROPS_LIST_MAX_LENGTH &&
    props.length > parseInt(process.env.PROPS_LIST_MAX_LENGTH)
  ) {
    return {
      isValid: false,
      errorMsg: `Not allowed to provide props more than ${process.env.PROPS_LIST_MAX_LENGTH}`,
    };
  }
  return {
    isValid: true,
  };
};
