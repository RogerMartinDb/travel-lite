import DueStringParser from './dueStringParser';

it('handles Due', ()=>{
  let now = new Date('2017-11-10T10:05:10')
  let sut = new DueStringParser('Due', now);

  expect(sut.minutes).toEqual(0);
  expect(sut.dueRelative).toEqual('Due');
  expect(sut.dueAbsolute).toEqual('10:05');
})

it('handles given time', ()=>{
  let now = new Date('2017-11-10T10:05:10')
  let sut = new DueStringParser('12:30', now);

  expect(sut.minutes).toEqual(145);
  expect(sut.dueRelative).toEqual('145 min');
  expect(sut.dueAbsolute).toEqual('12:30');
})

it('handles given time in past', ()=>{
  let now = new Date('2017-11-10T10:05:10')
  let sut = new DueStringParser('10:04', now);

  expect(sut.minutes).toEqual(0);
  expect(sut.dueRelative).toEqual('Due');
  expect(sut.dueAbsolute).toEqual('10:04');
})

it('handles given time tomorrow', ()=>{
  let now = new Date('2017-11-10T23:05:10')
  let sut = new DueStringParser('01:10', now);

  expect(sut.minutes).toEqual(125);
  expect(sut.dueRelative).toEqual('125 min');
  expect(sut.dueAbsolute).toEqual('01:10');
})

it('handles number of mins', ()=>{
  let now = new Date('2017-11-10T10:05:10')
  let sut = new DueStringParser('12 Mins', now);

  expect(sut.minutes).toEqual(12);
  expect(sut.dueRelative).toEqual('12 min');
  expect(sut.dueAbsolute).toEqual('10:17');
})

it('bad due string', ()=>{
  let now = new Date('2017-11-10T10:05:10')
  let sut = new DueStringParser('blah', now);

  expect(sut.minutes).toEqual(0);
  expect(sut.dueRelative).toEqual('blah!');
  expect(sut.dueAbsolute).toEqual('');
})
