import { prop, getModelForClass } from '@typegoose/typegoose';

export class Panel {
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    required: true,
  })
  public type: string = '';

  @prop({
    required: true,
  })
  public settings: object = {};
}

export const PanelModel = getModelForClass(Panel);
