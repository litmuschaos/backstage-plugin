import { litmusPlugin } from './plugin';

describe('litmus', () => {
  it('should export plugin', () => {
    expect(litmusPlugin).toBeDefined();
  });
});
