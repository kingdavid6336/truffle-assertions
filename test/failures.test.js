const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { fake } = require('sinon');
const truffleAssert = require('..');

chai.use(chaiAsPromised);
const { assert, AssertionError } = chai;
const { ErrorType } = truffleAssert;

const passes = fake.resolves();
const reverts = fake.rejects(new Error('VM Exception while processing transaction: revert'));
const revertsWithReason = fake.rejects(new Error('VM Exception while processing transaction: revert Only owner'));

describe('fails', () => {
  it('should fail when function passes', async () => {
    await assert.isRejected(truffleAssert.fails(passes()), AssertionError);
  });

  it('should fail when function fails with incorrect type', async () => {
    await assert.isRejected(
      truffleAssert.fails(reverts(), ErrorType.OUT_OF_GAS),
      AssertionError,
    );
  });

  it('should fail when function reverts with incorrect reason', async () => {
    await assert.isRejected(
      truffleAssert.fails(revertsWithReason(), ErrorType.REVERT, 'Only administrator'),
      AssertionError,
    );
  });

  it('should return custom message on failure', async () => {
    await assert.isRejected(
      truffleAssert.fails(revertsWithReason(), ErrorType.REVERT, 'Only administrator', 'Only administrator'),
      /Only administrator/,
    );
  });

  it('should pass when function fails', async () => {
    await truffleAssert.fails(reverts());
  });

  it('should pass when function fails with correct type', async () => {
    await truffleAssert.fails(reverts(), ErrorType.REVERT);
  });

  it('should pass when function reverts with correct reason', async () => {
    await truffleAssert.fails(revertsWithReason(), ErrorType.REVERT, 'Only owner');
  });
});

describe('reverts', () => {
  it('should fail when function does not revert', async () => {
    await assert.isRejected(truffleAssert.reverts(passes()), AssertionError);
  });

  it('should fail when function reverts with incorrect reason', async () => {
    await assert.isRejected(
      truffleAssert.reverts(revertsWithReason(), 'Only administrator'),
      AssertionError,
    );
  });

  it('should return custom message on failure', async () => {
    await assert.isRejected(
      truffleAssert.reverts(revertsWithReason(), 'Only administrator', 'Only administrator'),
      /Only administrator/,
    );
  });

  it('should pass when function reverts', async () => {
    await truffleAssert.reverts(reverts());
  });

  it('should pass when function reverts with correct reason', async () => {
    await truffleAssert.reverts(revertsWithReason(), 'Only owner');
  });
});

describe('passes', () => {
  it('should fail when function fails', async () => {
    await assert.isRejected(truffleAssert.passes(reverts()), AssertionError);
  });

  it('should return custom message on failure', async () => {
    await assert.isRejected(truffleAssert.passes(reverts(), 'Should pass'), /Should pass/);
  });

  it('should pass when function passes', async () => {
    await truffleAssert.passes(passes());
  });
});
