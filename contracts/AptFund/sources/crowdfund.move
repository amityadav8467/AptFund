module AptFund::crowdfund {
    use std::vector;
    use aptos_framework::timestamp;

    const E_REGISTRY_NOT_FOUND: u64 = 1;
    const E_TITLE_EMPTY: u64 = 2;
    const E_DESCRIPTION_EMPTY: u64 = 3;
    const E_INVALID_GOAL: u64 = 4;
    const E_DEADLINE_TOO_SOON: u64 = 5;
    const E_CAMPAIGN_NOT_FOUND: u64 = 6;
    const E_CAMPAIGN_INACTIVE: u64 = 7;

    const MIN_DEADLINE_SECONDS: u64 = 24 * 60 * 60;

    struct Campaign has copy, drop, store {
        id: u64,
        creator: address,
        title: vector<u8>,
        description: vector<u8>,
        goal_amount: u64,
        raised_amount: u64,
        deadline: u64,
        active: bool,
    }

    struct CampaignRegistry has key {
        campaigns: vector<Campaign>,
        next_id: u64,
    }

    public entry fun init_module(admin: &signer) {
        let module_address = signer::address_of(admin);
        if (!exists<CampaignRegistry>(module_address)) {
            move_to(admin, CampaignRegistry { campaigns: vector::empty<Campaign>(), next_id: 0 });
        };
    }

    public fun create_campaign(
        creator: &signer,
        title: vector<u8>,
        description: vector<u8>,
        goal_amount: u64,
        deadline: u64,
    ): u64 acquires CampaignRegistry {
        assert!(vector::length(&title) > 0, E_TITLE_EMPTY);
        assert!(vector::length(&description) > 0, E_DESCRIPTION_EMPTY);
        assert!(goal_amount > 0, E_INVALID_GOAL);

        let now = timestamp::now_seconds();
        assert!(deadline >= now + MIN_DEADLINE_SECONDS, E_DEADLINE_TOO_SOON);

        let registry_address = @AptFund;
        assert!(exists<CampaignRegistry>(registry_address), E_REGISTRY_NOT_FOUND);
        let registry = borrow_global_mut<CampaignRegistry>(registry_address);

        let id = registry.next_id;
        registry.next_id = id + 1;

        vector::push_back(&mut registry.campaigns, Campaign {
            id,
            creator: signer::address_of(creator),
            title,
            description,
            goal_amount,
            raised_amount: 0,
            deadline,
            active: true,
        });

        id
    }

    public fun get_campaign(id: u64): Campaign acquires CampaignRegistry {
        let registry = borrow_global<CampaignRegistry>(@AptFund);
        let i = 0;
        let len = vector::length(&registry.campaigns);
        while (i < len) {
            let campaign = vector::borrow(&registry.campaigns, i);
            if (campaign.id == id) {
                return *campaign
            };
            i = i + 1;
        };
        abort E_CAMPAIGN_NOT_FOUND
    }

    public fun is_goal_reached(id: u64): bool acquires CampaignRegistry {
        let campaign = get_campaign(id);
        campaign.raised_amount >= campaign.goal_amount
    }

    public(friend) fun add_raised_amount(id: u64, amount: u64) acquires CampaignRegistry {
        let registry = borrow_global_mut<CampaignRegistry>(@AptFund);
        let i = 0;
        let len = vector::length(&registry.campaigns);
        while (i < len) {
            let campaign = vector::borrow_mut(&mut registry.campaigns, i);
            if (campaign.id == id) {
                assert!(campaign.active, E_CAMPAIGN_INACTIVE);
                campaign.raised_amount = campaign.raised_amount + amount;
                return
            };
            i = i + 1;
        };
        abort E_CAMPAIGN_NOT_FOUND
    }

    public(friend) fun deactivate_campaign(id: u64) acquires CampaignRegistry {
        let registry = borrow_global_mut<CampaignRegistry>(@AptFund);
        let i = 0;
        let len = vector::length(&registry.campaigns);
        while (i < len) {
            let campaign = vector::borrow_mut(&mut registry.campaigns, i);
            if (campaign.id == id) {
                campaign.active = false;
                return
            };
            i = i + 1;
        };
        abort E_CAMPAIGN_NOT_FOUND
    }

    public(friend) fun assert_creator(id: u64, creator: address) acquires CampaignRegistry {
        let campaign = get_campaign(id);
        assert!(campaign.creator == creator, E_CAMPAIGN_NOT_FOUND);
    }

    friend AptFund::contribution;
    friend AptFund::refund;
}
