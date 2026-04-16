module AptFund::identity {
    use std::vector;
    use aptos_framework::sha3_256;

    const E_REGISTRY_NOT_FOUND: u64 = 1;
    const E_INVALID_PROOF: u64 = 2;

    struct IdentityRegistry has key {
        verified_addresses: vector<address>,
    }

    public entry fun init_module(admin: &signer) {
        let module_address = signer::address_of(admin);
        if (!exists<IdentityRegistry>(module_address)) {
            move_to(admin, IdentityRegistry { verified_addresses: vector::empty<address>() });
        };
    }

    public entry fun verify_identity(user: &signer, zk_proof: vector<u8>) acquires IdentityRegistry {
        assert!(vector::length(&zk_proof) > 0, E_INVALID_PROOF);
        let proof_hash = sha3_256::sha3_256(zk_proof);
        assert!(vector::length(&proof_hash) == 32, E_INVALID_PROOF);

        let registry_address = @AptFund;
        assert!(exists<IdentityRegistry>(registry_address), E_REGISTRY_NOT_FOUND);

        let user_address = signer::address_of(user);
        let registry = borrow_global_mut<IdentityRegistry>(registry_address);
        let i = 0;
        let len = vector::length(&registry.verified_addresses);
        while (i < len) {
            if (*vector::borrow(&registry.verified_addresses, i) == user_address) {
                return
            };
            i = i + 1;
        };

        vector::push_back(&mut registry.verified_addresses, user_address);
    }

    public fun is_verified(user: address): bool acquires IdentityRegistry {
        if (!exists<IdentityRegistry>(@AptFund)) {
            return false
        };

        let registry = borrow_global<IdentityRegistry>(@AptFund);
        let i = 0;
        let len = vector::length(&registry.verified_addresses);
        while (i < len) {
            if (*vector::borrow(&registry.verified_addresses, i) == user) {
                return true
            };
            i = i + 1;
        };
        false
    }
}
