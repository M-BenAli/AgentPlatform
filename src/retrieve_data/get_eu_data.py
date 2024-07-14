import json
import requests
import xml.etree.ElementTree as ET
import os
import pandas as pd
import rag_tools.settings as settings

from rag_tools.knowledgebase import load_documents_use_case
from rag_tools.knowledgebase import upload_documents_use_case
from rag_tools.knowledgebase import request_indexing_use_case
from langchain.text_splitter import RecursiveCharacterTextSplitter


url_endpoint = "https://data.europarl.europa.eu/api/v2/"
DOCS_DIR = "data/pdf_text"
XML_DIR = "data/xml_results"
CHUNK_SIZE = 1500
CHUNK_OVERLAP = 200

def get_plenary_meetings(years = [2022, 2023, 2024]) :
    target = "meetings"
    activity_ids = []
    for year in years :
        parameters = f"year={year}&format=application%2Fld%2Bjson&offset=0"
        url = url_endpoint + target + "?" + parameters
        response = requests.get(url)
        json_data = response.json()['data']
        for activity in json_data:
            activity_ids.append(activity['activity_id'])
    return activity_ids


def get_request(url) : 
    response = requests.get(url)
    if response.status_code != 200 :
        print("Error during the request")
    else : 
        return response

def get_all_results(activity_result_id) :
    download_xml_result_file(activity_result_id)
    results = pd.DataFrame(parse_xml(f"{XML_DIR}/{activity_result_id}-RCV_EN.xml"))
    return results


def get_votes(MTP_ID) : 
    """Get the votes (i.e. the topics of the votes, not the results of the votes) 
    of a Plenary Session."""
    target = f"meetings/{MTP_ID}/vote-results"
    parameters = f"format=application%2Fld%2Bjson&offset=0"#&limit=5"
    url = url_endpoint + target + "?" + parameters
    response = get_request(url)
    json_data = response.json()['data']

    votes = []
    activity_result_id = json_data[0]["recorded_in_a_realization_of"][0].split("/")[-1].split("-VOT")[0]
    #activity_result_id = MTP_ID
    all_results = get_all_results(activity_result_id)
    for vote in json_data:
        try : 
            activity_id = vote['activity_id']
            id = activity_id.split("-")[-1]
            activity_label = vote['activity_label']["en"]
            activity_file_id = vote["based_on_a_realization_of"][0].split("/")[-1]
            activity_file_title = get_document_title(activity_file_id)
            result_row = all_results[all_results['Vote_id'] == id]
            if not result_row.empty : 
                if not result_row.empty:
                    sample_votes_for = result_row.iloc[0]['VotesFor']
                    sample_votes_against = result_row.iloc[0]['VotesAgainst']
                    sample_votes_abstention = result_row.iloc[0]['VotesAbstention']
                else:
                    sample_votes_for = sample_votes_against = sample_votes_abstention = []
                
                votes.append({
                    "activity_id": id,
                    "activity_label": activity_label,
                    "activity_file_id": activity_file_id,
                    "activity_file_title": activity_file_title,
                    "activity_result_id": activity_result_id,
                    "VotesFor": sample_votes_for,
                    "VotesAgainst": sample_votes_against,
                    "VotesAbstention": sample_votes_abstention,
                    "cid": ""
                })
        except KeyError as e :
            pass #no documents voted for
        except Exception as e : 
            print("Error : ", e)
    return votes
    

def get_document_title(doc_id) : 
    target = "documents/"
    parameters = f"format=application%2Fld%2Bjson&language=en"
    url = url_endpoint + target + doc_id + "?" + parameters
    response = get_request(url)
    json_data = response.json()['data']
    return json_data[0]['title_dcterms']['en']


def upload_pdf_to_ipfs(file_id) :
    file_path = f"{DOCS_DIR}/{file_id}.pdf"
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        is_separator_regex=False,
    )
    documents = load_documents_use_case.execute(file_path, text_splitter)
    print("Uploading documents to IPFS, please wait...", end="")
    cid: str = upload_documents_use_case.execute(documents)
    print(f"done.")
    print("Requesting indexing, please wait...",end="")
    response = request_indexing_use_case.execute(cid)
    if response.is_processed and response.index_cid:
        print("done.")
        print(f"Knowledge base indexed, index CID `{response.index_cid}`.")
        print(f"Use CID `{cid}` in your contract to query the indexed knowledge base.")
    else:
        print("failed.")
        print(response.error or "Failed to index knowledge base.")

    
