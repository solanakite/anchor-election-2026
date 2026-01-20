use anchor_lang::prelude::*;
use handlers::*;

pub mod constants;
pub mod error;
pub mod handlers;
pub mod state;

declare_id!("81CwxRyxTd3RWSZT6x3w5RjLTFcudVri3i9KsmWpifCk");

#[program]
pub mod election {
    use super::*;

    pub fn create_election(
        context: Context<CreateElectionAccounts>
    ) -> Result<()> {
        handlers::create_election::create_election(context)
    }

    pub fn vote(
        context: Context<VoteAccounts>, 
        choice: state::Choice
    ) -> Result<()> {
        handlers::vote::vote(context, choice)
    }
}