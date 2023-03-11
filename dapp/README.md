# Dapp

## Contract logic

1. An account creates a new **summary list** 
2. An account inputs some text to the text field
   1. Whenever someone creates a new summary, emit a `summary_created` event
3. An account approves the output by hitting `approve`

- Defining `SummaryList` struct, that holds:
  - summaries array
  - new summary event
  - summary counter that counts the nr of created summaries (we can use that to differentiate between the tasks)
- Defining `Summary` struct that holds:
  - Summary ID - derived from the summary list counter
  - address - the acc address who created the summary
  - Title (including company name)
  - content - the summary content:
    - inputed text link or whatsoever
    - outputed text
  - Approved - a boolean that marks whether the summary is approved
  - Discard - a boolean that deletes the summary if true.
  > Check if Discard is needed
