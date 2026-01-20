// We don't meed mocha or jest, node has a built in test framework.
import { before, describe, test, it } from "node:test";
import assert from "node:assert";

// This is the generated client made by Codama
import * as programClient from "../dist/election-client";
import { getElectionDecoder, ELECTION_DISCRIMINATOR } from "../dist/election-client";

// We use the types from @solana/kit
// We use some high levels functions from solana-kite
import { type KeyPairSigner, type Address, MaybeAccount } from "@solana/kit";
import { connect, Connection } from "solana-kite";

export const log = console.log;
export const stringify = (object: any) => {
  const bigIntReplacer = (key: string, value: any) =>
    typeof value === "bigint" ? value.toString() : value;
  return JSON.stringify(object, bigIntReplacer, 2);
};

describe("election", () => {
  // Configure the client to use the local cluster.
  let alice: KeyPairSigner;
  let bob: KeyPairSigner;
  let election: Address;
  let connection: Connection;
  let getElections: () => Promise<
    Array<MaybeAccount<programClient.Election, string>>
  >;

  before(async () => {
    connection = await connect();
    [alice, bob] = await connection.createWallets(2);

    // Create an address for "election"
    const electionPDAAndBump = await connection.getPDAAndBump(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ["election"]
    );
    election = electionPDAAndBump.pda;

    // Create a function to get all elections.
    getElections = connection.getAccountsFactory(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ELECTION_DISCRIMINATOR,
      getElectionDecoder()
    );
  });

  test("Alice creates an election for the public to vote on", async () => {
    // Create an instruction that calls the create_election() instruction handler
    const createElectionInstruction =
      await programClient.getCreateElectionInstruction({
        election: election,
        signer: alice,
      });

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: alice,
      instructions: [createElectionInstruction],
    });

    console.log("Transaction signature", signature);
  });

  test("Alice votes for GM", async () => {
    // Create a PDA for Alice's vote account
    const votePDAAndBump = await connection.getPDAAndBump(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ["vote", alice.address]
    );
    const vote = votePDAAndBump.pda;

    const voteInstruction = await programClient.getVoteInstruction({
      election,
      vote,
      signer: alice,
      choice: programClient.Choice.GM,
    });

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: alice,
      instructions: [voteInstruction],
    });

    console.log("Transaction signature", signature);

    const elections = await getElections();

    assert.ok(elections.length === 1, "Expected to get one election");
    // @ts-expect-error the 'data' property does actually exist.
    const firstElectionData = elections[0].data;

    assert(firstElectionData.isOpen, "Election should be open");
    assert.equal(firstElectionData.gm, 1, "GM should be 1");
    assert.equal(firstElectionData.gn, 0, "GN should be 0");

    const logs = await connection.getLogs(signature);
    assert(
      logs.includes("Program log: Voted for GM ☀️"),
      "Should include the log message"
    );
  });

  test("Bob votes for GN", async () => {
    // Create a PDA for the vote
    const votePDAAndBump = await connection.getPDAAndBump(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ["vote", bob.address]
    );
    const vote = votePDAAndBump.pda;

    const voteInstruction = await programClient.getVoteInstruction({
      election: election,
      vote: vote,
      signer: bob,
      choice: programClient.Choice.GN,
    });

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: bob,
      instructions: [voteInstruction],
    });

    console.log("Transaction signature", signature);

    const elections = await getElections();

    assert.ok(elections.length === 1, "Expected to get one election");

    // @ts-expect-error the 'data' property does actually exist.
    // TODO: resolve this error.
    const firstElectionData = elections[0].data;

    assert(firstElectionData.isOpen, "Election should be open");
    assert.equal(firstElectionData.gm, 1, "GM should be 1");
    assert.equal(firstElectionData.gn, 1, "GN should be 1");

    const logs = await connection.getLogs(signature);
    assert(
      logs.includes("Program log: Voted for GN 🌌"),
      "Should include the log message"
    );
  });

  test("Alice cannot vote twice", async () => {
    // Create a PDA for Alice's vote account (same as before)
    const votePDAAndBump = await connection.getPDAAndBump(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ["vote", alice.address]
    );
    const vote = votePDAAndBump.pda;

    const voteInstruction = await programClient.getVoteInstruction({
      election,
      vote,
      signer: alice,
      choice: programClient.Choice.GM,
    });

    try {
      await connection.sendTransactionFromInstructions({
        feePayer: alice,
        instructions: [voteInstruction],
      });
      assert.fail("Expected transaction to fail");
    } catch (thrownObject) {
      const error = thrownObject as Error;
      assert.ok(
        error.message.includes("account already in use"),
        "Error should indicate account already in use due to seeds constraint"
      );
    }
  });
});
