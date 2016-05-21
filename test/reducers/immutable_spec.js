import {List, Map} from 'immutable';
import {expect} from 'chai';

describe('immutability', () => {

  describe('A Number', () => {

    function increment(currentState) {
      return currentState + 1;
    }

    it('is immutable', () => {
      let state = 42;
      let nextState = increment(state);

      expect(nextState).to.equal(43);
      expect(state).to.equal(42);
    });

  });

  describe('Lists', () => {

    function addMeal(currentState, meal) {
      return currentState.push(meal);
    }

    it('are immutable', () => {
      let state = List.of('burgers', 'pizza');
      let nextState = addMeal(state, 'fish');

      expect(nextState).to.equal(List.of(
        'burgers',
        'pizza',
        'fish'
      ));
      expect(state).to.equal(List.of(
        'burgers',
        'pizza'
      ));
    });

  });

});