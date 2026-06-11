import requests
import time

API_URL = "http://127.0.0.1:8001/api/audit-reports"

def test():
    print("--- 1. Probando Health Check de FastAPI ---")
    try:
        res = requests.get("http://127.0.0.1:8000/")
        print("Health Check:", res.json())
    except Exception as e:
        print("Error conectando a FastAPI:", e)
        return

    print("\n--- 2. Enviando petición de Auditoría (POST) ---")
    payload = {"url": "https://ejemplo.com"}
    res = requests.post(f"{API_URL}/audit", json=payload)
    print("Status Code:", res.status_code)
    try:
        print("Response:", res.json())
    except:
        print("Response:", res.text)
        
    print("\n--- 3. Esperando que los agentes trabajen... (10s) ---")
    for i in range(10):
        print(f"Esperando... {10-i}s", end="\r")
        time.sleep(1)
        
    print("\n\n--- 4. Obteniendo el último reporte (GET) ---")
    res = requests.get(f"{API_URL}/latest")
    print("Status Code:", res.status_code)
    try:
        report = res.json()
        print("\nURL:", report.get("url"))
        print("Status:", report.get("status"))
        print("Salud:", report.get("healthScore"))
        print("Recomendaciones:", report.get("recommendations"))
    except:
        print("Response:", res.text)

if __name__ == "__main__":
    test()
