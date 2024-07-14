## Retrieve data

The data is retrieved from the [Open Data Portal](https://data.europarl.europa.eu/en/developer-corner/opendata-api) maintained by the Europen Parliament 🇪🇺. 

Some data file are already in the `data/` directory, and published to the smartcontract and on IPFS.
However, if you want to reproduce the data retrieval, follow these steps.

### Usage
Be sure you are in the `src/retrieve_data/` directory
```bash
cd src/retrieve_data
```

Remove (if desired) the existing data : 
```bash
rm data/pdf_text* data/xml_results data/votes_data
```

Run the script : 
```bash 
python3 get_eu_data.py
```






#### API

There is an API ([`https://data.europarl.europa.eu/api/v2/`](https://data.europarl.europa.eu/api/v2/)) that was used to retrieve : 

- all plenary meetings of a year,
- all the things that were voted during this session (title, documents, resolutions, … but **not** the individual votes of each MEP, nor the results of the votes),
- the title of a documents, based on its ELI id

#### Other sources

[`https://www.europarl.europa.eu/doceo/document//{file_id}_EN.pdf`]() allows to get a file, in the English version, based on its id (e.g. a Directive or a Report)

[`https://www.europarl.europa.eu/doceo/document/{plenary_session_id}-RCV_EN.xml`](https://www.europarl.europa.eu/doceo/document/%7Bfile_id%7D-RCV_EN.xml) allows to get an XML file containing all votes of a planary session. 

In the XML file, we can find the votes of each individual MEP (”for”, “against”, or “abstention”) for each voting of the session. 

By merging the data retrieved from the API with the associated votes results, we can get find who voted for what.

The data is store in the `retrieve_data/data` directory.
The instruction to retrieve the data are described in `retrieve_data/readme.md`.
 