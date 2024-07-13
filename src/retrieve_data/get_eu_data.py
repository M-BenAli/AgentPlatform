import json
import requests
import xml.etree.ElementTree as ET
import os


url_endpoint = "https://data.europarl.europa.eu/api/v2/"
DOCS_DIR = "data/pdf_text"
XML_DIR = "data/xml_results"

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
    results = parse_xml(f"{XML_DIR}/{activity_result_id}-RCV_EN.xml")
    print(results)
    return results


def get_votes(MTP_ID) : 
    """Get the votes (i.e. the topics of the votes, not the results of the votes) 
    of a Plenary Session."""
    target = f"meetings/{MTP_ID}/vote-results"
    parameters = f"format=application%2Fld%2Bjson&offset=0"#&limit=5"
    url = url_endpoint + target + "?" + parameters
    print("GET" , url)
    response = get_request(url)
    json_data = response.json()['data']
    votes = []
    #activity_result_id = json_data[0]["recorded_in_a_realization_of"][0].split("/")[-1].split("-VOT")[0]
    activity_result_id = MTP_ID
    all_results = get_all_results(activity_result_id)
    for vote in json_data:
        try : 
            activity_id = vote['activity_id']
            activity_label = vote['activity_label']["en"]
            #print(vote['activity_id'], vote['activity_label']["en"])
            activity_file_id = vote["based_on_a_realization_of"][0].split("/")[-1]
            activity_file_title = get_document_title(activity_file_id)
            
            print("\n===\n")
            print(activity_id, "|", activity_label, "\n", "file_id=",activity_file_id, "file_result=", activity_result_id, "\n", "file_title=",activity_file_title)
            votes.append({"activity_id":activity_id, "activity_label":activity_label, "activity_file_id":activity_file_id, "activity_file_title":activity_file_title, "activity_result_id":activity_result_id})
            #download_pdf_from_fileId(activity_file_id)
            ##download_xml_result_file(activity_result_id)
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



def download_pdf_from_fileId(file_id) : 
    url = f"https://www.europarl.europa.eu/doceo/document/{file_id}_EN.pdf"
    print(url)
    response = requests.get(url)
    output_path = f"{DOCS_DIR}/{file_id}.pdf"
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
    if not os.path.exists(XML_DIR):
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
#get_plenary_meetings()
#Let's start with only one for now : 
planary_meetings = ["MTG-PL-2024-04-23"]

#2. get all the votes (name, refering data, voting results) for each session
for session in planary_meetings : 
    votes = get_votes(session)
    
"""
now, parse the XML files to get the voting results BEFORE I get each title individually
then combine voting title and voting results

then do the documentation, else I won't have time or i'll forget later
"""