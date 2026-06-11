import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def analyze_url(url: str) -> dict:
    """
    Analiza una URL para obtener métricas de accesibilidad, SEO y rendimiento.
    Retorna un diccionario con los scores (0-100) y las issues detectadas.
    """
    # Validar URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
        
    issues = []
    
    # --- Rendimiento ---
    start_time = time.time()
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        return {
            "scores": {"accessibility": 0, "seo": 0, "performance": 0},
            "issues": [{
                "category": "onto:Performance",
                "status": "onto:Critical",
                "description": f"Error al conectar con la URL: {str(e)}"
            }]
        }
    
    load_time = time.time() - start_time
    html_content = response.text
    page_size_kb = len(html_content) / 1024
    
    # Calcular performance score (simple heurística)
    # < 1s: 100, > 5s: 0
    perf_score = max(0, min(100, 100 - (load_time - 1) * 25))
    if load_time > 3:
        issues.append({
            "category": "onto:Performance",
            "status": "onto:Critical",
            "description": f"Tiempo de carga muy lento ({load_time:.2f}s). Se recomienda optimizar recursos."
        })
    elif load_time > 1.5:
        issues.append({
            "category": "onto:Performance",
            "status": "onto:Warning",
            "description": f"Tiempo de carga mejorable ({load_time:.2f}s)."
        })
        
    if page_size_kb > 2000:
        issues.append({
            "category": "onto:Performance",
            "status": "onto:Warning",
            "description": f"Tamaño de página grande ({page_size_kb:.0f}KB). Se recomienda comprimir o reducir contenido."
        })

    # Analizar DOM
    soup = BeautifulSoup(html_content, 'lxml')
    
    # --- Accesibilidad ---
    a11y_score = 100
    
    images = soup.find_all('img')
    images_without_alt = [img for img in images if not img.get('alt')]
    if images_without_alt:
        penalty = min(40, len(images_without_alt) * 5)
        a11y_score -= penalty
        status = "onto:Critical" if penalty > 20 else "onto:Warning"
        issues.append({
            "category": "onto:Accessibility",
            "status": status,
            "description": f"{len(images_without_alt)} etiquetas <img> sin atributo alt. Se sugiere agregar texto alternativo descriptivo."
        })
        
    if not soup.html.get('lang'):
        a11y_score -= 10
        issues.append({
            "category": "onto:Accessibility",
            "status": "onto:Warning",
            "description": "Falta el atributo 'lang' en la etiqueta <html>."
        })

    # --- SEO ---
    seo_score = 100
    
    title = soup.find('title')
    if not title or not title.string or not title.string.strip():
        seo_score -= 30
        issues.append({
            "category": "onto:SEO",
            "status": "onto:Critical",
            "description": "Falta la etiqueta <title> o está vacía."
        })
        
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if not meta_desc or not meta_desc.get('content'):
        seo_score -= 30
        issues.append({
            "category": "onto:SEO",
            "status": "onto:Critical",
            "description": "Falta la etiqueta <meta name='description'>."
        })
        
    h1_tags = soup.find_all('h1')
    if len(h1_tags) == 0:
        seo_score -= 20
        issues.append({
            "category": "onto:SEO",
            "status": "onto:Warning",
            "description": "No se encontró ninguna etiqueta <h1> en la página."
        })
    elif len(h1_tags) > 1:
        seo_score -= 10
        issues.append({
            "category": "onto:SEO",
            "status": "onto:Warning",
            "description": f"Se encontraron {len(h1_tags)} etiquetas <h1>. Se recomienda usar solo una por página."
        })

    return {
        "scores": {
            "accessibility": max(0, a11y_score),
            "seo": max(0, seo_score),
            "performance": max(0, perf_score)
        },
        "issues": issues
    }
