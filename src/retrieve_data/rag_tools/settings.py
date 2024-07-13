from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), './../../../.env.local')
print(dotenv_path)
load_dotenv(dotenv_path)

CHAIN_ID = int(os.getenv("CHAIN_ID", "696969"))
RPC_URL = os.getenv("RPC_URL", "https://devnet.galadriel.com")
PRIVATE_KEY = os.getenv("PRIVATE_KEY_GALADRIEL")
print(PRIVATE_KEY)
STORAGE_KEY = os.getenv("PINATA_API_KEY")
ORACLE_ADDRESS = os.getenv("ORACLE_ADDRESS")
ORACLE_ABI_PATH = os.getenv(
    "ORACLE_ABI_PATH",
    "oracles/abi/ChatOracle.json",
)
MAX_DOCUMENT_SIZE_MB = 10
