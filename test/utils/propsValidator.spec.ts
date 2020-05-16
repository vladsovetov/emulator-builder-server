import { expect } from 'chai';
import 'mocha';

import { Prop } from '../../src/models/Prop';
import { validatePropsRefs } from '../../src/utils/propsValidator';

const createProps = (length: number) => {
  const props: Prop[] = [];
  for (let ind = 0; ind < 10; ind++) {
    props.push({
      name: `name${ind}`,
      value: `${ind}`,
    });
  }
  return props;
};

describe('propsValidator', () => {
  it('should not allow more pros than allowed in PROPS_LIST_MAX_LENGTH', async () => {
    process.env.PROPS_LIST_MAX_LENGTH = '9';
    const result = validatePropsRefs(createProps(10));
    expect(result.isValid).be.false;
    expect(result.errorMsg).be.not.empty;
  });
});
