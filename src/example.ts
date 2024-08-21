import { AggregateRoot, updatable, type EntityProps } from './core.js';

type BasketProps = EntityProps<{
  total: number;
  items: string[];
}>;

type IntegrationEvent = {
  event: string;
  payload: unknown;
};

class Basket extends AggregateRoot<BasketProps, IntegrationEvent> {
  constructor(props: BasketProps) {
    super({ ...props, idPrefix: 'basket' });
  }

  get total() {
    return this._data.total;
  }

  get items(): readonly string[] {
    return this._data.items;
  }

  @updatable
  addItem(item: string) {
    this._data.items.push(item);
    this.integrationEvents.push({
      event: 'BasketUpdatedV1',
      payload: { item },
    });
  }
}

const b = new Basket({
  id: '123',
  etag: 'abc',
  total: 100,
  items: ['item-01', 'item-02'],
});

console.log(b.modifiedAt);

b.addItem('item-03');

console.log(b.modifiedAt);
