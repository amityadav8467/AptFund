module AptFund::refund {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use AptFund::crowdfund;
    use AptFund::contribution;

    const E_STORE_NOT_FOUND: u64 = 1;
    const E_CAMPAIGN_ACTIVE: u64 = 2;
    const E_GOAL_ALREADY_REACHED: u64 = 3;
    const E_GOAL_NOT_REACHED: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_NOTHING_TO_CLAIM: u64 = 6;

    struct FundsWithdrawn has copy, drop, store {
        campaign_id: u64,
        creator: address,
        amount: u64,
        created_at: u64,
    }

    struct RefundClaimed has copy, drop, store {
        campaign_id: u64,
        contributor: address,
        amount: u64,
        created_at: u64,
    }

    struct RefundStore has key {
        withdrawn_events: event::EventHandle<FundsWithdrawn>,
        refund_events: event::EventHandle<RefundClaimed>,
    }

    public entry fun init_module(admin: &signer) {
        let module_address = signer::address_of(admin);
        if (!exists<RefundStore>(module_address)) {
            move_to(admin, RefundStore {
                withdrawn_events: account::new_event_handle<FundsWithdrawn>(admin),
                refund_events: account::new_event_handle<RefundClaimed>(admin),
            });
        };
    }

    public entry fun withdraw_funds(creator: &signer, campaign_id: u64) acquires RefundStore {
        let campaign = crowdfund::get_campaign(campaign_id);
        let now = timestamp::now_seconds();
        assert!(now >= campaign.deadline || campaign.raised_amount >= campaign.goal_amount, E_CAMPAIGN_ACTIVE);
        assert!(campaign.raised_amount >= campaign.goal_amount, E_GOAL_NOT_REACHED);
        assert!(campaign.creator == signer::address_of(creator), E_UNAUTHORIZED);

        let amount = campaign.raised_amount;
        coin::transfer<AptosCoin>(@AptFund, signer::address_of(creator), amount);
        crowdfund::deactivate_campaign(campaign_id);

        let store = borrow_global_mut<RefundStore>(@AptFund);
        event::emit_event(&mut store.withdrawn_events, FundsWithdrawn {
            campaign_id,
            creator: signer::address_of(creator),
            amount,
            created_at: now,
        });
    }

    public entry fun claim_refund(contributor: &signer, campaign_id: u64) acquires RefundStore {
        let campaign = crowdfund::get_campaign(campaign_id);
        let now = timestamp::now_seconds();

        assert!(now >= campaign.deadline, E_CAMPAIGN_ACTIVE);
        assert!(campaign.raised_amount < campaign.goal_amount, E_GOAL_ALREADY_REACHED);

        let contributions = contribution::get_contributions(campaign_id);
        let i = 0;
        let len = vector::length(&contributions);
        let refund_amount = 0;
        while (i < len) {
            let c = vector::borrow(&contributions, i);
            if (c.contributor == signer::address_of(contributor)) {
                refund_amount = refund_amount + c.amount;
            };
            i = i + 1;
        };

        assert!(refund_amount > 0, E_NOTHING_TO_CLAIM);
        coin::transfer<AptosCoin>(@AptFund, signer::address_of(contributor), refund_amount);

        let store = borrow_global_mut<RefundStore>(@AptFund);
        event::emit_event(&mut store.refund_events, RefundClaimed {
            campaign_id,
            contributor: signer::address_of(contributor),
            amount: refund_amount,
            created_at: now,
        });
    }
}
