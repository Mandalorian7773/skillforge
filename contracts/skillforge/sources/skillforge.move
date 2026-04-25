/// SkillForge - Skill-based competitive earning platform
/// Smart contract for match creation, entry fee pooling, and reward distribution
/// Deployed on Initia appchain (skillforge-1)
module skillforge::skillforge {
    use std::signer;
    use std::vector;
    use std::error;
    use initia_std::coin;
    use initia_std::fungible_asset::Metadata;
    use initia_std::object::Object;
    use initia_std::primary_fungible_store;

    // ===== Error Codes =====
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_MATCH_NOT_FOUND: u64 = 2;
    const E_MATCH_FULL: u64 = 3;
    const E_MATCH_ALREADY_STARTED: u64 = 4;
    const E_MATCH_NOT_STARTED: u64 = 5;
    const E_ALREADY_JOINED: u64 = 6;
    const E_INVALID_ENTRY_FEE: u64 = 7;
    const E_INVALID_PLAYERS: u64 = 8;
    const E_MATCH_NOT_COMPLETED: u64 = 9;
    const E_NOT_WINNER: u64 = 10;
    const E_ALREADY_CLAIMED: u64 = 11;
    const E_INSUFFICIENT_BALANCE: u64 = 12;

    // ===== Constants =====
    const STATUS_WAITING: u8 = 0;
    const STATUS_IN_PROGRESS: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const PLATFORM_FEE_PERCENT: u64 = 5;
    const MIN_PLAYERS: u64 = 2;
    const MAX_PLAYERS: u64 = 5;

    // ===== Data Structures =====

    /// Global match counter stored under the module deployer's account
    struct MatchCounter has key {
        count: u64,
    }

    /// Represents a single match
    struct Match has key, store, drop, copy {
        id: u64,
        creator: address,
        entry_fee: u64,
        max_players: u64,
        players: vector<address>,
        scores: vector<u64>,
        status: u8,
        winner: address,
        pool_amount: u64,
        platform_fee: u64,
        reward_claimed: bool,
    }

    /// Global storage for all matches
    struct MatchStore has key {
        matches: vector<Match>,
    }

    /// Platform treasury to collect fees
    struct Treasury has key {
        total_fees: u64,
        admin: address,
    }

    // ===== Initialization =====

    /// Initialize the module - sets up match counter and treasury
    fun init_module(deployer: &signer) {
        let deployer_addr = signer::address_of(deployer);

        move_to(deployer, MatchCounter { count: 0 });
        move_to(deployer, MatchStore { matches: vector::empty() });
        move_to(deployer, Treasury {
            total_fees: 0,
            admin: deployer_addr,
        });
    }

    // ===== Public Entry Functions =====

    /// Create a new match with specified entry fee and max players
    /// Transfers entry_fee from creator to the contract pool
    public entry fun create_match(
        creator: &signer,
        entry_fee: u64,
        max_players: u64,
        asset_metadata: Object<Metadata>,
    ) acquires MatchCounter, MatchStore {
        assert!(entry_fee > 0, error::invalid_argument(E_INVALID_ENTRY_FEE));
        assert!(
            max_players >= MIN_PLAYERS && max_players <= MAX_PLAYERS,
            error::invalid_argument(E_INVALID_PLAYERS)
        );

        let creator_addr = signer::address_of(creator);

        // Transfer entry fee from creator to contract escrow
        primary_fungible_store::transfer(creator, asset_metadata, @skillforge, entry_fee);

        // Get next match ID
        let counter = borrow_global_mut<MatchCounter>(@skillforge);
        counter.count = counter.count + 1;
        let match_id = counter.count;

        // Create match
        let players = vector::empty<address>();
        vector::push_back(&mut players, creator_addr);

        let scores = vector::empty<u64>();
        vector::push_back(&mut scores, 0);

        let new_match = Match {
            id: match_id,
            creator: creator_addr,
            entry_fee,
            max_players,
            players,
            scores,
            status: STATUS_WAITING,
            winner: @0x0,
            pool_amount: entry_fee,
            platform_fee: 0,
            reward_claimed: false,
        };

        // Store match
        let store = borrow_global_mut<MatchStore>(@skillforge);
        vector::push_back(&mut store.matches, new_match);
    }

    /// Join an existing match by paying the entry fee
    /// Transfers entry_fee from player to the contract pool
    public entry fun join_match(
        player: &signer,
        match_id: u64,
        asset_metadata: Object<Metadata>,
    ) acquires MatchStore {
        let player_addr = signer::address_of(player);
        let store = borrow_global_mut<MatchStore>(@skillforge);

        let match_ref = find_match_mut(&mut store.matches, match_id);

        assert!(match_ref.status == STATUS_WAITING, error::invalid_state(E_MATCH_ALREADY_STARTED));
        assert!(
            vector::length(&match_ref.players) < match_ref.max_players,
            error::resource_exhausted(E_MATCH_FULL)
        );
        assert!(
            !vector::contains(&match_ref.players, &player_addr),
            error::already_exists(E_ALREADY_JOINED)
        );

        // Transfer entry fee from player to contract escrow
        primary_fungible_store::transfer(player, asset_metadata, @skillforge, match_ref.entry_fee);

        // Add player
        vector::push_back(&mut match_ref.players, player_addr);
        vector::push_back(&mut match_ref.scores, 0);
        match_ref.pool_amount = match_ref.pool_amount + match_ref.entry_fee;

        // Auto-start if full
        if (vector::length(&match_ref.players) >= match_ref.max_players) {
            match_ref.status = STATUS_IN_PROGRESS;
        };
    }

