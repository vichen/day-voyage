import {expect} from 'chai'
import CONSTANTS from '../../src/constants';
import activities from '../../src/reducers/activities'

describe('activities_reducer_spec', () => {

  it('handles RECEIVE_ACTIVITIES', () => {
    // const initialState = [];
    // const action = {type: CONSTANTS.RECEIVE_ACTIVITIES, activities: [{city: 'San Francisco', neighborhood: 'Soma'}]};
    // const nextState = activities(initialState, action);
    // expect(nextState).to.deep.equal([{city: 'San Francisco', neighborhood: 'Soma'}]);
  });

  it('handles ADD_TO_BUILDER', () => {
    const initialState = [{city: 'San Francisco', neighborhood: 'Soma'}];
    const action = {type: CONSTANTS.ADD_TO_BUILDER, activity: {added: true, icon: ''}};
    const nextState = activities(initialState, action);
    expect(nextState).to.deep.equal([{city: 'San Francisco', neighborhood: 'Soma'}])
  });

  it('handles DELETE_FROM_BUILDER', () => {
    const initialState = [{city: 'San Francisco', neighborhood: 'Soma'}];
    const action = {type: CONSTANTS.DELETE_FROM_BUILDER, activity: {added: false, icon: 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'}};
    const nextState = activities(initialState, action);
    expect(nextState).to.deep.equal([{city: 'San Francisco', neighborhood: 'Soma'}])    
  });

  it('handles CHECK_AREA', () => {
    // const initialState = [
    // {city: 'San Francisco', neighborhood: 'Soma', visible: true},
    // {city: 'San Francisco', neighborhood: 'Downtown', visible: true},
    // {city: 'San Francisco', neighborhood: 'Mission District', visible: true},
    // {city: 'San Francisco', neighborhood: 'Presido', visible: true},
    // {city: 'San Francisco', neighborhood: 'Embarcadero', visible: true}];
    // const action = {type: CONSTANTS.CHECK_AREA, neighborhoods: ['Soma','Downtown','Misson District']};
    // const nextState = activities(initialState, action);
    // expect(nextState).to.deep.equal([
    // {city: 'San Francisco', neighborhood: 'Soma', visible: true},
    // {city: 'San Francisco', neighborhood: 'Downtown', visible: true},
    // {city: 'San Francisco', neighborhood: 'Mission District', visible: true},
    // {city: 'San Francisco', neighborhood: 'Presido', visible: false},
    // {city: 'San Francisco', neighborhood: 'Embarcadero', visible: false}
    // ])
  });

  it('handles CHECK_CUISINE', () => {
    // const initialState = [
    // {city: 'San Francisco', cuisines: 'Italian', visible: true},
    // {city: 'San Francisco', cuisines: 'Fish', visible: true},
    // {city: 'San Francisco', cuisines: 'Pizza', visible: true},
    // {city: 'San Francisco', cuisines: 'Burgers', visible: true},
    // {city: 'San Francisco', cuisines: 'Mexican', visible: true}];
    // const action = {type: CONSTANTS.CHECK_AREA, neighborhoods: ['Fish','Mexican']};
    // const nextState = activities(initialState, action);
    // expect(nextState).to.deep.equal([
    // {city: 'San Francisco', cuisines: 'Italian', visible: false},
    // {city: 'San Francisco', cuisines: 'Fish', visible: true},
    // {city: 'San Francisco', cuisines: 'Pizza', visible: false},
    // {city: 'San Francisco', cuisines: 'Burgers', visible: false},
    // {city: 'San Francisco', cuisines: 'Mexican', visible: true}
    // ])
  });

})
