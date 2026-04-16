module AptFund::contribution {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use AptFund::crowdfund;

    const E_INVALID_AMOUNT: u64 = 1;
    const E_STORE_NOT_FOUND: u64 = 2;
    const E_CAMPAIGN_ENDED: u64 = 3;

    struct Contribution has copy, drop, store {
        campaign_id: u64,
        contributor: address,
        amount: u64,
        created_at: u64,
    }

    struct CampaignFunded has copy, drop, store {
        campaign_id: u64,
        contributor: address,
        amount: u64,
        created_at: u64,
    }

    struct ContributionStore has key {
        contributions: vector<Contribution>,
        funded_events: event::EventHandle<CampaignFunded>,
    }

    public entry fun init_module(admin: &signer) {
        let module_address = signer::address_of(admin);
        if (!exists<ContributionStore>(module_address)) {
            move_to(admin, ContributionStore {
                contributions: vector::empty<Contribution>(),
                funded_events: account::new_event_handle<CampaignFunded>(admin),
            });
        };
    }

    public entry fun contribute(contributor: &signer, campaign_id: u64, amount: u64) acquires ContributionStore {
        assert!(amount > 0, E_INVALID_AMOUNT);

        let campaign = crowdfund::get_campaign(campaign_id);
        let now = timestamp::now_seconds();
        assert!(now < campaign.deadline, E_CAMPAIGN_ENDED);

        let module_address = @AptFund;
        assert!(exists<ContributionStore>(module_address), E_STORE_NOT_FOUND);

        coin::transfer<AptosCoin>(contributor, module_address, amount);

        let store = borrow_global_mut<ContributionStore>(module_address);
        let contribution = Contribution {
            campaign_id,
            contributor: signer::address_of(contributor),
            amount,
            created_at: now,
        };
        vector::push_back(&mut store.contributions, contribution);
        crowdfund::add_raised_amount(campaign_id, amount);

        event::emit_event(&mut store.funded_events, CampaignFunded {
            campaign_id,
            contributor: signer::address_of(contributor),
            amount,
            created_at: now,
        });
    }

    public fun get_contributions(campaign_id: u64): vector<Contribution> acquires ContributionStore {
        let store = borrow_global<ContributionStore>(@AptFund);
        let out = vector::empty<Contribution>();
        let i = 0;
        let len = vector::length(&store.contributions);
        while (i < len) {
            let contribution = vector::borrow(&store.contributions, i);
            if (contribution.campaign_id == campaign_id) {
                vector::push_back(&mut out, *contribution);
            };
            i = i + 1;
        };
        out
    }
}
