import DueStringParser from './dueStringParser';

describe('DueStringParser', () => {
  describe('when given "Due"', () => {
    it('sets minutes to 0', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('Due', now);

      expect(parser.minutes).toBe(0);
    });

    it('sets dueRelative to "Due"', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('Due', now);

      expect(parser.dueRelative).toBe('Due');
    });

    it('sets dueAbsolute to the current time', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('Due', now);

      expect(parser.dueAbsolute).toBe('10:05');
    });
  });

  describe('when given a time', () => {
    it('calculates the correct number of minutes', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('12:30', now);

      expect(parser.minutes).toBe(145);
    });

    it('sets dueRelative to the correct value', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('12:30', now);

      expect(parser.dueRelative).toBe('145 min');
    });

    it('sets dueAbsolute to the given time', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('12:30', now);

      expect(parser.dueAbsolute).toBe('12:30');
    });
  });

  describe('when given a time in the past', () => {
    it('sets minutes to 0', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('10:04', now);

      expect(parser.minutes).toBe(0);
    });

    it('sets dueRelative to "Due"', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('10:04', now);

      expect(parser.dueRelative).toBe('Due');
    });

    it('sets dueAbsolute to the given time', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('10:04', now);

      expect(parser.dueAbsolute).toBe('10:04');
    });
  });

  describe('when given a time tomorrow', () => {
    it('calculates the correct number of minutes', () => {
      const now = new Date('2017-11-10T23:05:10');
      const parser = new DueStringParser('01:10', now);

      expect(parser.minutes).toBe(125);
    });

    it('sets dueRelative to the correct value', () => {
      const now = new Date('2017-11-10T23:05:10');
      const parser = new DueStringParser('01:10', now);

      expect(parser.dueRelative).toBe('125 min');
    });

    it('sets dueAbsolute to the given time', () => {
      const now = new Date('2017-11-10T23:05:10');
      const parser = new DueStringParser('01:10', now);

      expect(parser.dueAbsolute).toBe('01:10');
    });
  });

  describe('when given an invalid due string', () => {
    it('sets minutes to 0', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('blah', now);

      expect(parser.minutes).toBe(0);
    });

    it('sets dueRelative to the given string with an exclamation mark', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('blah', now);

      expect(parser.dueRelative).toBe('blah!');
    });

    it('sets dueAbsolute to an empty string', () => {
      const now = new Date('2017-11-10T10:05:10');
      const parser = new DueStringParser('blah', now);

      expect(parser.dueAbsolute).toBe('');
    });
  });
});