    /// Start a match manually (creator only)
    public entry fun start_match(
        caller: &signer,
        match_id: u64,
    ) acquires MatchStore {
        let caller_addr = signer::address_of(caller);
        let store = borrow_global_mut<MatchStore>(@skillforge);
        let match_ref = find_match_mut(&mut store.matches, match_id);

        assert!(caller_addr == match_ref.creator, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(match_ref.status == STATUS_WAITING, error::invalid_state(E_MATCH_ALREADY_STARTED));
        assert!(
            vector::length(&match_ref.players) >= MIN_PLAYERS,
            error::invalid_state(E_INVALID_PLAYERS)
        );

        match_ref.status = STATUS_IN_PROGRESS;
    }

    /// Submit a player's score (called by backend oracle / admin)
    public entry fun submit_score(
        admin: &signer,
        match_id: u64,
        player_addr: address,
        score: u64,
    ) acquires MatchStore, Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global<Treasury>(@skillforge);
        assert!(admin_addr == treasury.admin, error::permission_denied(E_NOT_AUTHORIZED));

        let store = borrow_global_mut<MatchStore>(@skillforge);
        let match_ref = find_match_mut(&mut store.matches, match_id);
        assert!(match_ref.status == STATUS_IN_PROGRESS, error::invalid_state(E_MATCH_NOT_STARTED));

        // Find player index and update score
        let len = vector::length(&match_ref.players);
        let i = 0;
        while (i < len) {
            if (*vector::borrow(&match_ref.players, i) == player_addr) {
                let score_ref = vector::borrow_mut(&mut match_ref.scores, i);
                *score_ref = score;
                return
            };
            i = i + 1;
        };

        abort error::not_found(E_MATCH_NOT_FOUND)
    }

    /// Declare the winner based on highest score
    public entry fun declare_winner(
        admin: &signer,
        match_id: u64,
    ) acquires MatchStore, Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global<Treasury>(@skillforge);
        assert!(admin_addr == treasury.admin, error::permission_denied(E_NOT_AUTHORIZED));

        let store = borrow_global_mut<MatchStore>(@skillforge);
        let match_ref = find_match_mut(&mut store.matches, match_id);
        assert!(match_ref.status == STATUS_IN_PROGRESS, error::invalid_state(E_MATCH_NOT_STARTED));

        // Find highest score
        let len = vector::length(&match_ref.scores);
        let best_idx: u64 = 0;
        let best_score: u64 = 0;
        let i: u64 = 0;
        while (i < len) {
            let s = *vector::borrow(&match_ref.scores, i);
            if (s > best_score) {
                best_score = s;
                best_idx = i;
            };
            i = i + 1;
        };

        match_ref.winner = *vector::borrow(&match_ref.players, best_idx);
        match_ref.status = STATUS_COMPLETED;
        match_ref.platform_fee = (match_ref.pool_amount * PLATFORM_FEE_PERCENT) / 100;
    }

    /// Distribute rewards to the winner (95% of pool)
    /// Transfers reward from contract pool to winner, fees to treasury admin
    public entry fun distribute_rewards(
        admin: &signer,
        match_id: u64,
        asset_metadata: Object<Metadata>,
    ) acquires MatchStore, Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(@skillforge);
        assert!(admin_addr == treasury.admin, error::permission_denied(E_NOT_AUTHORIZED));

        let store = borrow_global_mut<MatchStore>(@skillforge);
        let match_ref = find_match_mut(&mut store.matches, match_id);

        assert!(match_ref.status == STATUS_COMPLETED, error::invalid_state(E_MATCH_NOT_COMPLETED));
        assert!(!match_ref.reward_claimed, error::already_exists(E_ALREADY_CLAIMED));

        let reward = match_ref.pool_amount - match_ref.platform_fee;
        let winner_addr = match_ref.winner;

        // Mark as claimed
        match_ref.reward_claimed = true;

        // Update treasury fee counter
        treasury.total_fees = treasury.total_fees + match_ref.platform_fee;

        // Transfer reward tokens from contract to winner
        // The admin triggers this; funds are held under @skillforge
        primary_fungible_store::transfer(admin, asset_metadata, winner_addr, reward);
    }

    // ===== View Functions =====

    #[view]
    public fun get_match_count(): u64 acquires MatchCounter {
        borrow_global<MatchCounter>(@skillforge).count
    }

    #[view]
    public fun get_total_fees(): u64 acquires Treasury {
        borrow_global<Treasury>(@skillforge).total_fees
    }

    // ===== Internal Helpers =====

    fun find_match_mut(matches: &mut vector<Match>, match_id: u64): &mut Match {
        let len = vector::length(matches);
        let i = 0;
        while (i < len) {
            let m = vector::borrow_mut(matches, i);
            if (m.id == match_id) {
                return m
            };
            i = i + 1;
        };
        abort error::not_found(E_MATCH_NOT_FOUND)
    }
}