def download_pdf_from_fileId(file_id) : 
    url = f"https://www.europarl.europa.eu/doceo/document/{file_id}_EN.pdf"
    output_path = f"{DOCS_DIR}/{file_id}.pdf"
    if not os.path.exists(f"{DOCS_DIR}/{file_id}.pdf"):
        response = requests.get(url)
        # Check if the request was successful
        if response.status_code == 200:
            # Open a local file in binary write mode
            with open(output_path, 'wb') as file:
                # Write the content of the response (PDF file) to the local file
                file.write(response.content)
            print(f"✅ PDF downloaded and saved as {output_path}")
        else:
            print(f"❌ Failed to download PDF. Status code: {response.status_code}")

def download_xml_result_file(file_id) :
    url = f"https://www.europarl.europa.eu/doceo/document/{file_id}-RCV_EN.xml"
    output_path = f"{XML_DIR}/{file_id}-RCV_EN.xml"
    if not os.path.exists(f"{XML_DIR}/{file_id}-RCV_EN.xml"):
        response = requests.get(url)
        # Check if the request was successful
        if response.status_code == 200:
            # Open a local file in binary write mode
            with open(output_path, 'wb') as file:
                # Write the content of the response (PDF file) to the local file
                file.write(response.content)
            print(f"✅ XML downloaded and saved as {output_path}")
        else:
            print(f"❌ Failed to download XML. Status code: {response.status_code}")


def parse_xml(file_path):
    # Parse the XML file
    tree = ET.parse(file_path)
    root = tree.getroot()

    # Namespace map
    ns = {
        'ns': 'http://openoffice.org/2000/office'
    }

    # Extract the relevant data
    roll_call_votes = []
   
    for vote in root.findall(".//VoteTitles/VoteTitle") :
        vote_id = vote.attrib.get("DlvId")
        vote_title = vote.text 
        result = root.find(f'.//RollCallVote.Result[@DlvId="{vote_id}"]')
        votes_for = [member.attrib['MepId'] for member in result.findall(".//Result.For//PoliticalGroup.Member.Name")]
        votes_against = [member.attrib['MepId'] for member in result.findall(".//Result.Against//PoliticalGroup.Member.Name")]
        votes_abstention = [member.attrib['MepId'] for member in result.findall(".//Result.Abstention//PoliticalGroup.Member.Name")]
        roll_call_votes.append({
            'Vote_id': vote_id,
            'Vote_title': vote_title,
            'VotesFor': votes_for,
            'VotesAgainst': votes_against,
            'VotesAbstention': votes_abstention
        })
    return roll_call_votes




#1. get plenary session 
#plenary_meetings = get_plenary_meetings()
#Let's start with only one for now : 
plenary_meetings = ['MTG-PL-2024-01-15', 'MTG-PL-2024-01-16', 'MTG-PL-2024-01-17', 'MTG-PL-2024-01-18', 'MTG-PL-2024-01-25', 'MTG-PL-2024-02-05', 'MTG-PL-2024-02-06', 'MTG-PL-2024-02-07', 'MTG-PL-2024-02-08', 'MTG-PL-2024-02-26', 'MTG-PL-2024-02-27', 'MTG-PL-2024-02-28']
votes = []
#2. get all the votes (name, refering data, voting results) for each session
print("Collecting votes for each session...")
for session in plenary_meetings : 
    votes += get_votes(session)

#2.5 Create a new directory and save the votes in a json file
"""if not os.path.exists("data/votes_data") : 
    os.makedirs("data/votes_data")
with open("data/votes_data/votes.json", "w") as f :
    json.dump(votes, f)"""


#3. download pdf files and upload on IPFS

for vote in votes : 
    download_pdf_from_fileId(vote['activity_file_id'])
    print(vote['activity_id'], " | ", vote['activity_label'], "\n", "For: ", len(vote['VotesFor']), "Against: ", len(vote['VotesAgainst']), "Abstention: ", len(vote['VotesAbstention']))
    upload_pdf_to_ipfs(vote['activity_file_id'])


#upload_pdf_to_ipfs("MTG-PL-2024-04-23")
