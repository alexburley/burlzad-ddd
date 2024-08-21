import { randomUUID } from 'crypto';

export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type BaseEntityProps = {
  id?: string;
  etag?: string;
  modifiedAt?: Date;
  createdAt?: Date;
};

export type EntityProps<T = {}> = Prettify<BaseEntityProps & T>;

export type BaseEntityData = {
  readonly createdAt: Date;
  modifiedAt: Date;
  hasChanged: boolean;
};

export function updatable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalMethod: (this: any, ...args: any[]) => any,
) {
  function replacementMethod(
    this: BaseEntity<EntityProps>,
    ...args: unknown[]
  ) {
    const result = originalMethod.call(this, ...args);
    this.update();
    return result;
  }

  return replacementMethod;
}

export abstract class BaseEntity<TProps extends EntityProps> {
  protected _data: TProps & BaseEntityData;
  readonly id: string;

  constructor(props: TProps & { idPrefix: string }) {
    this.id = props.id || `${props.idPrefix}_${randomUUID()}`;
    const createdAt = props.createdAt || new Date();
    this._data = {
      ...props,
      hasChanged: props.id ? true : false,
      createdAt,
      modifiedAt: props.modifiedAt || createdAt,
    };
    delete this._data?.id;
  }

  get etag() {
    return this._data.etag;
  }

  get modifiedAt() {
    return this._data.modifiedAt;
  }

  get createdAt() {
    return this._data.createdAt;
  }

  protected update() {
    this._data.hasChanged = true;
    this._data.modifiedAt = new Date();
  }
}

export class AggregateRoot<
  TProps extends EntityProps,
  TIntegrationEvents = unknown,
> extends BaseEntity<TProps> {
  protected integrationEvents: Array<TIntegrationEvents> = [];

  constructor(props: TProps & { idPrefix: string }) {
    super(props);
  }
}
