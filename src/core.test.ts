import { test, expect } from 'vitest';
import { AggregateRoot, type EntityProps } from './core.js';

type TestEntityProps = EntityProps<{
  field: string;
}>;

type TestEntityEvent = {
  name: string;
};

class TestEntity extends AggregateRoot<TestEntityProps, TestEntityEvent> {}

test.todo(
  '@updatable should decorate the method with an update to .modifiedAt',
);
test.todo('@updatable should set the entity to be dirty');

test('Should initialize as a new entity if no id was passed', () => {
  const sut = new TestEntity({ idPrefix: 'sut', field: 'someField' });

  expect(sut.createdAt).toBeInstanceOf(Date);
  expect(sut.modifiedAt).toBeInstanceOf(Date);
  expect(sut.id.slice(0, 4)).toEqual('sut_');
});
