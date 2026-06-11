import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

MONGO_URI = "mongodb+srv://Billyow:2002rock@cluster0.wgxtmkn.mongodb.net/?appName=Cluster0"

async def check():
    client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
    db = client["sem_web_advisor"]
    col = db["audit_reports"]
    
    docs = await col.find().sort("schema:dateCreated", -1).limit(3).to_list(length=3)
    print(f"Total reportes en DB (últimos 3): {len(docs)}")
    for i, doc in enumerate(docs):
        print(f"\n--- REPORTE {i+1} ---")
        print("Date:", doc.get("schema:dateCreated"))
        print("URL:", doc.get("schema:url", doc.get("url")))
        print("Score:", doc.get("onto:fuzzyVerdict", {}).get("schema:value", doc.get("healthScore")))
        recs = doc.get("onto:Recommendation", doc.get("recommendations", []))
        print("Recomendaciones encontradas:", len(recs))
        for r in recs:
            if isinstance(r, dict):
                print(" -", r.get("schema:description", r))
            else:
                print(" -", r)

if __name__ == "__main__":
    asyncio.run(check())
