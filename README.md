# Anchor Election 2026 (aka Voting app)

## 🆕 Updated for Solana Kit, Kite, and Codama

[![CI Badge](https://github.com/solanakite/anchor-election-2026/actions/workflows/tests.yaml/badge.svg)](https://github.com/solanakite/anchor-election-2026/actions)

A new version of [onchain voting from the Anchor docs](https://examples.anchor-lang.com/docs/onchain-voting).

> A decentralized onchain voting system on Solana, where users can vote on their favourite greeting

Unlike [the original](https://github.com/coral-xyz/anchor-by-example/blob/master/programs/onchain-voting/programs/onchain-voting), we don't the same account to vote multiple times!

This repo provides:

- Full compatibility with the latest Rust, Agave CLI, Node.js, Anchor, and Solana Kit.
- Clean builds with zero warnings or errors.
- Testing via npm and Node.js, avoiding third-party package managers or test runners.
- [A web app using Solana Kit in the browser](web/README.md)

![Solana Kit for an Anchor App Working in Browser](screenshot.png)

## Versions

Verify your local environment with:

```bash
bash show-versions.sh
```

This repository was tested with:

```
OS:
  MacOS 15.4.1
Solana CLI:
  solana-cli 2.1.21 (src:8a085eeb; feat:1416569292, client:Agave)
Anchor:
  anchor-cli 2.1
Node:
  v22.14.0
Rust:
  rustc 1.86.0 (05f9846f8 2026-03-31)
build-sbf version:
  solana-cargo-build-sbf 2.1.21
```

Using different versions may cause compatibility issues.

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/mikemaccana/anchor-election-2026.git
   cd anchor-election-2026
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run tests:

   ```bash
   anchor test
   ```

4. Deploy the program:
   ```bash
   anchor deploy
   ```

## Changelog and Credits

See the [CHANGELOG](CHANGELOG.md) for updates and contributor credits.
