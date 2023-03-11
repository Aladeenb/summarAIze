//module <account-address>::<module-name> {}

module summaraize_addr::summaraize {
    use aptos_framework::event;
    use std::string::String;
    use std::signer;
    use aptos_std::table::{Self, Table}; // This one we already have, need to modify it
    use aptos_framework::account;

    struct SummaryList has key {
        summaries: Table<u64, Summary>,
        set_summary_event: event::EventHandle<Summary>,
        summary_counter: u64
    } 

    struct Summary has store, drop, copy {
        summary_id: u64,
        address: address,
        title: String,
        input_text: String,
        output_text: String,
        approved: bool
    }

    // Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const ESUMMARY_DOESNT_EXIST: u64 = 2;
    const ESUMMARY_IS_APPROVED: u64 = 3;

    public entry fun create_list(account: &signer){
        let summaries_holder = SummaryList {
            summaries: table::new(),
            set_summary_event: account::new_event_handle<Summary>(account),
            summary_counter: 0
        };
        // move the SummaryList resource under the signer account
        move_to(account, summaries_holder);
    }

    public entry fun create_summary(
        account: &signer, 
        title: String, 
        input_text: String, 
        output_text: String, 
        ) acquires SummaryList {
        // gets the signer address
        let signer_address = signer::address_of(account);
        //assert signer has created a list
        assert!(exists<SummaryList>(signer_address), E_NOT_INITIALIZED);
        // gets the SummaryList resource
        let summary_list = borrow_global_mut<SummaryList>(signer_address);
        // increment Summary counter
        let counter = summary_list.summary_counter + 1;
        // creates a new Summary
        let new_summary = Summary {
            summary_id: counter,
            address: signer_address,
            title,
            input_text,
            output_text,
            approved: false
            };
        // adds the new summary into the summaries table
        table::upsert(&mut summary_list.summaries, counter, new_summary);
        // sets the summary counter to the incremented counter
        summary_list.summary_counter = counter;  
        // fires a new summary created event
        event::emit_event<Summary>(
            &mut borrow_global_mut<SummaryList>(signer_address).set_summary_event,
            new_summary
        );
    }

    public entry fun approve_summary(account: &signer, summary_id: u64) acquires SummaryList {
        // gets signer address
        let signer_address = signer::address_of(account);
        //assert signer has created a list
        assert!(exists<SummaryList>(signer_address), E_NOT_INITIALIZED);
        // gets SummaryList resource
        let summary_list = borrow_global_mut<SummaryList>(signer_address);
        // assert summary exists
        assert!(table::contains(&summary_list.summaries, summary_id), ESUMMARY_DOESNT_EXIST);
        // gets the summary that matches the summary_id
        let summary_record = table::borrow_mut(&mut summary_list.summaries, summary_id);
        // assert summary is not approved
        assert!(summary_record.approved == false, ESUMMARY_IS_APPROVED);
        // update summary as approved
        summary_record.approved = true;
    }

    #[test(admin = @0x123)]
    public entry fun test_flow(admin: signer) acquires SummaryList {
        // creates an admin @summarylist_addr account for test
        account::create_account_for_test(signer::address_of(&admin));
        // initialize contract with admin account
        create_list(&admin);

        // create a summary by the admin account
        create_summary(&admin, string::utf8(b"New Summary"));
        let summary_count = event::counter(&borrow_global<SummaryList>(signer::address_of(&admin)).set_summary_event);
        assert!(summary_count = 1, 4);
        let summary_list = borrow_global<SummaryList>(signer::address_of(&admin));
        assert!(summary_list.summary_counter == 1, 5);
        let summary_record = table::borrow(&summary_list.summaries, summary_list.summary_counter);
        assert!(summary_record.summary_id == 1, 6);
        assert!(summary_record.completed == false, 7);
        assert!(summary_record.title == string::utf8(b"New Summary"), 8);
        assert!(summary_record.input_text == string::utf8(b"input here"), 8);
        assert!(summary_record.output_text == string::utf8(b"output here"), 8);
        assert!(summary_record.address == signer::address_of(&admin), 9);

        // update summary as approved
        complete_task(&admin, 1);
        let summary_list = borrow_global<TodoList>(signer::address_of(&admin));
        let summary_record = table::borrow(&summary_list.tasks, 1);
        assert!(summary_record.task_id == 1, 10);
        assert!(summary_record.completed == true, 11);
        assert!(summary_record.title == string::utf8(b"New Summary"), 8);
        assert!(summary_record.input_text == string::utf8(b"input here"), 8);
        assert!(summary_record.output_text == string::utf8(b"output here"), 8);
        assert!(summary_record.address == signer::address_of(&admin), 13);
    }

}