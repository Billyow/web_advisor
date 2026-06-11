from datetime import datetime, timezone

def build_json_ld_report(url: str, fuzzy_score: float, fuzzy_label: str, issues: list) -> dict:
    """
    Construye el documento JSON-LD usando el esquema de la ontología web.
    """
    
    recommendations = []
    for issue in issues:
        recommendations.append({
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": issue["status"]},
            "onto:suggestsAction": {"@id": issue["category"]},
            "schema:description": issue["description"]
        })
        
    # Añadir recomendación general si no hay issues pero el score no es perfecto
    if not recommendations and fuzzy_score < 100:
        recommendations.append({
            "@type": "onto:Recommendation",
            "onto:hasStatus": {"@id": "onto:Acceptable"},
            "onto:suggestsAction": {"@id": "onto:BestPractices"},
            "schema:description": "El sitio cumple con los estándares generales. Monitorear para mantener este nivel."
        })

    report = {
        "@context": {
            "schema": "https://schema.org/",
            "onto": "http://www.semanticweb.org/jorge/ontologies/2026/5/untitled-ontology-4#"
        },
        "@type": "schema:Dataset",
        "schema:name": "Auditoría SEM-Web-Advisor",
        "schema:dateCreated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "schema:url": url,
        "onto:fuzzyVerdict": {
            "schema:value": round(fuzzy_score, 1),
            "schema:description": fuzzy_label
        },
        "onto:Recommendation": recommendations
    }
    
    return report
