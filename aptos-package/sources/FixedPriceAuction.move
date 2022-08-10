module Dollars1200PerHour::FixedPriceAuction {
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table;
    use aptos_std::event;
    use aptos_token::token;
    use std::signer;
    use std::guid;
    use std::string::String;

    const ERROR_INVALID_BUYER: u64 = 0;

    struct ListedItem has store {
        price: u64,
        locked_token: token::Token
    }

    struct ListEvent has drop, store {
        id: guid::ID,
        amount: u64,
    }

    struct BuyEvent has drop, store {
        id: guid::ID,
    }

    struct ListedItemsData has key {
        listed_items: table::Table<guid::ID, ListedItem>,
        listing_events: event::EventHandle<ListEvent>,
        buying_events: event::EventHandle<BuyEvent>,
    }

    public entry fun list_token(sender: &signer, creator: address, collection_name: String, name: String, price: u64) acquires ListedItemsData{
        let listing_id = guid::id(&guid::create(sender));
        let sender_addr = signer::address_of(sender);

        if (!exists<ListedItemsData>(sender_addr)) {
            move_to(sender, ListedItemsData {
                listed_items: table::new<guid::ID, ListedItem>(),
                listing_events: event::new_event_handle<ListEvent>(sender),
                buying_events: event::new_event_handle<BuyEvent>(sender),
            });
        };

        let token_id = token::create_token_id_raw(creator, collection_name, name, 0);
        let locked_token = token::withdraw_token(sender, token_id, 1);

        let listed_items_data = borrow_global_mut<ListedItemsData>(sender_addr);
        let listed_items = &mut listed_items_data.listed_items;

        event::emit_event<ListEvent>(
            &mut listed_items_data.listing_events,
            ListEvent { id: listing_id, amount: price },
        );

        table::add(listed_items, listing_id, ListedItem { price, locked_token});
     }

    public entry fun buy_token(sender: &signer, seller: address, guid_creation_num: u64) acquires ListedItemsData {
        let listing_id = guid::create_id(seller, guid_creation_num);
        let sender_addr = signer::address_of(sender);
        assert!(sender_addr != seller, ERROR_INVALID_BUYER);

        let listedItemsData = borrow_global_mut<ListedItemsData>(seller);
        event::emit_event<BuyEvent>(
            &mut listedItemsData.buying_events,
            BuyEvent { id: listing_id },
        );

        let ListedItem { price, locked_token } = table::remove(&mut listedItemsData.listed_items, listing_id);
        coin::transfer<AptosCoin>(sender, seller, price);
        token::deposit_token(sender, locked_token);
    }
}